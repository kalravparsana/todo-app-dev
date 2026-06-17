#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
: "${INFRA_STACK:?}"
: "${DEPLOY_ENVIRONMENT:?}"
: "${BACKEND_STACK_NAME:?}"
: "${FRONTEND_STACK_NAME:?}"

if [[ -d "$ROOT/Frontend" ]]; then
  FRONTEND_LAYER_DIR="$ROOT/Frontend"
elif [[ -d "$ROOT/frontend" ]]; then
  FRONTEND_LAYER_DIR="$ROOT/frontend"
else
  echo "No frontend layer directory found (expected Frontend/ or frontend/)" >&2
  exit 1
fi

read_cfn_param() {
  local params_file="$1"
  local key="$2"
  node -e "
    const fs = require('fs');
    const key = process.argv[1];
    const file = process.argv[2];
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    const row = rows.find((r) => r.ParameterKey === key);
    process.stdout.write(row ? String(row.ParameterValue ?? '') : '');
  " "$key" "$params_file"
}

patch_cfn_param() {
  local params_file="$1"
  local key="$2"
  local value="$3"
  node -e "
    const fs = require('fs');
    const [key, value, file] = process.argv.slice(1);
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    const index = rows.findIndex((r) => r.ParameterKey === key);
    if (index >= 0) rows[index].ParameterValue = value;
    else rows.push({ ParameterKey: key, ParameterValue: value });
    fs.writeFileSync(file, JSON.stringify(rows, null, 2) + '\n');
  " "$key" "$value" "$params_file"
}

log_stack_failure_events() {
  local stack_name="$1"
  echo "CloudFormation failure events for stack: $stack_name" >&2
  aws cloudformation describe-stack-events --stack-name "$stack_name" \
    --query 'StackEvents[?ResourceStatus==`CREATE_FAILED` || ResourceStatus==`UPDATE_FAILED` || ResourceStatus==`ROLLBACK_IN_PROGRESS`].[Timestamp,LogicalResourceId,ResourceStatusReason]' \
    --output text 2>/dev/null | tail -n 5 >&2 || true
}

recover_failed_stack() {
  local stack_name="$1"
  local status
  status="$(aws cloudformation describe-stacks --stack-name "$stack_name" \
    --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "NOT_FOUND")"
  case "$status" in
    ROLLBACK_COMPLETE|ROLLBACK_FAILED|DELETE_FAILED)
      echo "Recovering failed stack $stack_name (status: $status)" >&2
      aws cloudformation delete-stack --stack-name "$stack_name"
      aws cloudformation wait stack-delete-complete --stack-name "$stack_name"
      ;;
  esac
}

prepare_backend_ecr_image() {
  local params="$ROOT/backend/parameters.json"
  [[ -f "$params" ]] || { echo "Missing backend/parameters.json" >&2; exit 1; }

  local repo_name image_tag account_id region repo_uri image_uri
  repo_name="$(read_cfn_param "$params" "EcrRepositoryName")"
  image_tag="${ECR_IMAGE_TAG:-latest}"
  region="${AWS_DEFAULT_REGION:?}"
  account_id="$(aws sts get-caller-identity --query Account --output text)"
  repo_uri="${account_id}.dkr.ecr.${region}.amazonaws.com/${repo_name}"
  image_uri="${repo_uri}:${image_tag}"

  aws ecr describe-repositories --repository-names "$repo_name" >/dev/null 2>&1 || \
    aws ecr create-repository --repository-name "$repo_name" >/dev/null

  aws ecr get-login-password --region "$region" | \
    docker login --username AWS --password-stdin "${account_id}.dkr.ecr.${region}.amazonaws.com"

  docker build -t "$image_uri" "$ROOT/backend"
  docker push "$image_uri"

  patch_cfn_param "$params" "EcrImageUri" "$image_uri"
  echo "Pushed ECR image: $image_uri"
}

prepare_backend_artifact() {
  if [[ -f "$ROOT/backend/Dockerfile" ]]; then
    prepare_backend_ecr_image
  fi
}

deploy_cloudformation_layer() {
  local layer_dir="$1"
  local stack_name="$2"
  local template="cloudformation-template.yaml"
  local params="parameters.json"

  recover_failed_stack "$stack_name"

  local -a cap_args=()
  if grep -q 'RoleName:' "$layer_dir/$template" 2>/dev/null; then
    cap_args+=(--capabilities CAPABILITY_NAMED_IAM)
  fi

  local -a param_args=()
  if [[ -f "$layer_dir/$params" ]]; then
    param_args+=(--parameters "file://${params}")
  fi

  (
    cd "$layer_dir"
    if aws cloudformation describe-stacks --stack-name "$stack_name" >/dev/null 2>&1; then
      aws cloudformation update-stack \
        --stack-name "$stack_name" \
        --template-body "file://${template}" \
        "${param_args[@]}" "${cap_args[@]}" || {
          local err=$?
          if aws cloudformation describe-stacks --stack-name "$stack_name" \
            --query 'Stacks[0].StackStatus' --output text 2>/dev/null | grep -q 'IN_PROGRESS'; then
            echo "Stack update already in progress for $stack_name" >&2
          else
            log_stack_failure_events "$stack_name"
            exit $err
          fi
        }
      aws cloudformation wait stack-update-complete --stack-name "$stack_name" || {
        log_stack_failure_events "$stack_name"
        exit 1
      }
    else
      aws cloudformation create-stack \
        --stack-name "$stack_name" \
        --template-body "file://${template}" \
        "${param_args[@]}" "${cap_args[@]}" || {
        log_stack_failure_events "$stack_name"
        exit 1
      }
      aws cloudformation wait stack-create-complete --stack-name "$stack_name" || {
        log_stack_failure_events "$stack_name"
        exit 1
      }
    fi
  )
}

deploy_terraform_layer() {
  local layer_dir="$1"
  (cd "$layer_dir" && terraform init && terraform apply -auto-approve)
}

main() {
  if [[ "$INFRA_STACK" == "cloudformation" ]]; then
    prepare_backend_artifact
    deploy_cloudformation_layer "$ROOT/backend" "$BACKEND_STACK_NAME" &
    local backend_pid=$!
    deploy_cloudformation_layer "$FRONTEND_LAYER_DIR" "$FRONTEND_STACK_NAME" &
    local frontend_pid=$!
    wait "$backend_pid"
    wait "$frontend_pid"
  elif [[ "$INFRA_STACK" == "terraform" ]]; then
    prepare_backend_artifact
    deploy_terraform_layer "$ROOT/backend"
    deploy_terraform_layer "$FRONTEND_LAYER_DIR"
  else
    echo "Unsupported INFRA_STACK: $INFRA_STACK" >&2
    exit 1
  fi

  # Phase D (post-deploy, documented only — not executed here):
  # 1. aws cloudformation describe-stacks --stack-name "$BACKEND_STACK_NAME" --query 'Stacks[0].Outputs'
  # 2. Set VITE_API_BASE_URL in Frontend/.env from ApiUrl output
  # 3. cd Frontend && npm ci && npm run build
  # 4. aws s3 sync dist/ s3://<BucketName>/ --delete
  # 5. aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"
}

main "$@"

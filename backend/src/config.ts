function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DATABASE_HOST;
  const name = process.env.DATABASE_NAME;
  const user = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;
  const port = process.env.DATABASE_PORT ?? '5432';

  if (host && name && user && password) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
  }

  return '';
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: buildDatabaseUrl(),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

export function getDatabaseConfig() {
  const name = process.env.INTEGRATION_POSTGRES_DB;
  const host = process.env.INTEGRATION_POSTGRES_HOST;
  const port = process.env.INTEGRATION_POSTGRES_PORT;
  const user = process.env.INTEGRATION_POSTGRES_USER;
  const password = process.env.INTEGRATION_POSTGRES_PASSWORD;
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${name}`;
  const connectionStringWithoutDb = `postgres://${user}:${password}@${host}:${port}/postgres`;

  return {
    name,
    port,
    user,
    password,
    connectionString,
    connectionStringWithoutDb,
  };
}

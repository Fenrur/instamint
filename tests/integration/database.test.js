const { GenericContainer } = require('testcontainers');
const { Pool } = require('pg');

describe('PostgreSQL Container Test', () => {
  let container;
  let pool

  beforeAll(async () => {
    [container] = await Promise.all([new GenericContainer('postgres')
      .start()]);
    const containerPort = container.getMappedPort(5432);
    const containerHost = container.getHost();

    pool = new Pool({
      host: containerHost,
      port: containerPort,
      user: 'test',
      password: 'test',
      database: 'testdatabase',
    });
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
    if (container) {
      await container.stop();
    }
  });

  test('connexion to databasetest', async () => {
    const response = await pool.query('SELECT 1');
    expect(response.rows[0]['?column?']).toBe(1);
  });
});

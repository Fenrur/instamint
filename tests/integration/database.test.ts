// Importez les classes nécessaires à partir de 'testcontainers'
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Pool } from 'pg';

describe('Database Integration Test', () => {
  let pool: Pool;
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer('postgres')
      .withEnv('POSTGRES_USER', 'user')
      .withEnv('POSTGRES_PASSWORD', 'password')
      .withEnv('POSTGRES_DB', 'testdb')
      .withExposedPorts(5432)
      .start();

    pool = new Pool({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      database: 'testdb',
      user: 'user',
      password: 'password',
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

  test('should insert a row into test_table and find it', async () => {
    // Création de la table test_table si elle n'existe pas
    await pool.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, text VARCHAR(255));');

    // Insertion d'une nouvelle ligne dans test_table
    const insertText = 'Test row';
    await pool.query('INSERT INTO test_table (text) VALUES ($1)', [insertText]);

    // Vérification de la présence de la ligne
    const res = await pool.query('SELECT * FROM test_table WHERE text = $1', [insertText]);
    expect(res.rows[0].text).toBe(insertText);
  });
});

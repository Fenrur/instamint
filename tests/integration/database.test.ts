import { GenericContainer, WaitStrategy } from 'testcontainers';

describe('LoginPage Integration Test', () => {
  let postgresContainer: any;
  let appContainer: any;

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres')
      .withEnv('POSTGRES_USER', 'user')
      .withEnv('POSTGRES_PASSWORD', 'password')
      .withEnv('POSTGRES_DB', 'testdb')
      .withExposedPorts(5432)
      .withWaitStrategy(WaitStrategy.forLogMessage('database system is ready to accept connections'))
      .start();

    appContainer = await new GenericContainer('node')
      .withExposedPorts(3000)
      .withCmd(['npm', 'run', 'dev'])
      .withBindMount('./', '/app')
      .withWorkingDirectory('/app')
      .withWaitStrategy(WaitStrategy.forLogMessage('ready - started server on'))
      .start();
  });

  afterAll(async () => {
    if (appContainer) {
      await appContainer.stop();
    }
    if (postgresContainer) {
      await postgresContainer.stop();
    }
  });

  // ... Rest of your tests
});

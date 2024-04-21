import {GenericContainer, StartedTestContainer} from 'testcontainers'
import axios from 'axios'

describe('LoginPage Integration Test', () => {
  let postgresContainer: any

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres')
      .withEnv('POSTGRES_USER', 'user')
      .withEnv('POSTGRES_PASSWORD', 'password')
      .withEnv('POSTGRES_DB', 'testdb')
      .withExposedPorts(5432)
      .start()
  })

  afterAll(async () => {
    if (postgresContainer) {
      await postgresContainer.stop()
    }
  })

  test('should authenticate user with valid credentials', async () => {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: 'user@example.com',
      password: 'password'
    })

    expect(response.status).toBe(200)
  })
})


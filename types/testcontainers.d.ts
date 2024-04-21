declare module 'testcontainers' {
  interface GenericContainer {
    withEnv(key: string, value: string): GenericContainer;
    withCmd(cmd: string[]): GenericContainer;
  }
}

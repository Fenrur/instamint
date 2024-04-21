declare module 'testcontainers' {
  export class GenericContainer {
    constructor(image: string);
    withEnv(key: string, value: string): GenericContainer;
    withExposedPorts(...ports: number[]): GenericContainer;
    start(): Promise<StartedTestContainer>;
  }

  export interface StartedTestContainer {
    stop(): Promise<void>;
    getMappedPort(port: number): number;
  }
}

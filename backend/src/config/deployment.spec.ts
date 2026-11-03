import { getDeploymentConfig } from './deployment';

describe('deployment configuration', () => {
  it('keeps local defaults for development', () => {
    expect(getDeploymentConfig({})).toEqual({
      origin: 'http://localhost:5173',
      port: 3000,
      secureCookie: false,
    });
  });

  it('uses the public origin and assigned port in production', () => {
    expect(
      getDeploymentConfig({
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://todo.onreza.app',
        PORT: '8080',
      }),
    ).toEqual({
      origin: 'https://todo.onreza.app',
      port: 8080,
      secureCookie: true,
    });
  });
});

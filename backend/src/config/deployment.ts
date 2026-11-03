export function getDeploymentConfig(env: NodeJS.ProcessEnv) {
  return {
    origin: (env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, ''),
    port: Number(env.PORT ?? 3000),
    secureCookie: env.NODE_ENV === 'production',
  };
}

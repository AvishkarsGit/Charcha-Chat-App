function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}


export const env = {
  mongo_uri: requireEnv('MONGO_URL'),
  access_token_secrete: requireEnv('ACCESS_TOKEN_SECRETE'),
  refresh_token_secrete: requireEnv('REFRESH_TOKEN_SECRETE'),
  sendgrid_api: requireEnv('PROD_SENDGRID_API'),
  sendgrid_sender_email: requireEnv('PROD_SENDGRID_SENDER_EMAIL'),
}
export const DevEnvironment = {
  mongo_uri: process.env.MONGO_URL,
  access_token_secrete: process.env.ACCESS_TOKEN_SECRETE,
  refresh_token_secrete: process.env.REFRESH_TOKEN_SECRETE,
  resend_email_api_key: process.env.RESEND_EMAIL,
  resend_from_email: process.env.RESEND_FROM_EMAIL,
  sendgrid_api: process.env.PROD_SENDGRID_API,
  sendgrid_sender_email: process.env.PROD_SENDGRID_SENDER_EMAIL,
};

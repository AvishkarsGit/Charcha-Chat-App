import { DevEnvironment } from "./dev.environment";
import { ProdEnvironment } from "./prod.environment";

export interface Environment {
  mongo_uri: string;
  access_token_secrete: string;
  refresh_token_secrete: string;
  resend_email_api_key: string;
  resend_from_email: string;
  sendgrid_api: string;
  sendgrid_sender_email: string;
}

export function getEnvironmentsVariable() {
  if (process.env.NODE_ENV === "production") {
    return ProdEnvironment;
  }
  return DevEnvironment;
}

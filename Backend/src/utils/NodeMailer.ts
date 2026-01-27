import { getEnvironmentsVariable } from "../environments/environment";
import nodeMailer from "nodemailer";
import SendGrid from "nodemailer-sendgrid-transport";
export class NodeMailer {
  static initialTransport() {
    return nodeMailer.createTransport(
      SendGrid({
        auth: {
          api_key: getEnvironmentsVariable().sendgrid_api,
        },
      })
    );
  }

  static sendEmail(data: {
    to: string[];
    subject: string;
    html: string;
  }): Promise<any> {
    return NodeMailer.initialTransport().sendMail({
      from: getEnvironmentsVariable().sendgrid_sender_email,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}

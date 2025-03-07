import { injectable } from "inversify";
import { IEmailService } from "./email.service.interface";
import { SendMailDto } from "./mail.dto";
import { MailOptions } from "nodemailer/lib/smtp-transport";
import transporter from "./mailer";
import { InternalError } from "../../../core/utils/app.errors";

@injectable()
export class EmailService implements IEmailService {

    async sendMail(data: SendMailDto): Promise<void> {
        try {
          const mailOptions: MailOptions = {
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: data.subject,
            text: data.text, 
            html: data.html, 
            attachments: data.attachments, 
          };
    
          const info = await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Error sending email:", error);
          throw new InternalError("Failed to send mail")
        }
      }
}
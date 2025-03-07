import { MailOptions } from "nodemailer/lib/smtp-transport";

export interface SendMailDto {
    to: string;
    subject: string;
    text?: string; 
    html?: string;
    attachments?: MailOptions["attachments"]; 
  }
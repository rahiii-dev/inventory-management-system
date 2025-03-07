import { SendMailDto } from "./mail.dto";

export interface IEmailService {
    sendMail(data: SendMailDto): Promise<void>
}
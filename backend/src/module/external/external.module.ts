import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { TokenService } from "./token/token.service";
import { ITokenService } from "./token/token.service.interface";
import { IPDFService } from "./pdf/pdf.interface";
import { PDFService } from "./pdf/pdf.service";
import { IExcelService } from "./excel/excel.service.interface";
import { ExcelService } from "./excel/excel.service";
import { IEmailService } from "./email/email.service.interface";
import { EmailService } from "./email/email.service";

export function loadExternalContainer(container: Container) {
    container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
    container.bind<IPDFService>(TYPES.PDFService).to(PDFService);
    container.bind<IExcelService>(TYPES.ExcelService).to(ExcelService);
    container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
}
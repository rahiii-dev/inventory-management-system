import TYPES from '../../core/container/container.types';
import { Container } from "inversify";
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { IReportService } from './interfaces/report.service.interface';

function loadReportContainer(container: Container) {
    container.bind<ReportController>(TYPES.ReportController).to(ReportController);
    container.bind<IReportService>(TYPES.ReportService).to(ReportService);
}

export { loadReportContainer };
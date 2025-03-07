import axios from "../lib/axios";
import { IItemReport, ISalesReport, ReportExportType } from "../types/report.interface";
import { apiWrapper } from "../utils/helper";

const baseUrl = "/report";

const exportReport = async (url: string, filter: any, defaultFilename: string) => {
    try {
        const type = filter.type === "print" ? "pdf" : filter.type;
        const response = await axios.get(url, {
            params: { ...filter, type },
            responseType: "blob",
        });

        if (!response || !response.data) throw new Error("No data received");

        const fileExtension = type === "excel" ? "xlsx" : "pdf";
        const filename = `${defaultFilename}.${fileExtension}`;

        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const fileUrl = window.URL.createObjectURL(blob);

        if (filter.type === "print") {
            const printWindow = window.open(fileUrl, "_blank");
            if (printWindow) {
                printWindow.onload = () => printWindow.print();
            } else {
                console.error("Popup blocked! Please allow pop-ups for printing.");
            }
        } else if (!filter.email) {
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(fileUrl);
        }
    } catch (error) {
        console.error("Report export failed:", error);
        throw new Error("Error exporting report. Please try again.");
    }
};

export const getItemReport = async (filter: { productId: string; startDate: Date; endDate: Date }): Promise<IItemReport> => {
    return (await apiWrapper(axios.get<IItemReport>(`${baseUrl}/item`, { params: { ...filter } }))).data;
};

export const getSalesReport = async (filter: { startDate: Date; endDate: Date }): Promise<ISalesReport> => {
    return (await apiWrapper(axios.get<ISalesReport>(`${baseUrl}/sales`, { params: { ...filter } }))).data;
};

export const exportSalesReport = async (filter: { startDate: Date; endDate: Date; type: ReportExportType; email?: string }) => {
    return exportReport(`${baseUrl}/sales/export`, filter, "sales_report");
};

export const exportItemReport = async (filter: { productId: string; startDate: Date; endDate: Date; type: ReportExportType; email?: string }) => {
    return exportReport(`${baseUrl}/item/export`, filter, "item_report");
};

import axios from "../lib/axios";
import { ISalesReport, ReportExportType } from "../types/report.interface";
import { apiWrapper } from "../utils/helper";

const baseUrl = "/report";

export const getSalesReport = async (filter: {startDate: Date, endDate: Date}): Promise<ISalesReport> => {
    return (await apiWrapper(axios.get<ISalesReport>(`${baseUrl}/sales`, {
        params: {...filter}
    }))).data;
};

export const exportSalesReport = async (filter: { startDate: Date; endDate: Date; type: ReportExportType }) => {
    try {
        let type = filter.type;

        const response = await axios.get(`${baseUrl}/sales/export`, {
            params: { ...filter, type: type === "print" ? "pdf" : type },
            responseType: "blob", 
        });

        const fileExtension = filter.type === "excel" ? "xlsx" : "pdf";
        const filename = `sales_report.${fileExtension}`;

        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = window.URL.createObjectURL(blob);

        if (type === "pdf" || type === "print") {
            const newWindow = window.open(url, "_blank");
            if (newWindow) {
                newWindow.onload = () => newWindow.print();
            } else {
                console.error("Popup blocked! Allow pop-ups to print.");
            }
        }  else {
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        throw new Error("Error exporting report")
    }
};


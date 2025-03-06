import { useState } from "react";
import {
    Box,
    Paper,
    Tab,
    Tabs,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { Print, PictureAsPdf, Email, GridOn, Search, CloudDownload } from "@mui/icons-material";
import PageTitle from "../components/PageTitle";
import { getSalesReport, exportSalesReport } from "../../../core/api/reportApi"; 
import SalesReport from "../components/SalesReport";
import { ISalesReport, ReportExportType } from "../../../core/types/report.interface";

const ReportsPage = () => {
    const today = new Date().toISOString().split("T")[0]; 

    const [activeTab, setActiveTab] = useState("sales");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false); 
    const [salesReport, setSalesReport] = useState<ISalesReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setSearchQuery("");
        setSalesReport(null);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = new Date(e.target.value);
        if (endDate && newStartDate > endDate) return; 
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = new Date(e.target.value);
        if (startDate && newEndDate < startDate) return;
        setEndDate(newEndDate);
    };

    const fetchData = async () => {
        if (!startDate || !endDate) return;
        
        setLoading(true);
        setError(null);
        
        try {
            if (activeTab === "sales") {
                setSalesReport(null);

                const response = await getSalesReport({
                    startDate: new Date(startDate), 
                    endDate: new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)), 
                });
                setSalesReport(response);
            }
        } catch (err) {
            setError("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type: ReportExportType) => {
        if (!startDate || !endDate) return;

        setExporting(true);
        setError(null);

        try {
            if(activeTab === "sales") {
                await exportSalesReport({
                    startDate: new Date(startDate), 
                    endDate: new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)), 
                    type
                });
                
                if(type !== "print"){
                    alert(`Sales report (${type.toUpperCase()}) is downloading...`);
                }
            }
        } catch (err) {
            setError("Failed to export report. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box p={3}>
            <PageTitle text="Reports" subtitle="Track your performance within a date range" />

            {/* Filters and Export Options */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    {/* Start Date */}
                    <TextField
                        type="date"
                        value={startDate ? startDate.toISOString().split("T")[0] : ""}
                        onChange={handleStartDateChange}
                        InputProps={{ inputProps: { max: today } }}
                        sx={{ minWidth: 180 }}
                    />

                    {/* End Date */}
                    <TextField
                        type="date"
                        value={endDate ? endDate.toISOString().split("T")[0] : ""}
                        onChange={handleEndDateChange}
                        InputProps={{ inputProps: { min: startDate?.toISOString().split("T")[0] || "2000-01-01", max: today } }}
                        sx={{ minWidth: 180 }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<CloudDownload />}
                        onClick={fetchData}
                        disabled={activeTab !== "sales" || !startDate || !endDate || loading || exporting} 
                    >
                        {loading ? <CircularProgress size={20} /> : "Fetch Data"}
                    </Button>
                </Box>

                {/* Export Buttons */}
                <Box display="flex" gap={2}>
                    <Button variant="outlined" startIcon={<Print />} disabled={exporting} onClick={() => handleExport("print")}>Print</Button>
                    <Button variant="outlined" startIcon={<GridOn />} disabled={exporting} onClick={() => handleExport("excel")}>Excel</Button>
                    <Button variant="outlined" startIcon={<PictureAsPdf />} disabled={exporting} onClick={() => handleExport("pdf")}>PDF</Button>
                    <Button variant="outlined" startIcon={<Email />} disabled={exporting}>Email</Button>
                </Box>
            </Box>

            {/* Tabs for report categories */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Sales Report" value="sales" />
                    <Tab label="Items Report" value="items" />
                    <Tab label="Customer Ledger" value="customer" />
                </Tabs>
            </Paper>

            {/* Report Placeholder */}
            <Box>
                {activeTab === "sales" && (
                    <>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Typography color="error" textAlign="center" mt={3}>{error}</Typography>
                        ) : salesReport ? (
                            <SalesReport report={salesReport} />
                        ) : (
                            <Typography textAlign="center" mt={3} color="gray">
                                Select a date range and fetch data to view the report.
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ReportsPage;

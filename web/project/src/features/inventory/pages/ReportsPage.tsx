import { useCallback, useState } from "react";
import {
    Box,
    Paper,
    Tab,
    Tabs,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    capitalize,
} from "@mui/material";
import { Print, PictureAsPdf, Email, GridOn, CloudDownload } from "@mui/icons-material";
import PageTitle from "../components/PageTitle";
import { getSalesReport, exportSalesReport, getItemReport, exportItemReport } from "../../../core/api/reportApi";
import SalesReport from "../components/SalesReport";
import { IItemReport, ISalesReport, ReportExportType } from "../../../core/types/report.interface";
import { toast } from "sonner";
import ProductAutoComplete from "../components/ProductAutoComplete";
import ItemReport from "../components/ItemReport";

const ReportsPage = () => {
    const today = new Date().toISOString().split("T")[0];

    const [activeTab, setActiveTab] = useState("sales");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [salesReport, setSalesReport] = useState<ISalesReport | null>(null);
    const [productId, setProductId] = useState<string | null>(null);
    const [itemReport, setItemReport] = useState<IItemReport | null>(null);

    // Modal states
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [exportType, setExportType] = useState<ReportExportType>("pdf");

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setSalesReport(null);
        setItemReport(null);
        setProductId(null);
    };

    const fetchData = useCallback(async () => {
        if (!startDate || !endDate) return;
    
        setLoading(true);
        setError(null);
    
        try {
            const sDate = new Date(startDate);
            const eDate = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    
            if (activeTab === "sales") {
                setSalesReport(null);
                const response = await getSalesReport({
                    startDate: sDate,
                    endDate: eDate,
                });
                setSalesReport(response);
            }
    
            if (activeTab === "items" && productId) {
                setItemReport(null);
                const response = await getItemReport({
                    productId, 
                    startDate: sDate,
                    endDate: eDate,
                });
                setItemReport(response);
            }
        } catch (err) {
            setError("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, activeTab, productId]);

    const handleExport = async (type: ReportExportType) => {
        if (!startDate || !endDate) return;

        setExporting(true);
        setError(null);

        const sDate = new Date(startDate);
        const eDate = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));

        try {
            if(activeTab === "sales"){
                await exportSalesReport({
                    startDate: sDate,
                    endDate: eDate,
                    type: type === "email" ? exportType : type,
                    email: type === "email" ? email : undefined,
                });
            } else if(activeTab === "items" && productId){
                await exportItemReport({
                    productId,
                    startDate: sDate,
                    endDate: eDate,
                    type: type === "email" ? exportType : type,
                    email: type === "email" ? email : undefined,
                });
            }

            if (type === "email") {
                toast.success(`${capitalize(activeTab)} report sent to ${email}`);
            } else {
                toast.info(`${capitalize(activeTab)} report (${type.toUpperCase()}) is downloading...`);
            }
        } catch (err) {
            setError("Failed to export report. Please try again.");
        } finally {
            setExporting(false);
            setEmailModalOpen(false);
        }
    };

    return (
        <Box p={3}>
            <PageTitle text="Reports" subtitle="Track your performance within a date range" />

            {/* Filters and Export Options */}
            <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={2} mb={3}>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <TextField
                        type="date"
                        size="small"
                        value={startDate ? startDate.toISOString().split("T")[0] : ""}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        InputProps={{ inputProps: { max: today } }}
                        sx={{ minWidth: 180 }}
                    />

                    <TextField
                        type="date"
                        size="small"
                        value={endDate ? endDate.toISOString().split("T")[0] : ""}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        InputProps={{ inputProps: { min: startDate?.toISOString().split("T")[0] || "2000-01-01", max: today } }}
                        sx={{ minWidth: 180 }}
                    />

                    <Button variant="contained" startIcon={<CloudDownload />} onClick={fetchData} disabled={!startDate || !endDate || loading || exporting}>
                        {loading ? <CircularProgress size={20} /> : "Fetch Data"}
                    </Button>

                    {activeTab === "items" && <ProductAutoComplete size="small" onSelect={(product) => setProductId(product.id)}
                        label="Select a product" />}
                </Box>

                {/* Export Buttons */}
                <Box display="flex" gap={2}>
                    <Button variant="outlined" startIcon={<Print />} disabled={exporting} onClick={() => handleExport("print")}>Print</Button>
                    <Button variant="outlined" startIcon={<GridOn />} disabled={exporting} onClick={() => handleExport("excel")}>Excel</Button>
                    <Button variant="outlined" startIcon={<PictureAsPdf />} disabled={exporting} onClick={() => handleExport("pdf")}>PDF</Button>
                    <Button variant="outlined" startIcon={<Email />} disabled={exporting} onClick={() => setEmailModalOpen(true)}>Email</Button>
                </Box>
            </Box>

            {/* Tabs for report categories */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label="Sales Report" value="sales" />
                    <Tab label="Items Report" value="items" />
                    <Tab label="Customer Ledger" value="customer" />
                </Tabs>
            </Paper>

            {/* Report Placeholder */}
            <Box>
                <>
                    {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography>
                        : salesReport ? <SalesReport report={salesReport} />
                            : itemReport ? <ItemReport report={itemReport} />
                                : <Typography>Select a date range to fetch data.</Typography>}
                </>
            </Box>

            {/* Email Export Modal */}
            <Dialog open={emailModalOpen} fullWidth onClose={() => setEmailModalOpen(false)}>
                <DialogTitle>Email Report</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="dense"
                    />
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Format:</Typography>
                    <RadioGroup value={exportType} onChange={(e) => setExportType(e.target.value as ReportExportType)}>
                        <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                        <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmailModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleExport("email")} disabled={!email || exporting} variant="contained">
                        {exporting ? <CircularProgress size={20} /> : "Send Report"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReportsPage;

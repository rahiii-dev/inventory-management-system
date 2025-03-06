import { Box, Paper, Typography } from "@mui/material";
import SalesTable from "./tables/SalesTable";
import { ISalesReport } from "../../../core/types/report.interface";

type SalesReportProps = {
    report: ISalesReport;
};

const SalesReport = ({ report }: SalesReportProps) => {
    return (
        <Box>
            {/* Sales Summary */}
            <Paper sx={{ padding: 2, marginBottom: 3, backgroundColor: "#f5f5f5" }}>
                <Typography variant="h6" fontWeight="bold">Sales Summary</Typography>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" mt={1}>
                    <Typography>Total Sales: <strong>{report.totalSales}</strong></Typography>
                    <Typography>Total Revenue: <strong>₹{report.totalRevenue.toLocaleString()}</strong></Typography>
                    <Typography>Total Items Sold: <strong>{report.totalItemsSold}</strong></Typography>
                    <Typography>Avg Order Value: <strong>₹{report.averageOrderValue.toFixed(2)}</strong></Typography>
                </Box>
            </Paper>

            {/* Transactions Table */}
            {report.transactions.length > 0 ? (
                <SalesTable sales={report.transactions} />
            ) : (
                <Box textAlign="center" mt={3}>
                    <Typography variant="h6" color="gray">No sales transactions found.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default SalesReport;

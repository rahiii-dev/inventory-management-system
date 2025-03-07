import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { IItemReport } from "../../../core/types/report.interface";

interface ItemReportProps {
    report: IItemReport | null;
}

const ItemReport: React.FC<ItemReportProps> = ({ report }) => {
    if (!report || report.transactions.length === 0) {
        return <Typography textAlign="center" mt={3} color="gray">No report data available.</Typography>;
    }

    return (
        <Box mt={3}>
            {/* Summary Section */}
            <Paper sx={{ padding: 2, marginBottom: 3, backgroundColor: "#f5f5f5" }}>
                <Typography variant="h6" fontWeight="bold">{report.productName} Summary</Typography>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" mt={1}>
                    <Typography>Total Sales: <strong>{report.salesCount}</strong></Typography>
                    <Typography>Total Revenue: <strong>₹{report.totalRevenue.toLocaleString()}</strong></Typography>
                    <Typography>Total Items Sold: <strong>{report.totalQuantitySold}</strong></Typography>
                    <Typography>Avg Selling Price: <strong>₹{report.averageSellingPrice.toFixed(2)}</strong></Typography>
                </Box>
            </Paper>

            {/* Transactions Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Sale ID</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Quantity Sold</strong></TableCell>
                            <TableCell><strong>Unit Price</strong></TableCell>
                            <TableCell><strong>Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report.transactions.map((transaction) => (
                            <TableRow key={transaction.saleId}>
                                <TableCell>{transaction.saleId}</TableCell>
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.quantity}</TableCell>
                                <TableCell>₹{transaction.unitPrice.toFixed(2)}</TableCell>
                                <TableCell>₹{transaction.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ItemReport;

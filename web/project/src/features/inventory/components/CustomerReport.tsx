import React from "react";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Box 
} from "@mui/material";
import { ICustomerReport } from "../../../core/types/report.interface";

interface CustomerReportProps {
    report: ICustomerReport | null;
}

const CustomerReport: React.FC<CustomerReportProps> = ({ report }) => {
    if (!report || report.transactions.length === 0) {
        return <Typography textAlign="center" mt={3} color="gray">No report data available.</Typography>;
    }

    return (
        <Box mt={3}>
            {/* Summary Section */}
            <Paper sx={{ padding: 2, marginBottom: 3, backgroundColor: "#f5f5f5" }}>
                <Typography variant="h6" fontWeight="bold">{report.customerName} Summary</Typography>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" mt={1}>
                    <Typography>Total Orders: <strong>{report.totalOrders}</strong></Typography>
                    <Typography>Total Spent: <strong>₹{report.totalSpent.toLocaleString()}</strong></Typography>
                </Box>
            </Paper>

            {/* Transactions Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Sale ID</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Total Amount</strong></TableCell>
                            <TableCell><strong>Payment Method</strong></TableCell>
                            <TableCell><strong>Items Purchased</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report.transactions.map((transaction) => (
                            <TableRow key={transaction.saleId}>
                                <TableCell>{transaction.saleId}</TableCell>
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell>₹{transaction.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>{transaction.paymentMethod}</TableCell>
                                <TableCell>{transaction.itemsPurchased}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CustomerReport;

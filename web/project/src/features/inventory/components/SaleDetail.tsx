import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Divider 
} from "@mui/material";
import { ISale } from "../../../core/types/sale.interface";

interface SaleDetailsProps {
    sale: ISale;
}

const SaleDetails = ({ sale }: SaleDetailsProps) => {
    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom><strong>Sale Details</strong></Typography>
            
            <Typography><strong>Sale ID:</strong> {sale.saleId}</Typography>
            <Typography><strong>Customer:</strong> 
                {typeof sale.customer === "string" ? "Guest" : sale.customer?.fullName || "N/A"}
            </Typography>
            <Typography><strong>Total Amount:</strong> ₹{sale.totalAmount.toFixed(2)}</Typography>
            <Typography><strong>Payment Method:</strong> {sale.paymentMethod}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom><strong>Sale Items</strong></Typography>
            
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><strong>Product Name</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="center"><strong>Quantity</strong></TableCell>
                            <TableCell align="right"><strong>Price</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sale.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>{item.productDescription || "No description"}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                <TableCell align="right">₹{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SaleDetails;

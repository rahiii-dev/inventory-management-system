import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ISale } from "../../../../core/types/sale.interface";
import { Visibility } from "@mui/icons-material";

type SalesTableProps = {
    sales: ISale[];
    handleView?: (item: ISale) => void;
}
const SalesTable = ({ sales, handleView }: SalesTableProps) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Sale ID</strong></TableCell>
                        <TableCell><strong>Customer</strong></TableCell>
                        <TableCell><strong>Total Amount</strong></TableCell>
                        <TableCell><strong>Payment Method</strong></TableCell>
                        {handleView && <TableCell><strong>Actions</strong></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sales.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.saleId}</TableCell>
                            <TableCell>
                                {!item.customer ? "-" :
                                    typeof item.customer === "string" ? "N/A" :
                                        item.customer.fullName}
                            </TableCell>
                            <TableCell>₹{item.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{item.paymentMethod}</TableCell>
                            {handleView && (
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Visibility />}
                                        onClick={() => handleView(item)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SalesTable;

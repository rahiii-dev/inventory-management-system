import { useCallback, useEffect, useState } from "react";
import {
    Box, Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Alert, Pagination,
    debounce,
    Typography
} from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";  // Import View Icon
import PageTitle from "../components/PageTitle";
import { ISale } from "../../../core/types/sale.interface";
import { listSales } from "../../../core/api/salesApi";
import SalesModal from "../components/SalesModal";

const PAGE_LIMIT = 10;

const SalesPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<ISale | null>(null);  // Store selected sale
    const [search, setSearch] = useState("");
    const [sales, setSales] = useState<ISale[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const fetchSales = useCallback(async () => {
        setTotalPages(0);
        setLoading(true);
        setError(null);
        try {
            const data = await listSales({ query: search, page, limit: PAGE_LIMIT });
            setSales(data.data);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            setError(error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handleSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const handleOpenModal = (sale?: ISale) => {
        if (sale) {
            setSelectedSale(sale);  
        } else {
            setSelectedSale(null); 
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const onAdded = async (item: ISale) => {
        if (page > 1) {
            fetchSales();
        } else {
            if (sales.length > PAGE_LIMIT) {
                setTotalPages(2);
            }
            setSales([item, ...sales.slice(0, PAGE_LIMIT - 1)]);
        }
    };

    return (
        <>
            <PageTitle text="Sales Management" />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search sales"
                    variant="outlined"
                    size="small"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal()}>
                    Create Sale
                </Button>
            </Box>

            {loading && <Typography textAlign={"center"}><CircularProgress /></Typography>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && sales.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Sale ID</strong></TableCell>
                                <TableCell><strong>Customer</strong></TableCell>
                                <TableCell><strong>Total Amount</strong></TableCell>
                                <TableCell><strong>Payment Method</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>  
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
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<Visibility />}
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && <Alert severity="info">No sales found.</Alert>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
                <Box display="flex" justifyContent="center" my={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}

            <SalesModal
                open={modalOpen}
                handleClose={handleCloseModal}
                onAdded={onAdded}
                sale={selectedSale}  
            />
        </>
    );
};

export default SalesPage;

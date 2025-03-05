import { useCallback, useEffect, useState } from "react";
import {
    Box, Button, TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Alert, Pagination,
    debounce,
    Typography,
    Switch
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import PageTitle from "../components/PageTitle";
import { ICustomer } from "../../../core/types/customer.interface";
import { deleteCustomer, listCustomers, restoreCustomer } from "../../../core/api/customerApi";
import { toast } from "sonner";
import CustomerModal from "../components/CustomerModal";

const PAGE_LIMIT = 10;

const CustomersPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ICustomer | null>(null);
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const fetchCustomers = useCallback(async () => {
        setTotalPages(0);
        setLoading(true);
        setError(null);
        try {
            const data = await listCustomers({ query: search, page, limit: PAGE_LIMIT });
            setCustomers(data.data);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            setError(error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const handleOpenModal = (item: ICustomer | null = null) => {
        setEditItem(item);
        setModalOpen(true);
    };
    const handleCloseModal = () => setModalOpen(false);

    const onAdded = async (item: ICustomer) => {
        if (page > 1) {
            fetchCustomers();
        } else {
            setCustomers([item, ...customers]);
        }
    };

    const onEdited = async (item: ICustomer) => {
        setCustomers(customers.map(i => i.id === item.id ? item : i));
    };

    const handleDelete = async (id: string, isActive: boolean) => {
        try {
            if (isActive) {
                await restoreCustomer(id);
                toast.success("Customer restored successfully!");
            } else {
                await deleteCustomer(id);
                toast.success("Customer deactivated successfully!");
            }

            setCustomers((prevCustomers) =>
                prevCustomers.map((item) =>
                    item.id === id ? { ...item, isActive: isActive } : item
                )
            );
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <>
            <PageTitle text="Customer Management" />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    label="Search customers"
                    variant="outlined"
                    size="small"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal()}>
                    Add New Customer
                </Button>
            </Box>

            {loading && <Typography textAlign={"center"}><CircularProgress /></Typography>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && customers.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Full Name</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell><strong>Address</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.mobile}</TableCell>
                                    <TableCell>
                                        {item.address.street}, {item.address.city}, {item.address.state}, {item.address.country}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleOpenModal(item)}>
                                            <Edit />
                                        </IconButton>
                                        <Switch
                                            checked={item.isActive}
                                            onChange={() => handleDelete(item.id, !item.isActive)}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && <Alert severity="info">No customers found.</Alert>
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

            <CustomerModal
                open={modalOpen}
                handleClose={handleCloseModal}
                initialData={editItem || undefined}
                onAdded={onAdded}
                onEdited={onEdited}
            />
        </>
    );
};

export default CustomersPage;

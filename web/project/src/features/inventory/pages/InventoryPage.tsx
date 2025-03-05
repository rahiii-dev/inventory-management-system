import { useCallback, useEffect, useState } from "react";
import {
  Box, Button, TextField, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert, Pagination,
  debounce,
  Typography
} from "@mui/material";
import { Add, Edit, Delete, Restore } from "@mui/icons-material";
import PageTitle from "../components/PageTitle";
import InventoryModal from "../components/InventoryModal";
import { IProduct } from "../../../core/types/product.interface";
import { deleteProduct, listProducts, restoreProduct } from "../../../core/api/productApi";
import { toast } from "sonner";

const PAGE_LIMIT = 10;

const InventoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<IProduct | null>(null);
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setTotalPages(0)
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts({ query: search, page, limit: PAGE_LIMIT });
      setInventory(data.data);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      setError(error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleOpenModal = (item: IProduct | null = null) => {
    setEditItem(item);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const onAdded = async (item: IProduct) => {
    if(page > 1){
      fetchProducts();
    } else {
      setInventory([item, ...inventory]);
    }
  };

  const onEdited = async (item: IProduct) => {
    setInventory(inventory.map(i => i.id === item.id ? item : i));
  };

  const handleDelete = async (id: string, isDeleted: boolean) => {
    try {
      if (isDeleted) {
        await restoreProduct(id);
        toast.success("Product restored successfully!");
      } else {
        await deleteProduct(id);
        toast.success("Product deleted successfully!");
      }

      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === id ? { ...item, isDeleted: !isDeleted } : item
        )
      );
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };


  return (
    <>
      <PageTitle text="Inventory Management" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search products"
          variant="outlined"
          size="small"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal()}>
          Add New Item
        </Button>
      </Box>

      {loading && <Typography textAlign={"center"}><CircularProgress /></Typography>}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && inventory.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenModal(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color={item.isDeleted ? "success" : "error"}
                      onClick={() => handleDelete(item.id, item.isDeleted)}
                    >
                      {item.isDeleted ? <Restore /> : <Delete />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && <Alert severity="info">No products found.</Alert>
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

      <InventoryModal open={modalOpen} handleClose={handleCloseModal}
        initialData={editItem || undefined}
        onAdded={onAdded}
        onEdited={onEdited} />
    </>
  );
};

export default InventoryPage;

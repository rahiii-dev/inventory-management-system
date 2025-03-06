import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import InventoryForm from "../forms/InventoryForm";
import { IProduct } from "../../../../core/types/product.interface";

interface InventoryModalProps {
  open: boolean;
  handleClose: () => void;
  initialData?: IProduct;
  onAdded: (data: IProduct) => void;
  onEdited: (data: IProduct) => void;
}

const InventoryModal = ({ open, handleClose, initialData, onAdded, onEdited }: InventoryModalProps) => {
  const handleSubmit = (data: IProduct) => {
    if (initialData) {
      onEdited(data);
    } else {
      onAdded(data);
    }
    handleClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Item" : "Add New Item"}</DialogTitle>
      <DialogContent>
        <InventoryForm initialData={initialData} onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryModal;

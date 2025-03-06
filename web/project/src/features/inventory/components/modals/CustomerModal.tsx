import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import CustomerForm from "../forms/CustomerForm";
import { ICustomer } from "../../../../core/types/customer.interface";

interface CustomerModalProps {
  open: boolean;
  handleClose: () => void;
  initialData?: ICustomer;
  onAdded: (data: ICustomer) => void;
  onEdited: (data: ICustomer) => void;
}

const CustomerModal = ({ open, handleClose, initialData, onAdded, onEdited }: CustomerModalProps) => {
  const handleSubmit = (data: ICustomer) => {
    if (initialData) {
      onEdited(data);
    } else {
      onAdded(data);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Customer" : "Add New Customer"}</DialogTitle>
      <DialogContent>
        <CustomerForm initialData={initialData} onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;

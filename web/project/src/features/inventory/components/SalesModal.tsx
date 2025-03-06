import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from "@mui/material";
import SalesForm from "./forms/SalesForm";
import { ISale } from "../../../core/types/sale.interface";
import SaleDetails from "./SaleDetail";

interface SalesModalProps {
    open: boolean;
    handleClose: () => void;
    onAdded: (data: ISale) => void;
    sale?: ISale | null;
}

const SalesModal = ({ open, handleClose, onAdded, sale }: SalesModalProps) => {
    const handleSubmit = (data: ISale) => {
        onAdded(data);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{sale ? "Sale Details" : "Create Sale"}</DialogTitle>
            <DialogContent>
                {sale ? <SaleDetails sale={sale} /> : <SalesForm onSubmit={handleSubmit} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SalesModal;

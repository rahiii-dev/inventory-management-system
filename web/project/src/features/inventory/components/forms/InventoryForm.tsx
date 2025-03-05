import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IProduct } from "../../../../core/types/product.interface";
import { createProduct, updateProduct } from "../../../../core/api/productApi";
import { toast } from "sonner";

interface InventoryFormProps {
  initialData?: IProduct;
  onSubmit: (data: IProduct) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  price: Yup.number().min(0.01, "Price must be greater than 0").required("Price is required"),
});

const InventoryForm = ({ initialData, onSubmit }: InventoryFormProps) => {
  return (
    <Formik
      initialValues={initialData || { name: "", description: "", quantity: 0, price: 0 }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const data = initialData
            ? await updateProduct(initialData.id, values)
            : await createProduct(values);

          onSubmit(data);
        } catch (error: any) {
          toast.error(error || "An error occurred. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              fullWidth
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && Boolean(errors.quantity)}
              helperText={touched.quantity && errors.quantity}
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price && errors.price}
            />

            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} /> : initialData ? "Update" : "Add"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default InventoryForm;

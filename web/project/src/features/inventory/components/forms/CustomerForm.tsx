import { Box, Button, CircularProgress, TextField, Grid2 } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ICustomer } from "../../../../core/types/customer.interface";
import { createCustomer, updateCustomer } from "../../../../core/api/customerApi";
import { toast } from "sonner";

interface CustomerFormProps {
    initialData?: ICustomer;
    onSubmit: (data: ICustomer) => void;
}

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
    address: Yup.object().shape({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        zipCode: Yup.string().required("Zip Code is required"),
        country: Yup.string().required("Country is required"),
    }),
});

const CustomerForm = ({ initialData, onSubmit }: CustomerFormProps) => {
    return (
        <Formik
            initialValues={
                initialData || {
                    fullName: "",
                    mobile: "",
                    address: { street: "", city: "", state: "", zipCode: "", country: "" },
                }
            }
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const data = initialData
                        ? await updateCustomer(initialData.id, values)
                        : await createCustomer(values);

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
                            label="Full Name"
                            name="fullName"
                            fullWidth
                            value={values.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.fullName && Boolean(errors.fullName)}
                            helperText={touched.fullName && errors.fullName}
                        />

                        <TextField
                            label="Mobile"
                            name="mobile"
                            fullWidth
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mobile && Boolean(errors.mobile)}
                            helperText={touched.mobile && errors.mobile}
                        />

                        <TextField
                            label="Street"
                            name="address.street"
                            fullWidth
                            value={values.address.street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address?.street && Boolean(errors.address?.street)}
                            helperText={touched.address?.street && errors.address?.street}
                        />

                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 6 }}>
                                <TextField
                                    label="City"
                                    name="address.city"
                                    fullWidth
                                    value={values.address.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address?.city && Boolean(errors.address?.city)}
                                    helperText={touched.address?.city && errors.address?.city}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 6 }}>
                                <TextField
                                    label="State"
                                    name="address.state"
                                    fullWidth
                                    value={values.address.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address?.state && Boolean(errors.address?.state)}
                                    helperText={touched.address?.state && errors.address?.state}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 6 }}>
                                <TextField
                                    label="Zip Code"
                                    name="address.zipCode"
                                    fullWidth
                                    value={values.address.zipCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address?.zipCode && Boolean(errors.address?.zipCode)}
                                    helperText={touched.address?.zipCode && errors.address?.zipCode}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 6 }}>
                                <TextField
                                    label="Country"
                                    name="address.country"
                                    fullWidth
                                    value={values.address.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address?.country && Boolean(errors.address?.country)}
                                    helperText={touched.address?.country && errors.address?.country}
                                />
                            </Grid2>
                        </Grid2>

                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={20} /> : initialData ? "Update Customer" : "Add Customer"}
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default CustomerForm;

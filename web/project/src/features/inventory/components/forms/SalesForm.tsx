import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
    TextField,
    MenuItem,
    Button,
    Select,
    FormControl,
    Typography,
    Autocomplete,
    CircularProgress,
    debounce,
    Box
} from "@mui/material";
import { ISaleItem, PaymentMethod } from "../../../../core/types/sale.interface";
import { listProducts } from "../../../../core/api/productApi";
import { IProduct } from "../../../../core/types/product.interface";
import { ICustomer } from "../../../../core/types/customer.interface";
import { listCustomers } from "../../../../core/api/customerApi";
import { createSales } from "../../../../core/api/salesApi";
import { toast } from "sonner";

interface SalesFormProps {
    onSubmit: (data: any) => void;
}

interface ICustomSaleItem extends ISaleItem {
    stock: number;
}

const validationSchema = Yup.object({
    paymentMethod: Yup.string().required("Payment method is required"),
    customer: Yup.string().when("paymentMethod", {
        is: "Customer",
        then: (schema) => schema.required("Customer is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    items: Yup.array()
        .min(1, "At least one product must be added")
        .of(
            Yup.object({
                id: Yup.string().required(),
                quantity: Yup.number()
                    .min(1, "Quantity must be at least 1")
                    .required(),
            })
        ),
});


const SalesForm = ({ onSubmit }: SalesFormProps) => {
    const [selectedProducts, setSelectedProducts] = useState<ICustomSaleItem[]>([]);
    const [searchProducts, setSearchProducts] = useState<IProduct[]>([]);
    const [searchCustomers, setSearchCustomers] = useState<ICustomer[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    const fetchProducts = debounce(async (query: string) => {
        if (!query) return setSearchProducts([]);
        setLoadingProducts(true);
        try {
            const { data } = await listProducts({ query, page: 1, limit: 10 });
            setSearchProducts(data);
        } finally {
            setLoadingProducts(false);
        }
    }, 300);

    const fetchCustomers = debounce(async (query: string) => {
        if (!query) return setSearchCustomers([]);
        setLoadingCustomers(true);
        try {
            const { data } = await listCustomers({ query, page: 1, limit: 10 });
            setSearchCustomers(data);
        } finally {
            setLoadingCustomers(false);
        }
    }, 300);

    const handleAddProduct = (product: IProduct, setFieldValue: any) => {
        if (selectedProducts.some((p) => p.product === product.id)) return;

        const updatedProducts: ICustomSaleItem[] = [
            ...selectedProducts,
            {
                product: product.id,
                productName: product.name,
                productDescription: product.description || "",
                price: product.price,
                stock: product.quantity,
                quantity: 1,
                total: product.price
            },
        ];
        setSelectedProducts(updatedProducts);
        setFieldValue("items", updatedProducts.map(({ product, quantity }) => ({ id: product, quantity })));
    };

    const handleQuantityChange = (index: number, quantity: number, setFieldValue: any) => {
        const updatedProducts = [...selectedProducts];

        if (quantity > updatedProducts[index].stock) return;

        updatedProducts[index].quantity = quantity;
        updatedProducts[index].total = updatedProducts[index].price * quantity;
        setSelectedProducts(updatedProducts);
        setFieldValue("items", updatedProducts.map(({ product, quantity }) => ({ id: product, quantity })));
    };

    return (
        <Formik
            initialValues={{
                paymentMethod: "Cash" as PaymentMethod,
                customer: "",
                items: [] as { id: string; quantity: number }[],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                try {
                    const data = await createSales(values)
                    onSubmit(data);
                } catch (error: any) {
                    toast.error(error || "An error occurred. Please try again.");
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                    {/* Payment Method Selection */}
                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <Field
                                as={Select}
                                name="paymentMethod"
                                onChange={(e: any) => setFieldValue("paymentMethod", e.target.value)}
                            >
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Customer">Customer</MenuItem>
                            </Field>
                        </FormControl>
                    </Box>

                    {/* Customer Search */}
                    {values.paymentMethod === "Customer" && (
                        <Box sx={{ mb: 2 }}>
                            <Autocomplete
                                options={searchCustomers}
                                getOptionLabel={(option: any) => option.fullName}
                                onInputChange={(_, newValue) => fetchCustomers(newValue)}
                                onChange={(_, value) => setFieldValue("customer", value ? value.id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Customer"
                                        error={!!errors.customer && touched.customer}
                                        helperText={errors.customer && touched.customer ? errors.customer : ""}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingCustomers ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    )}

                    {/* Product Search */}
                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            options={searchProducts}
                            getOptionLabel={(option: any) => `${option.name} - ₹${option.price}`}
                            onInputChange={(_, newValue) => fetchProducts(newValue)}
                            onChange={(_, value) => value && handleAddProduct(value, setFieldValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Products"
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingProducts ? <CircularProgress size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    {/* Selected Products List */}
                    {selectedProducts.map((item, index) => (
                        <Box key={item.product} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Typography sx={{ flex: 1 }}>
                                {item.productName} - ₹{item.price} (Stock: {item.stock})
                            </Typography>
                            <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value), setFieldValue)}
                                inputProps={{ min: 1, max: item.stock }}
                                sx={{ width: "80px" }}
                                disabled={item.stock === 0} 
                            />
                            <Typography>= ₹{item.total}</Typography>
                            <Button
                                color="error"
                                onClick={() => {
                                    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
                                    setSelectedProducts(updatedProducts);
                                    setFieldValue("items", updatedProducts.map(({ product, quantity }) => ({ id: product, quantity })));
                                }}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}

                    {/* Total Amount */}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Total: ₹{selectedProducts.reduce((sum, item) => sum + item.total, 0)}
                    </Typography>

                    {/* Submit Button */}
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" type="submit" fullWidth>
                            {isSubmitting ? <CircularProgress size={20} /> : "Submit Sale"}
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default SalesForm;

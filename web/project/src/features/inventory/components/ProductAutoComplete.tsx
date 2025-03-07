import { useState } from "react";
import { TextField, Autocomplete, CircularProgress, debounce } from "@mui/material";
import { IProduct } from "../../../core/types/product.interface";
import { listProducts } from "../../../core/api/productApi";

interface ProductAutoCompleteProps {
    onSelect: (product: IProduct) => void;
    label?: string;
    size?: "medium" | "small"
    showActiveOnly?: boolean;
}

const ProductAutoComplete = ({ onSelect, label = "Search Products", size="medium", showActiveOnly }: ProductAutoCompleteProps) => {
    const [searchProducts, setSearchProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = debounce(async (query: string) => {
        if (!query) return setSearchProducts([]);
        setLoading(true);
        try {
            const { data } = await listProducts({ query, page: 1, limit: 10, active: showActiveOnly });
            setSearchProducts(data);
        } finally {
            setLoading(false);
        }
    }, 300);

    return (
        <Autocomplete
            size={size}
            fullWidth
            options={searchProducts}
            getOptionLabel={(option) => `${option.name}`}
            onInputChange={(_, newValue) => fetchProducts(newValue)}
            onChange={(_, value) => value && onSelect(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }
                    }}
                />
            )}
        />
    );
};

export default ProductAutoComplete;

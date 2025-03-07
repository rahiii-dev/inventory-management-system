import React, { useState } from "react";
import { Autocomplete, TextField, CircularProgress, debounce } from "@mui/material";
import { ICustomer } from "../../../core/types/customer.interface";
import { listCustomers } from "../../../core/api/customerApi";

interface CustomerAutocompleteProps {
    onSelect: (customerId: ICustomer) => void
    label?: string;
    size?: "medium" | "small"
    showActiveOnly?: boolean;
    error?: string
}

const CustomerAutocomplete: React.FC<CustomerAutocompleteProps> = ({ onSelect, label = "Search Customer", size="medium", showActiveOnly, error }) => {
    const [searchCustomers, setSearchCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCustomers = debounce(async (query: string) => {
        if (!query) return setSearchCustomers([]);
        setLoading(true);
        try {
            const { data } = await listCustomers({ query, active: showActiveOnly, page: 1, limit: 10 });
            setSearchCustomers(data);
        } finally {
            setLoading(false);
        }
    }, 300);

    return (
        <Autocomplete
            fullWidth
            size={size}
            options={searchCustomers}
            getOptionLabel={(option) => option.fullName}
            onInputChange={(_, newValue) => fetchCustomers(newValue)}
            onChange={(_, value) => value && onSelect(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    helperText={error}
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

export default CustomerAutocomplete;

import { useState } from "react";
import { Box, TextField, Button, IconButton, Typography, Alert, Paper, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff, Inventory2 } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../../core/api/authApi";
import { useAuthContext } from "../../../core/context/AuthContext";

const LoginFormSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginFormSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const data = await loginUser(values);
        login(data);
      } catch (error) {
        setError("Invalid email or password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #E3F2FD, #C5CAE9)",
        padding: 2,
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, maxWidth: 400, width: "100%", borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#E8EAF6",
              marginBottom: 1,
            }}
          >
            <Inventory2 sx={{ fontSize: 32, color: "#3F51B5" }} />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Inventory Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your inventory
          </Typography>
        </Box>

        {/* Error Message */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Email Input */}
            <TextField
              label="Email Address"
              type="email"
              placeholder="user@mail.com"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            {/* Password Input */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }
              }}
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }} disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;


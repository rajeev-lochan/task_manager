import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "../../services/authService";
import type { LoginResponse } from "../../types/response";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    try {
      const response: LoginResponse = await login({
        username,
        password,
      });
      console.log(response);
      localStorage.setItem("token", response.token);
      navigate("/tasks")
    } catch (error:any) {
      console.log(error, "login error");
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.detail;

        const formattedErrors: Record<string, string> = {};

        validationErrors.forEach((err: any) => {
          const field = err.loc[1];

          // Map backend field to frontend field
          if (field === "hash_password") {
            formattedErrors["password"] = err.msg;
          } else {
            formattedErrors[field] = err.msg;
          }
        });

        setErrors(formattedErrors);
        return;
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          elevation={5}
          sx={{
            width: "100%",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
                <LockPersonIcon />
              </Avatar>

              <Typography variant="h4" style={{ fontWeight: 700 }}>
                Welcome Back
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            <Box component="form">
              <TextField
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                label="Username"
                margin="normal"
              />

              <TextField
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                onClick={handleLogin}
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.4 }}
              >
                Sign In
              </Button>

              <Typography align="center" sx={{ mt: 3 }}>
                Don't have an account?{" "}
                <Link href="/register" underline="hover">
                  Create Account
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signin;

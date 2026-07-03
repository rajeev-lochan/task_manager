import { useState } from "react";
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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { register } from "../../services/authService";
import type { RegisterResponse } from "../../types/response";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    try {
      setErrors({});
      const response: RegisterResponse = await register({
        name,
        username,
        email,
        hash_password: password,
      });

      console.log(response);

      //   alert("Registration successful!");
      if (response.data) {
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");

        navigate("/signin");
      }
    } catch (error: any) {
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

      alert(error.response?.data?.detail ?? "Registration failed");
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
                <PersonAddAlt1Icon />
              </Avatar>

              <Typography
                variant="body2"
                color="text.secondary"
                style={{ fontWeight: 700 }}
              >
                Register to continue
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Register to continue
              </Typography>
            </Box>

            <Box component="form">
              <TextField
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                label="Full Name"
                margin="normal"
              />

              <TextField
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                label="Username"
                margin="normal"
              />

              <TextField
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                label="Email"
                type="email"
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
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.4 }}
                onClick={handleRegister}
              >
                Sign Up
              </Button>

              <Typography align="center" sx={{ mt: 3 }}>
                Already have an account?{" "}
                <Link href="/signin" underline="hover">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;

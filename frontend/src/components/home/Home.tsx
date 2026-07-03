import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f5f7fb",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <AssignmentTurnedInIcon
            color="primary"
            sx={{ fontSize: 70, mb: 2 }}
          />

          <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
            Task Manager
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
            Organize your tasks, manage your projects, and boost your
            productivity with a simple and intuitive task management
            application.
          </Typography>

          <Stack
            direction={isMobile ? "column" : "row"}
            sx={{ gap:2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/signin")}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;

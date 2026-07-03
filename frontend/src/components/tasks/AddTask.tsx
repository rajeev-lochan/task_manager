import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTask } from "../../services/taskService";

const AddTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});

    if (!title.trim()) {
      setErrors({ title: "Title is required." });
      return;
    }

    if (!description.trim()) {
      setErrors({ description: "Description is required." });
      return;
    }

    try {
      await createTask({
        title,
        description,
        is_completed: isCompleted,
      });

      navigate("/tasks");
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.detail;

        const formattedErrors: Record<string, string> = {};

        validationErrors.forEach((err: any) => {
          formattedErrors[err.loc[1]] = err.msg;
        });

        setErrors(formattedErrors);
      } else {
        alert(error.response?.data?.detail ?? "Failed to create task.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card elevation={5}>
        <CardContent>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
              fontWeight: "700",
            }}
            variant="h4"
          >
            Add New Task
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
              }
              label="Completed"
            />

            <Box sx={{ display: "flex", gap: "8px" }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </Button>

              <Button fullWidth variant="contained" onClick={handleSubmit}>
                Save Task
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddTask;

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Fab,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../../services/taskService";
import type { CreateTaskRequest, Task } from "../../types/tasks";
import type { TaskResponse } from "../../types/response";
import TaskDialog from "./taskDialog/TaskDialog";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // const fetchTasks = async () => {
  //   try {
  //     const response: TaskResponse = await getAllTasks();
  //     setTasks(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchTasks = async () => {
    try {
      const response: TaskResponse = await getAllTasks();

      const sortedTasks = [...response.data].sort((a, b) => b.id - a.id);

      setTasks(sortedTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const loadTasks = async () => {
  //     try {
  //       const response: TaskResponse = await getAllTasks();
  //       setTasks(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadTasks();
  // }, []);

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask.id);

      setDeleteOpen(false);
      setSelectedTask(null);

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const hasFetched = useRef(false);
  //single api call
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchTasks();
  }, []);
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "space-between",
          direction: "row",
          alignContent: "center",
          marginBottom: "32px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          My Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTask(null);
            setOpen(true);
          }}
        >
          Add Task
        </Button>
      </Stack>

      {tasks.length === 0 ? (
        <Typography align="center">No tasks found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Stack
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      direction: "row",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      {task.title}
                    </Typography>

                    <Chip
                      label={task.is_completed ? "Completed" : "Pending"}
                      color={task.is_completed ? "success" : "warning"}
                      size="small"
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      minHeight: 60,
                    }}
                  >
                    {task.description}
                  </Typography>

                  <Stack
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection:"row"
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditingTask(task);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedTask(task);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
        }}
        onClick={() => {
          setEditingTask(null);
          setOpen(true);
        }}
      >
        <AddIcon />
      </Fab>
      <TaskDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Add Task"}
        submitButtonText={editingTask ? "Update" : "Create"}
        initialValues={editingTask ?? undefined}
        onSubmit={async (values: CreateTaskRequest) => {
          if (editingTask) {
            await updateTask(editingTask.id, values);
          } else {
            await createTask(values);
          }

          await fetchTasks();

          setOpen(false);
          setEditingTask(null);
        }}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedTask?.title}</strong>?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setSelectedTask(null);
            }}
          >
            Cancel
          </Button>

          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;

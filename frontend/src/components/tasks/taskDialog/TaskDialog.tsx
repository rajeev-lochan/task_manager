import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface TaskFormData {
  title: string;
  description: string;
  is_completed: boolean;
}

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitButtonText: string;
  initialValues?: TaskFormData;
  onSubmit: (values: TaskFormData) => Promise<void>;
}

const TaskDialog = ({
  open,
  onClose,
  title,
  submitButtonText,
  initialValues,
  onSubmit,
}: TaskDialogProps) => {
  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    is_completed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? "",
        is_completed: initialValues?.is_completed ?? false,
      });

      setErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = async () => {
    const validation: Record<string, string> = {};

    if (!form.title.trim()) {
      validation.title = "Title is required";
    }

    if (!form.description.trim()) {
      validation.description = "Description is required";
    }

    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    await onSubmit(form);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          error={!!errors.description}
          helperText={errors.description}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.is_completed}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_completed: e.target.checked,
                })
              }
            />
          }
          label="Completed"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
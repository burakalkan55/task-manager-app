import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";


const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Görevler yüklenemedi:", error);
        setSnackbar({ open: true, message: "Görevler yüklenemedi ❌" });
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (input.trim() === "") return;

    try {
      const response = await fetch("/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setInput("");
      setSnackbar({ open: true, message: "Görev eklendi ✅" });
    } catch (error) {
      console.error("Görev eklenemedi:", error);
      setSnackbar({ open: true, message: "Görev eklenemedi ❌" });
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((task) => task.id === id);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ done: !task.done }),
      });

      const updatedTask = await response.json();
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, done: updatedTask.done } : task
        )
      );
    } catch (error) {
      console.error("Görev güncellenemedi:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTasks(tasks.filter((task) => task.id !== id));
      setSnackbar({ open: true, message: "Görev silindi 🗑️" });
    } catch (error) {
      console.error("Görev silinemedi:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Görev Listesi</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Yeni görev"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={addTask}>
          Ekle
        </Button>
      </Paper>

      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <Checkbox
              edge="start"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <ListItemText
              primary={task.text}
              sx={{ textDecoration: task.done ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert severity="info" sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Tasks;

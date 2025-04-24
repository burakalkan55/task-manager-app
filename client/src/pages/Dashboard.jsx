import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Card, CardContent, Typography, Button } from "@mui/material";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  if (!user) return <div className="dashboard-loading">Yükleniyor...</div>;

  return (
    <div className="dashboard-wrapper">
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        className="theme-toggle"
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h5" component="div">
            Merhaba, <span className="username">{user.username}</span> 👋
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Hoş geldin! Bu senin özel kontrol panelin.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
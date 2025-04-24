import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
  return value === index && <Box sx={{ p: 2 }}>{children}</Box>;
};

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState("burakalk");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTabChange = (e, newValue) => setTab(newValue);

  // Fix: Use the correct API path - /api/users/updateProfile
  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      // Correct API path that matches the server configuration
      const response = await fetch("/api/users/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      // Check if the response is not found (404)
      if (response.status === 404) {
        throw new Error("API endpoint not found. Check server routes configuration.");
      }

      // Try to parse the response as JSON, but handle potential errors
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("API returned non-JSON response. Check server configuration.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Profil güncellenirken bir hata oluştu");
      }

      setSuccessMessage("Profil güncellendi ✅");
      setSnackbar(true);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Use the correct API path - /api/users/changePassword
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      // Correct API path that matches the server configuration
      const response = await fetch("/api/users/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      // Check if the response is not found (404)
      if (response.status === 404) {
        throw new Error("API endpoint not found. Check server routes configuration.");
      }

      // Try to parse the response as JSON, but handle potential errors
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("API returned non-JSON response. Check server configuration.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Şifre değiştirme başarısız");
      }

      setSuccessMessage("Şifre başarıyla değiştirildi ✅");
      setSnackbar(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Şifre değiştirme hatası:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Ayarlar</Typography>

      <Paper elevation={3}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="PROFİL BİLGİLERİ" />
          <Tab label="ŞİFRE DEĞİŞTİR" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <TextField
            label="Kullanıcı Adı"
            fullWidth
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleProfileUpdate}
            disabled={isLoading}
            sx={{ bgcolor: "#0d6efd", "&:hover": { bgcolor: "#0b5ed7" } }}
          >
            {isLoading ? "GÜNCELLENİYOR..." : "GÜNCELLE"}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          )}
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <TextField
            type="password"
            label="Mevcut Şifre"
            fullWidth
            sx={{ mb: 2 }}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="Yeni Şifre"
            fullWidth
            sx={{ mb: 2 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="Yeni Şifre Tekrar"
            fullWidth
            sx={{ mb: 2 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={isLoading}
            sx={{ bgcolor: "#0d6efd", "&:hover": { bgcolor: "#0b5ed7" } }}
          >
            {isLoading ? "GÜNCELLENİYOR..." : "ŞİFRE DEĞİŞTİR"}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          )}
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
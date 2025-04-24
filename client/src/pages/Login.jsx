import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <form className="login-container" onSubmit={handleSubmit}>
      <h2>Giriş Yap</h2>
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </form>
  );
};

export default Login;

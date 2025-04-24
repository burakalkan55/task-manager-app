import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      navigate("/"); // Kayıt başarılıysa Login sayfasına yönlendir
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ username, password }));

    // Başarı kontrolü
    if (registerUser.fulfilled.match(resultAction)) {
      setSuccess(true);
    }
  };

  return (
    <form className="register-container" onSubmit={handleSubmit}>
      <h2>Kayıt Ol</h2>
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
        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Zaten hesabın var mı? <Link to="/">Giriş Yap</Link>
      </p>
    </form>
  );
};

export default Register;

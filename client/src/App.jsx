import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/authContext";
import MainLayout from "./pages/MainLayout";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>


        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

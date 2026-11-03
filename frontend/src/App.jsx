
import { useState } from "react";

import Register from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";

import "./App.css";

function App() {
    const [page, setPage] = useState("login");

    const handleRegisterSuccess = () => {
        setPage("login");
    };

    const handleLoginSuccess = () => {
        setPage("dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setPage("login");
    };

    return (
        <div className="app">

            {page === "register" && (
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onLogin={() => setPage("login")}
                />
            )}

            {page === "login" && (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onRegister={() => setPage("register")}
                />
            )}

            {page === "dashboard" && (
                <Dashboard
                    onLogout={handleLogout}
                />
            )}

        </div>
    );
}

export default App;


import { useState } from "react";
import "../styles/Login.css";

function Login({ onLoginSuccess, onRegister }) {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5002/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage(data.message || "Login successful!");

            onLoginSuccess();

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">

            <div className="login-decoration decoration-one">✨</div>
            <div className="login-decoration decoration-two">🛍️</div>
            <div className="login-decoration decoration-three">🎓</div>

            <div className="login-card">

                <div className="login-logo">
                    🛒 StudentMart
                </div>

                <div className="login-welcome-icon">
                    👋
                </div>

                <h1>Hey there, Welcome Back!</h1>

                <p className="login-subtitle">
                    Ready to shop? Login to your StudentMart account ✨
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="login-input-group">

                        <label htmlFor="email">
                            📧 Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="login-input-group">

                        <label htmlFor="password">
                            🔒 Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {message && (
                        <p className="login-message">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login to StudentMart →
                    </button>

                </form>

                <div className="register-link">

                    <span>
                        New to StudentMart?{" "}
                    </span>

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Create Account
                    </button>

                </div>

                <p className="login-footer">
                    Made for students, made for you 💙
                </p>

            </div>

        </div>
    );
}

export default Login;

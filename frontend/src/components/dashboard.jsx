
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import ProductDetails from "./ProductDetails";

const API = "http://localhost:5002/api/profile";

function Dashboard({ onLogout }) {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("profile");
    const [selectedProductId, setSelectedProductId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        address: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadProfile = async () => {
            if (!token) {
                onLogout();
                return;
            }

            try {
                const response = await fetch(`${API}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.status === 401) {
                    onLogout();
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load profile");
                }

                setUser(data.user);

                setForm({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    department: data.user.department || "",
                    year: data.user.year || "",
                    address: data.user.address || ""
                });

                localStorage.setItem("user", JSON.stringify({
                    id: data.user._id,
                    name: data.user.name,
                    email: data.user.email
                }));

            } catch (err) {
                setError(err.message || "Unable to connect to server");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            const response = await fetch(`${API}/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.status === 401) {
                onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Profile update failed");
            }

            setUser(data.user);

            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                department: data.user.department || "",
                year: data.user.year || "",
                address: data.user.address || ""
            });

            localStorage.setItem("user", JSON.stringify({
                id: data.user._id,
                name: data.user.name,
                email: data.user.email
            }));

            setEditing(false);
            setMessage(data.message || "Profile updated successfully");

        } catch (err) {
            setError(err.message || "Unable to connect to server");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (passwordForm.newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        try {
            const response = await fetch(`${API}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(passwordForm)
            });

            const data = await response.json();

            if (response.status === 401) {
                onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setPasswordForm({
                currentPassword: "",
                newPassword: ""
            });

            setChangingPassword(false);
            setMessage(data.message || "Password changed successfully");

            onLogout();

        } catch (err) {
            setError(err.message || "Unable to connect to server");
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!user) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-card">
                    <h2>Unable to Load Profile</h2>
                    <p role="alert">
                        {error || "Please log in again."}
                    </p>
                    <button onClick={onLogout}>Back to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <main className="dashboard-content">

                <div className="dashboard-layout">

                    {/* LEFT COLUMN */}
                    <div className="dashboard-left-column">

                        {/* STUDENTMART LOGO */}
                        <nav className="dashboard-navbar">
                            <div className="dashboard-logo">
                                StudentMart
                            </div>
                        </nav>

                        {/* LEFT SIDEBAR */}
                        <aside className="dashboard-navigation">

                            <h3>Menu</h3>

                            <button
                                className={activeSection === "profile" ? "active" : ""}
                                onClick={() => {
                                    setActiveSection("profile");
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                <span>👤</span>
                                <span>My Profile</span>
                            </button>

                            <button
                                className={
                                    activeSection === "products" ||
                                    activeSection === "details"
                                        ? "active"
                                        : ""
                                }
                                onClick={() => {
                                    setActiveSection("products");
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                <span>🛍️</span>
                                <span>Explore Products</span>
                            </button>

                            <button
                                className={activeSection === "add" ? "active" : ""}
                                onClick={() => {
                                    setActiveSection("add");
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                <span>＋</span>
                                <span>Add Product</span>
                            </button>

                            <div className="sidebar-divider"></div>

                            <button
                                className="sidebar-logout"
                                onClick={onLogout}
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>

                        </aside>

                    </div>

                    {/* RIGHT SIDE CONTENT */}
                    <section className="dashboard-main-content">

                        {/* WELCOME MESSAGE */}
                        <div className="welcome-section">
                            <h1>Welcome, {user.name}! 👋</h1>
                            <p>Manage your StudentMart account here.</p>
                        </div>

                        {message && (
                            <p className="dashboard-message" role="status">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p className="dashboard-error" role="alert">
                                {error}
                            </p>
                        )}

                        {/* MY PROFILE */}
                        {activeSection === "profile" && (
                            <div className="dashboard-card">

                                <h2>👤 My Profile</h2>

                                <div className="profile-icon">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </div>

                                {editing ? (
                                    <form onSubmit={saveProfile}>

                                        <label>Full Name</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />

                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />

                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />

                                        <label>Department</label>
                                        <input
                                            name="department"
                                            value={form.department}
                                            onChange={handleChange}
                                        />

                                        <label>Year of Study</label>
                                        <input
                                            name="year"
                                            value={form.year}
                                            onChange={handleChange}
                                        />

                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                        />

                                        <button type="submit">
                                            Save Changes
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                setError("");
                                                setForm({
                                                    name: user.name || "",
                                                    email: user.email || "",
                                                    phone: user.phone || "",
                                                    department: user.department || "",
                                                    year: user.year || "",
                                                    address: user.address || ""
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </form>
                                ) : (
                                    <div className="profile-details">

                                        <div className="profile-row">
                                            <span>Name</span>
                                            <strong>{user.name}</strong>
                                        </div>

                                        <div className="profile-row">
                                            <span>Email</span>
                                            <strong>{user.email}</strong>
                                        </div>

                                        <div className="profile-row">
                                            <span>Phone</span>
                                            <strong>{user.phone || "Not provided"}</strong>
                                        </div>

                                        <div className="profile-row">
                                            <span>Department</span>
                                            <strong>{user.department || "Not provided"}</strong>
                                        </div>

                                        <div className="profile-row">
                                            <span>Year</span>
                                            <strong>{user.year || "Not provided"}</strong>
                                        </div>

                                        <div className="profile-row">
                                            <span>Address</span>
                                            <strong>{user.address || "Not provided"}</strong>
                                        </div>

                                        <button onClick={() => {
                                            setMessage("");
                                            setError("");
                                            setEditing(true);
                                        }}>
                                            Edit Profile
                                        </button>

                                    </div>
                                )}

                                <hr />

                                <button onClick={() => {
                                    setMessage("");
                                    setError("");
                                    setChangingPassword(!changingPassword);
                                }}>
                                    {changingPassword
                                        ? "Cancel Password Change"
                                        : "Change Password"}
                                </button>

                                {changingPassword && (
                                    <form onSubmit={changePassword}>

                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                currentPassword: e.target.value
                                            })}
                                            required
                                        />

                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                newPassword: e.target.value
                                            })}
                                            minLength={6}
                                            required
                                        />

                                        <button type="submit">
                                            Update Password
                                        </button>

                                    </form>
                                )}

                            </div>
                        )}

                        {/* EXPLORE PRODUCTS */}
                        {activeSection === "products" && (
                            <ProductGrid
                                onViewDetails={(productId) => {
                                    setSelectedProductId(productId);
                                    setActiveSection("details");
                                }}
                            />
                        )}

                        {/* ADD PRODUCT */}
                        {activeSection === "add" && (
                            <ProductForm
                                onProductAdded={() => setActiveSection("products")}
                                onCancel={() => setActiveSection("products")}
                            />
                        )}

                        {/* PRODUCT DETAILS */}
                        {activeSection === "details" && (
                            <ProductDetails
                                productId={selectedProductId}
                                onBack={() => setActiveSection("products")}
                            />
                        )}

                    </section>

                </div>

            </main>
        </div>
    );
}

export default Dashboard;

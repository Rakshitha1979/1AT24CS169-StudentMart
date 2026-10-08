import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      <nav className="navbar">

        <h2>User Authentication</h2>

        <button onClick={handleLogout}>
          Logout
        </button>

      </nav>

      <div className="dashboard-content">

        {user && (
          <>
            <h1>Welcome, {user.name}!</h1>

            <p>
              You have successfully logged in.
            </p>

            <div className="user-card">

              <h3>User Information</h3>

              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard({ onLogout }) {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

    }, []);

    if (!user) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-card">

                    <h2>
                        No user logged in
                    </h2>

                </div>

            </div>
        );
    }

    return (

        <div className="dashboard-page">

            <nav className="dashboard-navbar">

                <div className="dashboard-logo">
                    StudentMart
                </div>

                <button
                    onClick={onLogout}
                    className="nav-logout-button"
                >
                    Logout
                </button>

            </nav>


            <main className="dashboard-content">

                <div className="welcome-section">

                    <h1>
                        Welcome, {user.name}! 👋
                    </h1>

                    <p>
                        You have successfully logged
                        into your StudentMart account.
                    </p>

                </div>


                <div className="dashboard-card">

                    <h2>
                        My Profile
                    </h2>

                    <div className="profile-icon">
                        {user.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div className="profile-details">

                        <div className="profile-row">

                            <span>
                                Name
                            </span>

                            <strong>
                                {user.name}
                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {user.email}
                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                User ID
                            </span>

                            <strong>
                                {user.id}
                            </strong>

                        </div>

                    </div>


                    <button
                        onClick={onLogout}
                        className="dashboard-logout-button"
                    >
                        Logout
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;
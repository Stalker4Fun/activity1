import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const username = state?.username;

  if (!username) return <Navigate to="/login" replace />;

  function logout() {
    navigate('/login', { replace: true });
  }

  return (
    <main className="dashboard-layout">
      <section className="dashboard-card" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">DASHBOARD</p>
            <h1 id="dashboard-title">You’re logged in</h1>
          </div>
          <button className="secondary-button" onClick={logout}>Log out</button>
        </div>
        <p className="welcome-message">Welcome, <strong>{username}</strong>. Your login was successful.</p>
        <div className="dashboard-panel">
          <h2>Account status</h2>
          <p>Authenticated with the Spring Boot user API.</p>
        </div>
      </section>
    </main>
  );
}

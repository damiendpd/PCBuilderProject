import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Email : {user.email}</p>
      <p>Admin : {user.isAdmin ? 'Oui' : 'Non'}</p>
    </div>
  );
}

export default Dashboard;
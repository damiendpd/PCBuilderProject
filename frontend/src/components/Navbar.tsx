import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
    navigate('/login'); 
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/dashboard">Dashboard</Link> |{' '}
      <Link to="/components">Composants</Link> |{' '}
      <Link to="/partners">Partenaires</Link> |{' '}
      <Link to="/configurations">Configurations</Link> |{' '}
      {user?.isAdmin && (
        <>
          <Link to="/users">Utilisateurs</Link> |{' '}
        </>
      )}

      {/* Lien vers la page d'accueil */}

      {!user && (
        <Link to="/login">Connexion</Link>
      )}

      {user && (
        <>
          <span style={{ marginLeft: '1rem' }}>👤 {user.email}</span>
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
            Déconnexion
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;

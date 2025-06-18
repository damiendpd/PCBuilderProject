import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ComponentList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Composants</h1>
      {user?.isAdmin && (
        <button onClick={() => navigate('/components/add')}>
          ➕ Ajouter un composant
        </button>
      )}
      {/* Liste des composants à venir */}
    </div>
  );
}

export default ComponentList;

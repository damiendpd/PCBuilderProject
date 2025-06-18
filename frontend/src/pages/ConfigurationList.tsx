import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ConfigurationList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Configurations</h1>
      {user && (
    <button onClick={() => navigate('/configurations/add')}>
        ➕ Sauvegarder une config
    </button>
    )}
      {/* Liste des configurations à venir */}
    </div>
  );
}

export default ConfigurationList;

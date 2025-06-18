import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PartnerList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Partenaires</h1>
      {user?.isAdmin && (
        <button onClick={() => navigate('/partners/add')}>
          ➕ Ajouter un partenaire
        </button>
      )}
      {/* Liste des partenaires à venir */}
    </div>
  );
}

export default PartnerList;

import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { User } from '../types/User';
import { useEffect, useState } from 'react';

// Interface pour les configurations sauvegardées
interface SavedConfiguration {
  _id: string;
  name: string;
  components: any[];
  createdAt: string;
  updatedAt?: string;
}

function UserDetail() {
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [userConfigs, setUserConfigs] = useState<SavedConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!user?.isAdmin) return <p>Accès refusé.</p>;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Récupérer les détails de l'utilisateur
        const userResponse = await API.get<User>(`/users/${id}`);
        setUserDetail(userResponse.data);

        // Récupérer les configurations de l'utilisateur
        try {
          const configsResponse = await API.get<SavedConfiguration[]>(`/saved-configs/admin/${id}`);
          setUserConfigs(configsResponse.data);
        } catch (configError) {
          // Si la route n'existe pas encore, on ignore l'erreur
          console.warn('Impossible de récupérer les configurations:', configError);
          setUserConfigs([]);
        }

      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleDeleteConfiguration = async (configId: string, configName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la configuration "${configName}" ?`)) {
      try {
        await API.delete(`/saved-configs/${configId}`);
        // Mettre à jour la liste après suppression
        setUserConfigs(userConfigs.filter(config => config._id !== configId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la configuration');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!userDetail) return <p>Utilisateur non trouvé</p>;

  return (
    <div>
      <button onClick={() => navigate('/users')}>
        ← Retour à la liste
      </button>

      <h1>Détails de l'utilisateur</h1>

      {/* Informations utilisateur */}
      <div>
        <h2>Informations personnelles</h2>
        <p><strong>Email:</strong> {userDetail.email}</p>
        <p><strong>Statut:</strong> {userDetail.isAdmin ? 'Administrateur' : 'Utilisateur'}</p>
        {userDetail.createdAt && (
          <p><strong>Inscrit le:</strong> {formatDate(userDetail.createdAt)}</p>
        )}
      </div>

      {/* Configurations sauvegardées */}
      <div>
        <h2>Configurations sauvegardées ({userConfigs.length})</h2>
        
        {userConfigs.length === 0 ? (
          <p>Aucune configuration sauvegardée.</p>
        ) : (
          <ul>
            {userConfigs.map((config) => (
              <li key={config._id}>
                <div>
                  <strong>{config.name}</strong>
                  <p>Composants: {config.components.length}</p>
                  <p>Créée le: {formatDate(config.createdAt)}</p>
                  
                  <div>
                    <button onClick={() => navigate(`/configurations/${config._id}`)}>
                      👁️ Voir détails
                    </button>
                    <button onClick={() => navigate(`/configurations/${config._id}/edit`)}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => handleDeleteConfiguration(config._id, config.name)}>
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
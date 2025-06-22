import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { User } from '../types/User';
import { useEffect, useState, useMemo } from 'react';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [emailFilter, setEmailFilter] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) return <p>Accès refusé.</p>;

  useEffect(() => {
    API.get<User[]>('/users').then((res) => setUsers(res.data));
  }, []);

  // Filtrer les utilisateurs par email
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesEmail = emailFilter === '' || user.email.toLowerCase().includes(emailFilter.toLowerCase());
      return matchesEmail;
    });
  }, [users, emailFilter]);

  const handleResetFilter = () => {
    setEmailFilter('');
  };

  return (
    <div>
      <h1>Liste des utilisateurs</h1>

      {/* Section de filtre */}
      <div>
        <h3>Filtres</h3>
        
        <div>
          <label htmlFor="email-filter">Email :</label>
          <input
            type="text"
            id="email-filter"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Rechercher par email..."
          />

          <button onClick={handleResetFilter}>
            🔄 Réinitialiser
          </button>
        </div>

        <p>
          {filteredUsers.length} utilisateur(s) trouvé(s)
          {emailFilter && (
            <span> • Email contient: "{emailFilter}"</span>
          )}
        </p>
      </div>

      {/* Liste des utilisateurs filtrés */}
      {filteredUsers.length === 0 ? (
        <p>Aucun utilisateur trouvé avec les filtres sélectionnés.</p>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user._id}>
              <strong>{user.email}</strong>
              {user.isAdmin && <span> (Admin)</span>}
              <button onClick={() => navigate(`/users/${user._id}`)}>
                👁️ Voir détails
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
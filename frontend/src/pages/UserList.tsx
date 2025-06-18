import { useAuth } from '../contexts/AuthContext';

function UserList() {
  const { user } = useAuth();

  if (!user?.isAdmin) return <p>Accès refusé.</p>;

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {/* Logique de listing à ajouter */}
    </div>
  );
}

export default UserList;
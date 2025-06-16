import { useEffect, useState } from 'react';
import API from '../services/api';
import type { User } from '../types/index';

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    API.get<{ email: string; role: string }>('/api/auth/me')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      });
  }, []);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
    </div>
  );
}
export default Dashboard;
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import type { Component } from '../types/Components';
import { useEffect, useState } from 'react';

function ComponentList() {
  const [components, setComponents] = useState<Component[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get<Component[]>('/components').then((res) => setComponents(res.data));
  }, []);

  return (
    <div>
      <h1>Composants</h1>

      {user?.isAdmin && (
        <button onClick={() => navigate('/components/add')}>➕ Ajouter un composant</button>
      )}

      <ul>
        {components.map((component) => (
          <li key={component._id}>
            <strong>{component.name}</strong> - {component.type} - {component.brand} - {component.price} €
            {user?.isAdmin && (
              <>
                <button onClick={() => navigate(`/components/${component._id}/edit`)}>✏️ Modifier</button>
                {/* Optionnel : bouton supprimer */}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComponentList;

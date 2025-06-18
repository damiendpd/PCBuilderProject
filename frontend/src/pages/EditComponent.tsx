import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState<any>(null);

  useEffect(() => {
    API.get(`/components/${id}`).then((res) => setComponent(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.put(`/components/${id}`, component);
    navigate('/components');
  };

  if (!component) return <div>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={component.title}
        onChange={(e) => setComponent({ ...component, title: e.target.value })}
        placeholder="Titre"
      />
      {/* Ajoute d'autres champs ici */}
      <button type="submit">Modifier</button>
    </form>
  );
}

export default EditComponent;

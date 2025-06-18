import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditConfiguration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    API.get(`/configurations/${id}`).then((res) => setConfig(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.put(`/configurations/${id}`, config);
    navigate('/configurations');
  };

  if (!config) return <div>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={config.name}
        onChange={(e) => setConfig({ ...config, name: e.target.value })}
        placeholder="Nom de la config"
      />
      {/* Afficher/modifier les composants sélectionnés si nécessaire */}
      <button type="submit">Modifier</button>
    </form>
  );
}

export default EditConfiguration;

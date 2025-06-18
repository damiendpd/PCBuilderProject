import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditPartner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    API.get(`/partners/${id}`).then((res) => setPartner(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.put(`/partners/${id}`, partner);
    navigate('/partners');
  };

  if (!partner) return <div>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={partner.name}
        onChange={(e) => setPartner({ ...partner, name: e.target.value })}
        placeholder="Nom du partenaire"
      />
      {/* Autres champs : URL, affiliation, etc. */}
      <button type="submit">Modifier</button>
    </form>
  );
}

export default EditPartner;

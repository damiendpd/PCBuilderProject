import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Component } from '../types/Components';

const COMPONENT_TYPES: Component['type'][] = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case'];

function EditComponent() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Omit<Component, 'offers'>>({
            _id: '',
            name: '',
            type: 'CPU',
            brand: '',
            price: 0,
            specs: {},
        });

    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        API.get<Component>(`/components/${id}`)
            .then((res) => {
            setFormData(res.data);
            setIsLoading(false);
            })
            .catch((err) => {
            console.error('Erreur chargement composant:', err);
            alert("Composant introuvable ou erreur serveur.");
            navigate('/components');
            setIsLoading(false);
        });
    }, [id]);

    if (!user?.isAdmin) return <p>Accès refusé. Réservé aux administrateurs.</p>;
    if (isLoading) return <p>Chargement du composant...</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleAddSpec = () => {
        if (!specKey || !specValue) return;
        setFormData((prev) => ({
        ...prev,
        specs: {
            ...prev.specs,
            [specKey]: specValue,
        },
        }));
        setSpecKey('');
        setSpecValue('');
    };

    const handleRemoveSpec = (key: string) => {
        const { [key]: _, ...rest } = formData.specs;
        setFormData((prev) => ({ ...prev, specs: rest }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await API.put(`/components/${formData._id}`, formData);
        navigate('/components');
        } catch (err) {
        alert("Erreur lors de la mise à jour.");
        console.error(err);
        }
    };

    return (
        <div>
        <h2>✏️ Modifier le composant</h2>
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
            <select name="type" value={formData.type} onChange={handleChange}>
            {COMPONENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
            ))}
            </select>
            <input name="brand" placeholder="Marque" value={formData.brand} onChange={handleChange} />
            <input name="price" type="number" placeholder="Prix (€)" value={formData.price} onChange={handleChange} />

            <div>
            <h4>Spécifications techniques</h4>
            <input placeholder="Clé" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
            <input placeholder="Valeur" value={specValue} onChange={(e) => setSpecValue(e.target.value)} />
            <button type="button" onClick={handleAddSpec}>Ajouter</button>
            <ul>
                {Object.entries(formData.specs).map(([key, value]) => (
                <li key={key}>
                    <strong>{key}</strong>: {value}
                    <button type="button" onClick={() => handleRemoveSpec(key)}>❌</button>
                </li>
                ))}
            </ul>
            </div>

            <button type="submit">💾 Enregistrer</button>
        </form>
        </div>
    );
}

export default EditComponent;

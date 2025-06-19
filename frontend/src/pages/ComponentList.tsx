import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import type { Component } from '../types/Components';
import { useEffect, useState, useMemo } from 'react';

function ComponentList() {
  const [components, setComponents] = useState<Component[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get<Component[]>('/components').then((res) => setComponents(res.data));
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(components.map(component => component.type))];
    return uniqueCategories.sort();
  }, [components]);

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(components.map(component => component.brand))];
    return uniqueBrands.sort();
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesCategory = categoryFilter === '' || component.type === categoryFilter;
      const matchesBrand = brandFilter === '' || component.brand === brandFilter;
      return matchesCategory && matchesBrand;
    });
  }, [components, categoryFilter, brandFilter]);

  const handleResetFilters = () => {
    setCategoryFilter('');
    setBrandFilter('');
  };

  const handleDeleteComponent = async (componentId: string, componentName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le composant "${componentName}" ?`)) {
      try {
        await API.delete(`/components/${componentId}`);
        // Mettre à jour la liste après suppression
        setComponents(components.filter(component => component._id !== componentId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du composant');
      }
    }
  };

return (
    <div>
      <h1>Composants</h1>
      
      {user?.isAdmin && (
        <button onClick={() => navigate('/components/add')}>
          ➕ Ajouter un composant
        </button>
      )}

      <div>
        <h3>Filtres</h3>
        
        <div>
          <label htmlFor="category-filter">Catégorie :</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="brand-filter">Marque :</label>
          <select
            id="brand-filter"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Toutes les marques</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <button onClick={handleResetFilters}>
            🔄 Réinitialiser
          </button>
        </div>

        <p>
          {filteredComponents.length} composant(s) trouvé(s)
          {(categoryFilter || brandFilter) && (
            <span>
              {categoryFilter && ` • Catégorie: ${categoryFilter}`}
              {brandFilter && ` • Marque: ${brandFilter}`}
            </span>
          )}
        </p>
      </div>

      {filteredComponents.length === 0 ? (
        <p>Aucun composant trouvé avec les filtres sélectionnés.</p>
      ) : (
        <ul>
          {filteredComponents.map((component) => (
            <li key={component._id}>
              <strong>{component.name}</strong> - {component.type} - {component.brand} - {component.price} €
              {user?.isAdmin && (
                <>
                  <button onClick={() => navigate(`/components/${component._id}/edit`)}>
                    ✏️ Modifier
                  </button>
                  <button onClick={() => handleDeleteComponent(component._id!, component.name)}>
                    🗑️ Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComponentList;

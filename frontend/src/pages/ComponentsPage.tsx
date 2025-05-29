import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Component } from '../types/Components';

const ComponentPage = () => {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    API.get<Component[]>('/components').then((res) => setComponents(res.data));
  }, []);

  return (
    <div>
      <h1>Liste des composants</h1>
      <ul>
        {components.map((comp) => (
          <li key={comp._id}>{comp.title} - {comp.price} €</li>
        ))}
      </ul>
    </div>
  );
};

export default ComponentPage;

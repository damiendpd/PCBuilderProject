# 🖥️ PCBuilderProject

**PCBuilderProject** est une API RESTful accompagnée d'un backoffice React permettant de configurer un PC sur mesure. Elle offre la possibilité aux utilisateurs de sélectionner des composants, calculer le coût total, sauvegarder leurs configurations, et bien plus encore. Les administrateurs disposent d'une interface de gestion complète des composants, partenaires et utilisateurs.

---

## 🚀 Technologies utilisées

### Backend (API)
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** (authentification)
- **Jest + Supertest** (tests)
- **OpenAPI / Swagger** (documentation)

### Frontend (BackOffice)
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Axios**
- **Tailwind CSS**

---

## 📁 Arborescence du projet

PCBuilderProject/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ ├── tests/
│ ├── app.js
│ ├── server.js
│ └── swagger.yaml
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── utils/
│ │ ├── App.tsx
│ │ └── main.tsx
├── README.md
└── package.json

---

## ⚙️ Fonctionnalités

### Utilisateurs
- Inscription, connexion, authentification via JWT
- Sauvegarde de configurations personnalisées
- Gestion de plusieurs builds

### Composants
- Liste de catégories (CPU, GPU, RAM, etc.)
- Composants par catégorie, marque, prix
- CRUD complet pour les administrateurs

### Partenaires marchands
- Ajout, mise à jour, suppression
- Prix multiples pour un composant donné
- Calcul du coût total

### Génération de configuration
- Détail des composants sélectionnés
- Exportation en PDF

### Sécurité & Authentification
- Auth sécurisée par JWT
- Déconnexion automatique en cas de token expiré ou 401
- Intercepteurs Axios

---

## 🔒 Authentification JWT

L’authentification est gérée avec des **JSON Web Tokens** :

- Les utilisateurs reçoivent un token à la connexion.
- Ce token est stocké localement et envoyé avec chaque requête API.
- Un intercepteur gère automatiquement la déconnexion si le token est expiré.

---

## 🧪 Tests

```bash
# Lancer les tests backend
cd backend
npm run test

## Documentation API
# Lancer le backend et accéder à : http://localhost:5000/api-docs


▶️ Lancer le projet
Backend
    cd backend
    npm install
    npm run dev
Frontend (BackOffice)
    cd frontend
    npm install
    npm run dev

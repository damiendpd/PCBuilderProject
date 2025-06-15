# 🖥️ PCBuilderProject

API RESTful pour gérer les composants, partenaires, utilisateurs et configurations personnalisées de PC sur mesure.
---

## 🚀 Technologies utilisées

### Backend (API)
Node.js + Express
MongoDB avec Mongoose
Authentification JWT
Tests avec Jest & Supertest
Documentation API via Swagger (OpenAPI)

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
    backend/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── tests/
    ├── app.js
    ├── server.js
    ├── babel.config.js
    ├── jest.config.js

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

Gestion des utilisateurs (inscription, connexion, rôles admin)

CRUD complet sur composants et partenaires

Sauvegarde et gestion des configurations PC personnalisées

Auth sécurisée avec JWT

Documentation API interactive (Swagger)

---

## 🔒 Authentification JWT

JWT délivré à la connexion

Token à inclure dans l'en-tête Authorization: Bearer <token> pour accéder aux routes protégées
---

## 🧪 Tests

```bash
# Lancer les tests backend
cd backend
npm run test

▶️ Lancer le projet
Backend
    cd backend
    npm install
    npm run dev
    ## API accessible sur http://localhost:5000
Frontend (BackOffice)
    cd frontend
    npm install
    npm run dev

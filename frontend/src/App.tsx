import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComponentList from './pages/ComponentList';
import PartnerList from './pages/PartnerList';
import ConfigurationList from './pages/ConfigurationList';
import AddComponent from './pages/AddComponent';
import AddPartner from './pages/AddPartner';
import AddConfiguration from './pages/AddConfiguration';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import ConfigDetail from './pages/ConfigDetail';
import EditComponent from './pages/EditComponent';
import EditPartner from './pages/EditPartner';
import EditConfiguration from './pages/EditConfiguration';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/components" element={<ComponentList />} />
        <Route path="/components/add" element={<AddComponent />} />
        <Route path="/components/:id/edit" element={<EditComponent />} />
        <Route path="/partners" element={<PartnerList />} />
        <Route path="/partners/add" element={<AddPartner />} />
        <Route path="/partners/:id/edit" element={<EditPartner />} />
        <Route path="/configurations" element={<ConfigurationList />} />
        <Route path="/configurations/add" element={<AddConfiguration />} />
        <Route path="/configurations/:id" element={<ConfigDetail />} />
        <Route path="/configurations/:id/edit" element={<EditConfiguration />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post<{ token: string }>('/api/auth/login', {
        email,
        password
    });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Échec de connexion');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button type="submit">Connexion</button>
    </form>
  );
}

export default Login;

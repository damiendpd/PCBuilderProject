import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/User';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        
      const { data } = await axios.post<{ token: string }>(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );
      localStorage.setItem('token', data.token);

      const res = await axios.get<User>('http://localhost:5000/api/user/me', {
    headers: {
        Authorization: `Bearer ${data.token}`,
        },
    });
    setUser(res.data);
      navigate('/dashboard'); 
    } catch (err) {
      alert('Échec de connexion');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button type="submit">Connexion</button>
    </form>
  );
}

export default Login;

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@mahanetra.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('mahanetra_token', data.token);
        onLogin();
      } else {
        setError(data.message || 'Access Denied. Invalid credentials.');
      }
    } catch (err) {
      setError('Connection to Command Server failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-glow"></div>
      
      <div className="login-panel">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <ShieldAlert className="login-icon" />
          </div>
          <h1 className="login-title">MAHANETRA</h1>
          <p className="login-subtitle">AI Surveillance Command</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Email ID</label>
            <input 
              type="email" 
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@mahanetra.com"
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary login-btn">
            <span>Authenticate</span>
            <span className="pulse-dot"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

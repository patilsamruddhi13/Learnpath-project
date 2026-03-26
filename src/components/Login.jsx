import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate(); //  ADD THIS

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    //prevnt refreshing page so preventDefault
    e.preventDefault();
    //print login ,for testing prpose
    console.log('Login:', { email, password });
      navigate('/profile');  
  };
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
      </form>
      <div className="text-center mb-3">
        <span className="text-muted">OR</span>
      </div>
      <a 
        href="http://localhost:8080/oauth2/authorization/google" 
        className="btn btn-outline-dark w-100 d-flex justify-content-center align-items-center"
      >
        <img 
          src="https://img.icons8.com/color/16/000000/google-logo.png" 
          alt="Google logo" 
          className="me-2" 
        />
        Sign in with Google
      </a>
    </div>
  );
}

export default Login;

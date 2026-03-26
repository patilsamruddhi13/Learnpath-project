import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuth2RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL like http://localhost:3000/oauth2/redirect?token=xxxx
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/dashboard', { replace: true });
    } else {
      console.error("OAuth2 Login Failed", error);
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2">Logging you in, please wait...</span>
    </div>
  );
}

export default OAuth2RedirectHandler;

import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('access-token');
    const accessToken = JSON.parse(tokenString);
    return accessToken ? accessToken : null
  };

  const [token, setToken] = useState(getToken());

  const saveToken = accessToken => {
    localStorage.setItem('access-token', JSON.stringify(accessToken));
    setToken(accessToken);
  };

  const clearToken = () => {
    localStorage.removeItem('access-token');
    setToken(null);
  }

  return { setToken: saveToken, clearToken, token }
}
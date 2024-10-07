import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const callProtectedApi = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:5000/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching protected route', error);
      }
    };

    callProtectedApi();
  }, [getAccessTokenSilently]);

  return <div>{message ? <p>{message}</p> : <p>Loading...</p>}</div>;
};

export default ProtectedRoute;

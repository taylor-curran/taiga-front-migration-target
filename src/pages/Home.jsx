import { useEffect, useState } from 'react';
import { healthCheck } from '../services/api';

const Home = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkAPI = async () => {
      const result = await healthCheck();
      setApiStatus(result.status);
    };
    checkAPI();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Taiga</h1>
      <p>Hello World! This is the React migration scaffold.</p>
      <div className="api-status">
        <h3>API Health Check:</h3>
        <p>Status: <span className={`status-${apiStatus}`}>{apiStatus}</span></p>
      </div>
    </div>
  );
};

export default Home;

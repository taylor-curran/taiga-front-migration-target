import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?._error_message ||
        err.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="logo-container">
          <h1 className="auth-logo">Taiga</h1>
          <h2 className="auth-tagline">Love your project</h2>
        </div>

        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <fieldset>
              <input
                type="text"
                name="username"
                autoCorrect="off"
                autoCapitalize="none"
                autoFocus
                required
                placeholder="Username or email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </fieldset>

            <fieldset className="login-password">
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>

            {error && <div className="auth-error">{error}</div>}

            <fieldset className="end">
              <button
                type="submit"
                className="btn-primary full"
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </fieldset>
          </form>

          <p className="register-text">
            <span>Not registered yet? </span>
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?._error_message ||
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        'Registration failed. Please try again.';
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
        </div>

        <div className="register-form-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <fieldset>
              <input
                type="text"
                name="username"
                autoCorrect="off"
                autoCapitalize="none"
                required
                maxLength={255}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset>
              <input
                type="text"
                name="full_name"
                required
                maxLength={256}
                placeholder="Full name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset>
              <input
                type="email"
                name="email"
                required
                maxLength={255}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset>
              <input
                type="password"
                name="password"
                required
                minLength={4}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </fieldset>

            {error && <div className="auth-error">{error}</div>}

            <fieldset className="end">
              <button
                type="submit"
                className="btn-primary full"
                disabled={submitting}
              >
                {submitting ? 'Signing up...' : 'Sign up'}
              </button>
            </fieldset>
          </form>

          <Link to="/login" className="register-text-top">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

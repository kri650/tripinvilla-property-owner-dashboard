import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const checkAutoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        setLoading(true);
        try {
          const profileRes = await fetch('http://localhost:5000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${urlToken}` }
          });
          if (!profileRes.ok) throw new Error('Token verification failed');
          let user = await profileRes.json();
          
          if (!['owner', 'admin', 'super_admin'].includes(user.role)) {
            const updateRes = await fetch('http://localhost:5000/api/users/profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${urlToken}`
              },
              body: JSON.stringify({ role: 'owner' })
            });
            if (updateRes.ok) {
              user = await updateRes.json();
            }
          }
          
          localStorage.setItem('token', urlToken);
          localStorage.setItem('owner_user', JSON.stringify(user));
          navigate('/owner/dashboard', { replace: true });
        } catch (err) {
          console.error('Auto login failed in Login:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    checkAutoLogin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const data = res.data || {};
      const role = data?.user?.role;
      if (!data.token) throw new Error('Invalid login response');
      if (!['owner', 'admin', 'super_admin'].includes(role)) {
        alert('This account does not have owner access.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('owner_user', JSON.stringify(data.user));
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      console.error('Owner login failed:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div className="dash-section" style={{ maxWidth: 520, width: '100%', padding: 0 }}>
        <div className="chart-card" style={{ padding: 28, borderRadius: 16, border: 'none', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5EE', color: '#1d9e75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogIn size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>Owner Login</div>
              <div style={{ fontSize: 12.5, color: '#6B7280' }}>Access the Property Owner Portal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-1">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-solid-green"
              style={{ width: '100%', cursor: 'pointer', padding: '10px 18px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6B7280' }}>
              Don't have an owner account? <Link to="/owner/register" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>Register Here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


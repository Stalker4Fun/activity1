import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/users';

const initialForm = { username: '', password: '' };

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Username is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await loginUser(form);
      const username = form.username;
      setForm(initialForm);
      navigate('/dashboard', { state: { username } });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">ACTIVITY 1</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="subtitle">Log in to open your dashboard.</p>
        {apiError && <p className="notice error" role="alert">{apiError}</p>}
        <form noValidate onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} autoComplete="username" aria-invalid={Boolean(errors.username)} />
          {errors.username && <p className="field-error">{errors.username}</p>}
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="current-password" aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="field-error">{errors.password}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="form-footer">Need an account? <Link to="/register">Register here</Link></p>
      </section>
    </main>
  );
}

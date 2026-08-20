import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/users';

const initialForm = { username: '', password: '', confirmPassword: '' };

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Username is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await registerUser(form);
      setMessage('Registration successful. You can now log in.');
      setForm(initialForm);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="eyebrow">ACTIVITY 1</p>
        <h1 id="register-title">Create your account</h1>
        <p className="subtitle">Register to access your dashboard.</p>
        {message && <p className="notice success" role="status">{message}</p>}
        {apiError && <p className="notice error" role="alert">{apiError}</p>}
        <form noValidate onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} autoComplete="username" aria-invalid={Boolean(errors.username)} />
          {errors.username && <p className="field-error">{errors.username}</p>}
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="field-error">{errors.password}</p>}
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="form-footer">Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}

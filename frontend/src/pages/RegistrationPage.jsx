import { useState } from 'react';

const initialForm = { username: '', password: '', confirmPassword: '' };

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Username is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.';
    setErrors(nextErrors);
  }

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="eyebrow">ACTIVITY 1</p>
        <h1 id="register-title">Create your account</h1>
        <p className="subtitle">Register to access your dashboard.</p>
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
          <button type="submit">Create account</button>
        </form>
      </section>
    </main>
  );
}

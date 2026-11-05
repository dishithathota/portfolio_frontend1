import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Field, Alert } from '../components/ui.jsx';
import { useAuth, ADMIN_CODE } from '../context/AuthContext.jsx';
import { home } from '../routes/ProtectedRoute.jsx';
import useSEO from '../hooks/useSEO.js';

export default function Auth({ mode }) {
  const signupMode = mode === 'signup';
  useSEO(signupMode ? 'Sign up' : 'Login', 'Access your FolioHub dashboard.');
  const { user, login, signup } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', role: 'user', code: '' });
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState({ type: 'error', text: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  if (user) return <Navigate to={home(user)} replace />;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (signupMode && f.name.trim().length < 2) er.name = 'Full name is required (min 2 characters).';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (signupMode) {
      if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(f.password)) er.password = 'Min 6 characters with a letter and a number.';
      if (f.confirm !== f.password) er.confirm = 'Passwords do not match.';
      if (f.role === 'admin' && f.code !== ADMIN_CODE) er.code = 'Invalid admin invite code.';
    } else if (!f.password) er.password = 'Password is required.';
    setErrs(er);
    if (Object.keys(er).length) return setMsg({ type: 'error', text: 'Please fix the highlighted fields.' });
    if (signupMode) {
      const r = signup(f);
      if (!r.ok) return setMsg({ type: 'error', text: r.msg });
      setMsg({ type: 'success', text: 'Account created! Redirecting to login…' });
      setTimeout(() => nav('/login'), 1000);
    } else {
      const r = login(f.email, f.password);
      if (!r.ok) return setMsg({ type: 'error', text: r.msg });
      nav(home(r.user));
    }
  };
  const fill = (email, password) => setF({ ...f, email, password });

  return (
    <div className="authwrap">
      <div className="authside"><h1>◆ FolioHub</h1><p>Showcase your skills, projects and achievements with an SEO-friendly portfolio platform.</p><ul><li>Project gallery</li><li>Blog &amp; articles</li><li>Contact inbox</li></ul></div>
      <form className="authcard" onSubmit={submit} noValidate>
        <h2>{signupMode ? 'Create account' : 'Welcome back'}</h2>
        <Alert type={msg.type}>{msg.text}</Alert>
        {signupMode && <Field label="Full name" value={f.name} onChange={set('name')} error={errs.name} />}
        <Field label="Email" type="email" value={f.email} onChange={set('email')} error={errs.email} />
        <Field label="Password" type="password" value={f.password} onChange={set('password')} error={errs.password} />
        {signupMode && <>
          <Field label="Confirm password" type="password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} />
          <Field label="Role" select options={['user', 'admin']} value={f.role} onChange={set('role')} />
          {f.role === 'admin' && <Field label={`Admin invite code (demo: ${ADMIN_CODE})`} value={f.code} onChange={set('code')} error={errs.code} />}
        </>}
        <button className="btn full">{signupMode ? 'Sign up' : 'Login'}</button>
        {!signupMode && <div className="demo"><b>Demo accounts</b>
          <button type="button" onClick={() => fill('admin@foliohub.com', 'Admin@123')}>Use Admin</button>
          <button type="button" onClick={() => fill('user@foliohub.com', 'User@123')}>Use User</button></div>}
        <p className="muted">{signupMode ? <>Have an account? <Link to="/login">Login</Link></> : <>New here? <Link to="/signup">Sign up</Link></>} · <Link to="/">Home</Link></p>
      </form>
    </div>
  );
}

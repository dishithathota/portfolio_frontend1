import { useState } from 'react';
import { Field, Alert } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { log } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function Profile() {
  useSEO('My Profile');
  const { user, updateProfile } = useAuth();
  const [f, setF] = useState({ name: user.name, bio: user.bio, location: user.location, website: user.website, password: '' });
  const [errs, setErrs] = useState({});
  const [ok, setOk] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Name is required.';
    if (f.website && !/^https?:\/\/\S+$/.test(f.website)) er.website = 'Use a full URL starting with http(s)://';
    if (f.password && f.password.length < 6) er.password = 'Min 6 characters.';
    setErrs(er); setOk(false);
    if (Object.keys(er).length) return;
    const { password, ...rest } = f;
    updateProfile(password ? { ...rest, password } : rest);
    log(user.id, 'Updated profile'); setF({ ...f, password: '' }); setOk(true);
  };
  return (
    <>
      <h1>My Profile</h1>
      <form className="card form narrow" onSubmit={submit} noValidate>
        <Alert type="success">{ok && 'Profile updated.'}</Alert>
        <Field label="Email (cannot be changed)" value={user.email} disabled readOnly />
        <Field label="Full name" value={f.name} onChange={set('name')} error={errs.name} />
        <Field label="Bio" textarea value={f.bio} onChange={set('bio')} />
        <Field label="Location" value={f.location} onChange={set('location')} />
        <Field label="Website" value={f.website} onChange={set('website')} error={errs.website} />
        <Field label="New password (optional)" type="password" value={f.password} onChange={set('password')} error={errs.password} />
        <button className="btn">Save changes</button>
      </form>
    </>
  );
}

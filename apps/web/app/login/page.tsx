'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer'|'admin'>('customer');
  const [error, setError] = useState<string|null>(null);
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [adminKey, setAdminKey] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload: any = mode === 'login'
        ? { email, password }
        : { email, password, role, adminSetupKey: role==='admin' ? adminKey : undefined };
      const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data === 'string' ? data : data.message || 'Ошибка');
      if (mode === 'login') { localStorage.setItem('token', data.accessToken); r.push('/'); } else { setMode('login'); }
    } catch (e:any) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6">
      <h1 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form className="grid gap-3" onSubmit={submit}>
        {mode === 'register' && (
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Роль</span>
            <select className="rounded-xl border px-3 py-2" value={role} onChange={e=>setRole(e.target.value as any)}>
              <option value="customer">Заказчик</option>
              <option value="admin">Админ</option>
            </select>
          </label>
        )}
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Email</span>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Пароль</span>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {mode === 'register' && role === 'admin' && (
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Admin setup key</span>
            <input className="input" value={adminKey} onChange={e=>setAdminKey(e.target.value)} />
          </label>
        )}
        <button className="btn-primary">{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <div className="mt-3 text-sm text-gray-600">
        {mode === 'login' ? <>Нет аккаунта? <button className="underline" onClick={()=>setMode('register')}>Зарегистрируйтесь</button></> : <>Уже есть аккаунт? <button className="underline" onClick={()=>setMode('login')}>Войти</button></>}
      </div>
      <div className="mt-3 text-sm"><Link className="underline" href="/">← На главную</Link></div>
    </div>
  );
}

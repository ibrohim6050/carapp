'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function BidPage() {
  const { id } = useParams<{id:string}>();
  const r = useRouter();
  const [form, setForm] = useState({ amountCurrency: 'UZS', amountValue: 0, etaDays: 0, comment: '' });
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { api(`/loads/${id}/my-bid`).then((b:any)=> b && setForm({ amountCurrency: b.amountCurrency, amountValue: b.amountValue, etaDays: b.etaDays ?? 0, comment: b.comment ?? ''})).catch(()=>{}); }, [id]);
  const set = (k: string, v: any) => setForm(p => ({...p, [k]: v}));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setErr(null);
    try { await api(`/loads/${id}/bids`, { method: 'POST', body: JSON.stringify(form) }); r.push(`/loads/${id}`); }
    catch (e:any) { setErr(e.message); } };
  return (
    <div className="card max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Ваша ставка</h1>
      <p className="text-sm text-gray-600 mb-4">Для теста без реального входа оставьте dev-заголовки в `.env` фронтенда. После входа токен подставится сам.</p>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form className="grid gap-4" onSubmit={submit}>
        <div className="grid grid-cols-3 gap-4">
          <div><div className="label">Валюта</div><input className="input" value={form.amountCurrency} onChange={e=>set('amountCurrency', e.target.value)} /></div>
          <div><div className="label">Сумма</div><input type="number" className="input" value={form.amountValue} onChange={e=>set('amountValue', parseFloat(e.target.value))} /></div>
          <div><div className="label">ETA (дней)</div><input type="number" className="input" value={form.etaDays} onChange={e=>set('etaDays', parseInt(e.target.value))} /></div>
        </div>
        <div><div className="label">Комментарий</div><textarea className="input" value={form.comment} onChange={e=>set('comment', e.target.value)} /></div>
        <button className="btn-primary" type="submit">Сохранить</button>
      </form>
    </div>
  );
}

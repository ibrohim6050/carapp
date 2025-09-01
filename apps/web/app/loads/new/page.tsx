'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NewLoadPage() {
  const r = useRouter();
  const [form, setForm] = useState({ title: '', cargoType: '', weightTons: 20, pickupAddr: '', deliveryAddr: 'Ташкент', customsPoint: '', targetDate: '', notes: '', biddingDeadlineAt: '' });
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try { const res = await api<{id:string}>('/loads', { method: 'POST', body: JSON.stringify(form) }); r.push(`/loads/${res.id}`); }
    catch (e:any) { setErr(e.message); }
  };
  const set = (k: string, v: any) => setForm(p => ({...p, [k]: v}));

  return (
    <div className="card max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Создать заявку</h1>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form className="grid gap-4" onSubmit={submit}>
        <div><div className="label">Название</div><input className="input" value={form.title} onChange={e=>set('title', e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><div className="label">Тип груза</div><input className="input" value={form.cargoType} onChange={e=>set('cargoType', e.target.value)} required /></div>
          <div><div className="label">Вес, тонн</div><input type="number" className="input" value={form.weightTons} onChange={e=>set('weightTons', parseFloat(e.target.value))} required /></div>
        </div>
        <div><div className="label">Адрес погрузки</div><input className="input" value={form.pickupAddr} onChange={e=>set('pickupAddr', e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><div className="label">Адрес доставки</div><input className="input" value={form.deliveryAddr} onChange={e=>set('deliveryAddr', e.target.value)} required /></div>
          <div><div className="label">Таможенный пункт</div><input className="input" value={form.customsPoint} onChange={e=>set('customsPoint', e.target.value)} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><div className="label">Дата доставки (план)</div><input type="datetime-local" className="input" value={form.targetDate} onChange={e=>set('targetDate', e.target.value)} required /></div>
          <div><div className="label">Дедлайн ставок</div><input type="datetime-local" className="input" value={form.biddingDeadlineAt} onChange={e=>set('biddingDeadlineAt', e.target.value)} required /></div>
        </div>
        <div><div className="label">Примечания</div><textarea className="input" value={form.notes} onChange={e=>set('notes', e.target.value)} /></div>
        <button className="btn-primary" type="submit">Создать</button>
      </form>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Load = { id: string; title: string; cargoType: string; weightTons: number; pickupAddr: string; deliveryAddr: string; customsPoint: string; targetDate: string; biddingDeadlineAt: string; status: string; };
export default function LoadPage() {
  const { id } = useParams<{id:string}>();
  const [item, setItem] = useState<Load | null>(null);
  const [bids, setBids] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { api<Load>(`/loads/${id}`).then(setItem).catch(e=>setErr(e.message)); }, [id]);

  const fetchBids = async () => {
    try { const list = await api<any[]>(`/loads/${id}/bids`); setBids(list); } catch (e:any) { setErr(e.message); }
  };

  return (
    <div className="grid gap-4">
      {err && <p className="text-red-600">{err}</p>}
      {item && (
        <div className="card">
          <h1 className="text-xl font-semibold mb-2">{item.title}</h1>
          <div className="text-gray-700">{item.cargoType} · {item.weightTons} т</div>
          <div className="text-gray-700">{item.pickupAddr} → {item.deliveryAddr} (таможня: {item.customsPoint})</div>
          <div className="text-sm text-gray-600 mt-2">Поставка: {new Date(item.targetDate).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Дедлайн ставок: {new Date(item.biddingDeadlineAt).toLocaleString()}</div>
          <div className="mt-4 flex gap-2">
            <Link href={`/loads/${id}/bid`} className="btn-primary">Подать / изменить ставку</Link>
            <button onClick={fetchBids} className="btn">Показать ставки (для заказчика после дедлайна)</button>
          </div>
        </div>
      )}

      {bids && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Ставки</h2>
          <div className="grid gap-2">
            {bids.map(b => (
              <div key={b.id} className="border rounded-xl p-3 flex justify-between">
                <div>Компания: {b.carrierCompanyId}</div>
                <div>{b.amountValue} {b.amountCurrency}</div>
                <div>ETA: {b.etaDays ?? '-'} дн.</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

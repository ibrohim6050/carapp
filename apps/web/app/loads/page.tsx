'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

type Load = {
  id: string; title: string; cargoType: string; weightTons: number;
  pickupAddr: string; deliveryAddr: string; customsPoint: string;
  targetDate: string; biddingDeadlineAt: string; status: string;
};

export default function LoadsPage() {
  const [items, setItems] = useState<Load[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { api<Load[]>('/loads?status=open').then(setItems).catch(e => setError(e.message)); }, []);
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Открытые заявки</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4">
        {items.map(l => (
          <Link key={l.id} href={`/loads/${l.id}`} className="block border p-4 rounded-xl hover:bg-gray-50">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-sm text-gray-600">{l.cargoType} · {l.weightTons} т</div>
                <div className="text-sm text-gray-600">{l.pickupAddr} → {l.deliveryAddr} (таможня: {l.customsPoint})</div>
              </div>
              <div className="text-right text-sm text-gray-600">
                Дедлайн: {new Date(l.biddingDeadlineAt).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
        {items.length === 0 && <div className="text-gray-500">Нет открытых заявок.</div>}
      </div>
    </div>
  );
}

import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header className="border-b bg-white">
          <div className="container py-4 flex gap-6 items-center">
            <Link href="/" className="font-semibold">Freight Marketplace</Link>
            <nav className="flex gap-4 text-sm text-gray-700">
              <Link href="/loads">Заявки</Link>
              <Link href="/loads/new">Создать заявку</Link>
              <Link href="/login">Login / Register</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}

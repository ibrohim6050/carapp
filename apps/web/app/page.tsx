export default function Home() {
  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-2">Добро пожаловать 👋</h1>
      <p className="text-gray-700">MVP с закрытыми ставками и входом по паролю для админа/заказчика.</p>
      <ul className="list-disc ml-6 mt-4 text-gray-700">
        <li>Зарегистрируйтесь/войдите на странице <b>Login / Register</b></li>
        <li>Создайте заявку в <b>Создать заявку</b></li>
        <li>Перевозчик подаёт ставку в карточке заявки</li>
      </ul>
    </div>
  );
}

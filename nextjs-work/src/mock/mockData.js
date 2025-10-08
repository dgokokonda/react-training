// utils/mockData.js

// Имитация API для демонстрации
export async function mockLoadOptions(page, search = "") {
  // Имитация задержки сети
  console.log(page, search);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pageSize = 20;
  const totalItems = 1000;

  // Фильтрация по поиску
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  console.log(pageSize, startIndex, endIndex, totalItems);
  const options = [];

  for (let i = startIndex; i < endIndex; i++) {
    options.push({
      id: i + 1,
      value: `option-${i + 1}`,
      label: `Опция ${i + 1}${search ? ` - поиск: ${search}` : ""}`,
    });
  }

  const hasMore = endIndex < totalItems;

  return {
    options,
    hasMore,
  };
}

// Альтернативная функция для пользователей
export async function mockLoadUsers(page, search = "") {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const pageSize = 15;
  const totalUsers = 500;

  const users = [];
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalUsers);

  const names = [
    "Иван",
    "Мария",
    "Петр",
    "Анна",
    "Сергей",
    "Ольга",
    "Алексей",
    "Елена",
  ];
  const lastNames = [
    "Иванов",
    "Петров",
    "Сидоров",
    "Кузнецов",
    "Смирнов",
    "Попов",
  ];

  for (let i = startIndex; i < endIndex; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${name} ${lastName}`;

    // Фильтрация по поиску
    if (search && !fullName.toLowerCase().includes(search.toLowerCase())) {
      continue;
    }

    users.push({
      id: i + 1,
      value: `user-${i + 1}`,
      label: fullName,
      email: `user${i + 1}@example.com`,
    });
  }

  const hasMore = endIndex < totalUsers;

  return {
    options: users,
    hasMore,
  };
}

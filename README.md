# StrongPlay

Сайт игрового мультигеймерского сообщества **StrongPlay**.

Ретро-пиксельный дизайн с тёмной темой и неоновыми акцентами.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Страницы

| Маршрут | Описание |
|---|---|
| `/` | Главная — герой-секция, «О нас», список игр, CTA на YouTube |
| `/teams` | Состав команд — карточки игроков, сгруппированные по играм |
| `/gallery` | Галерея — сетка скриншотов с лайтбокс-просмотром |

## Технологии

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **CSS Modules** — пиксельный шрифт Press Start 2P, тёмная тема
- **Docker** — multi-stage standalone build

## Быстрый старт

### Разработка

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Продакшн (локально)

```bash
npm run build
npm run start
```

### Docker

```bash
docker compose up -d
```

Сайт будет доступен на порту **3000**.

## Структура проекта

```
app/
  layout.tsx            # Корневой layout (Header + Footer)
  page.tsx              # Главная страница
  globals.css           # Глобальные стили и CSS-переменные
  gallery/page.tsx      # Галерея
  teams/page.tsx        # Состав команд
components/             # React-компоненты (Header, Footer, TeamCard, GalleryGrid)
data/                   # Статические данные (teams.ts, gallery.ts)
public/                 # Статические файлы
Dockerfile              # Multi-stage build для Docker
docker-compose.yml      # Конфигурация Docker Compose
```

## Обновление контента

Все данные хранятся в статических файлах:

- **`data/teams.ts`** — список команд и игроков (ник, роль, аватар)
- **`data/gallery.ts`** — список изображений для галереи

Изображения размещайте в `public/images/` и обновляйте пути в файлах данных.

## Скрипты

```bash
npm run dev       # Запуск dev-сервера
npm run build     # Сборка для продакшна
npm run start     # Запуск продакшн-сервера
npm run lint      # Проверка ESLint
```

## Лицензия

Все права защищены.

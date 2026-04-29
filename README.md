# StrongPlay

Сайт и CRM-панель игрового мультигеймерского сообщества **StrongPlay**.

Ретро-пиксельный дизайн с тёмной темой и неоновыми акцентами.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-5-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Архитектура

Монорепозиторий из двух приложений и PostgreSQL:

```
docker-compose.yml
├── web (порт 3000)      # Основной сайт Next.js — читает данные из CRM API
├── crm (порт 3001)      # CRM-панель — Express API + React SPA
└── postgres (порт 5432) # Общая база данных
```

## Сайт — Страницы

| Маршрут | Описание |
|---|---|
| `/` | Главная — герой-секция, «О нас», список игр, CTA на YouTube |
| `/teams` | Состав команд — карточки игроков, сгруппированные по играм |
| `/gallery` | Галерея — сетка скриншотов с лайтбокс-просмотром |

## CRM — Разделы

| Маршрут | Описание |
|---|---|
| `/` | Дашборд — статистика по командам, игрокам, фото |
| `/players` | Игроки — управление пулом игроков сообщества |
| `/teams` | Команды — CRUD команд, назначение игроков из пула |
| `/gallery` | Галерея — загрузка изображений с прогресс-баром |
| `/settings` | Настройки — SEO-мета, слоган, список игр |

**Логин по умолчанию:** `admin` / `admin123`

## Технологии

### Сайт
- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **CSS Modules** — пиксельный шрифт Press Start 2P, тёмная тема
- ISR с revalidate 60 сек, данные из CRM API

### CRM
- **Express 5** — REST API (JWT-авторизация)
- **React 19** + **Vite** — SPA-фронтенд
- **Prisma** — ORM для PostgreSQL
- **PostgreSQL 16** — общая база данных

## Быстрый старт

### Через скрипт (рекомендуется)

```bash
./start.sh setup     # Первоначальная установка
./start.sh start     # Запуск всех сервисов
```

### Разработка сайта

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Разработка CRM

```bash
cd crm
npm install
npx prisma generate
npm run dev
```

Откройте [http://localhost:3001](http://localhost:3001)

Для CRM нужен PostgreSQL. Запустите только БД:

```bash
docker compose up -d postgres
```

Затем миграции и сидинг:

```bash
cd crm
export DATABASE_URL="postgresql://strongplay:strongplay_db_pass@localhost:5432/strongplay"
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### Docker (продакшн)

```bash
docker compose up -d --build
```

| Сервис | Порт | Описание |
|---|---|---|
| `web` | 3000 | Основной сайт |
| `crm` | 3001 | CRM-панель |
| `postgres` | 5432 | PostgreSQL |

## Структура проекта

```
app/                         # Next.js страницы (App Router)
  layout.tsx                 # Корневой layout (Header + Footer)
  page.tsx                   # Главная страница
  globals.css                # Глобальные стили и CSS-переменные
  gallery/page.tsx           # Галерея
  teams/page.tsx             # Состав команд
components/                  # React-компоненты сайта
lib/api.ts                   # Клиент для запросов к CRM API
crm/                         # CRM-панель
  server/                    # Express API
    index.ts                 # Entry point
    middleware/auth.ts       # JWT-авторизация
    routes/                  # API-эндпоинты (auth, teams, players, gallery, pages)
  client/src/                # React SPA
    pages/                   # Страницы CRM
    components/              # Компоненты (Layout, ConfirmModal)
    api.ts                   # HTTP-клиент
  prisma/                    # Prisma-схема, миграции, сидинг
  Dockerfile                 # Multi-stage build
docker-compose.yml           # postgres + crm + web
start.sh                     # Скрипт управления
```

## Обновление контента

Контент управляется через CRM-панель на [http://localhost:3001](http://localhost:3001):

- **Игроки** — добавление/редактирование/удаление, назначение в команды
- **Команды** — создание команд по играм, распределение игроков
- **Галерея** — загрузка изображений, подписи, сортировка
- **Настройки** — SEO-мета, слоган, список игр на главной

Основной сайт автоматически подтягивает изменения через ISR (revalidate 60 сек).

## Скрипты управления

```bash
./start.sh setup     # Первоначальная установка зависимостей
./start.sh start     # Запуск всех сервисов (Docker)
./start.sh dev       # Режим разработки с hot reload
./start.sh stop      # Остановка сервисов
./start.sh restart   # Перезапуск
./start.sh logs      # Логи (опционально: имя сервиса)
./start.sh status    # Статус контейнеров
./start.sh rebuild   # Полная пересборка без кэша
```

## Лицензия

Все права защищены.

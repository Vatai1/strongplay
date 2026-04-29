#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CRM_DIR="$ROOT_DIR/crm"

check_deps() {
  local missing=()
  for cmd in node npm npx; do
    if ! command -v "$cmd" &>/dev/null; then
      missing+=("$cmd")
    fi
  done
  if [ ${#missing[@]} -gt 0 ]; then
    err "Не найдены команды: ${missing[*]}"
    exit 1
  fi
}

install_deps() {
  if [ ! -d "$ROOT_DIR/node_modules" ]; then
    info "Установка зависимостей основного сайта..."
    (cd "$ROOT_DIR" && npm install)
  fi
  if [ ! -d "$CRM_DIR/node_modules" ]; then
    info "Установка зависимостей CRM..."
    (cd "$CRM_DIR" && npm install)
  fi
}

run_in_crm() {
  (cd "$CRM_DIR" && "$@")
}

setup_db() {
  info "Генерация Prisma клиента..."
  run_in_crm npm run db:generate

  info "Миграции базы данных..."
  run_in_crm npm run db:migrate

  info "Наполнение базы данных..."
  run_in_crm npm run db:seed
}

kill_port() {
  local port=$1
  local pid
  pid=$(lsof -ti:$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    warn "Порт $port занят (PID: $pid). Завершаю..."
    kill $pid 2>/dev/null || true
    sleep 1
  fi
}

start_dev() {
  info "Запуск в режиме разработки..."
  echo ""
  echo -e "  ${GREEN}Сайт:${NC}       http://localhost:3000"
  echo -e "  ${GREEN}CRM API:${NC}    http://localhost:3001"
  echo -e "  ${GREEN}CRM фронт:${NC}  http://localhost:5173"
  echo ""

  kill_port 3000
  kill_port 3001
  kill_port 5173

  info "Запуск CRM (сервер + клиент)..."
  npm run dev --prefix "$CRM_DIR" &
  CRM_PID=$!

  sleep 3

  info "Запуск основного сайта..."
  npm run dev --prefix "$ROOT_DIR" &
  WEB_PID=$!

  echo ""
  ok "Все сервисы запущены (PID: CRM=$CRM_PID, Сайт=$WEB_PID)"
  echo "  Нажмите Ctrl+C для остановки"
  echo ""

  cleanup() {
    echo ""
    info "Остановка сервисов..."
    kill $CRM_PID $WEB_PID 2>/dev/null || true
    ok "Все сервисы остановлены"
    exit 0
  }
  trap cleanup SIGINT SIGTERM

  wait
}

start_prod() {
  info "Сборка основного сайта..."
  npm run build --prefix "$ROOT_DIR"

  info "Сборка CRM..."
  npm run build --prefix "$CRM_DIR"

  echo ""
  echo -e "  ${GREEN}Сайт:${NC}  http://localhost:3000"
  echo -e "  ${GREEN}CRM:${NC}   http://localhost:3001"
  echo ""

  kill_port 3000
  kill_port 3001

  info "Запуск CRM сервера..."
  npm run start --prefix "$CRM_DIR" &
  CRM_PID=$!

  sleep 2

  info "Запуск основного сайта..."
  npm run start --prefix "$ROOT_DIR" &
  WEB_PID=$!

  echo ""
  ok "Все сервисы запущены (PID: CRM=$CRM_PID, Сайт=$WEB_PID)"
  echo "  Нажмите Ctrl+C для остановки"
  echo ""

  cleanup() {
    echo ""
    info "Остановка сервисов..."
    kill $CRM_PID $WEB_PID 2>/dev/null || true
    ok "Все сервисы остановлены"
    exit 0
  }
  trap cleanup SIGINT SIGTERM

  wait
}

start_docker() {
  if ! command -v docker &>/dev/null || ! command -v docker compose &>/dev/null; then
    err "Docker / Docker Compose не найдены"
    exit 1
  fi
  info "Запуск через Docker Compose..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" up --build -d
  ok "Контейнеры запущены"
  echo -e "  ${GREEN}Сайт:${NC}  http://localhost:3000"
  echo -e "  ${GREEN}CRM:${NC}   http://localhost:3001"
}

stop_all() {
  info "Остановка всех сервисов..."
  kill_port 3000
  kill_port 3001
  if command -v docker &>/dev/null; then
    docker compose -f "$ROOT_DIR/docker-compose.yml" down 2>/dev/null || true
  fi
  ok "Все сервисы остановлены"
}

show_help() {
  echo ""
  echo -e "${CYAN}StrongPlay — скрипт запуска${NC}"
  echo ""
  echo "Использование: ./start.sh <команда>"
  echo ""
  echo "Команды:"
  echo "  dev       Запуск в режиме разработки (по умолчанию)"
  echo "  prod      Сборка и запуск в production"
  echo "  docker    Запуск через Docker Compose"
  echo "  setup     Первичная установка (зависимости + БД)"
  echo "  stop      Остановка всех сервисов"
  echo "  build     Сборка без запуска"
  echo "  help      Показать эту справку"
  echo ""
}

cmd_build() {
  info "Сборка основного сайта..."
  npm run build --prefix "$ROOT_DIR"
  info "Сборка CRM..."
  npm run build --prefix "$CRM_DIR"
  ok "Сборка завершена"
}

case "${1:-}" in
  dev|"")
    check_deps
    install_deps
    start_dev
    ;;
  prod)
    check_deps
    install_deps
    start_prod
    ;;
  docker)
    start_docker
    ;;
  setup)
    check_deps
    install_deps
    setup_db
    ok "Установка завершена. Запустите: ./start.sh dev"
    ;;
  stop)
    stop_all
    ;;
  build)
    check_deps
    cmd_build
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    err "Неизвестная команда: $1"
    show_help
    exit 1
    ;;
esac

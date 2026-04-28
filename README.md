# project-template-web

## Содержание

- [Требования](#требования)
- [Локальная разработка](#локальная-разработка)
- [Переменные окружения](#переменные-окружения)
- [Деплой в продакшн](#деплой-в-продакшн)
- [Настройка Keycloak](#настройка-keycloak)

## Требования

- Node.js 20+
- pnpm 9+

## Локальная разработка

```bash
# Установка зависимостей
pnpm install

# Запуск dev-сервера
pnpm dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# NextAuth
AUTH_SECRET=your-secret-key

# Keycloak
KEYCLOAK_CLIENT_ID=project-template
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=https://sso.server.group/realms/project-template
```

### Генерация AUTH_SECRET

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Или с использованием openssl:

```shell
openssl rand -base64 32
```

## Деплой в продакшн

### Вариант 1: Vercel (рекомендуется)

1. **Подключите репозиторий к Vercel:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Нажмите "Add New Project"
   - Импортируйте репозиторий из GitHub

2. **Настройте переменные окружения:**
   - В настройках проекта перейдите в Settings > Environment Variables
   - Добавьте все переменные из раздела [Переменные окружения](#переменные-окружения)

3. **Задеплойте:**
   - Vercel автоматически задеплоит проект при каждом push в main ветку
   - Для ручного деплоя используйте Vercel CLI:
   ```bash
   pnpm install -g vercel
   vercel --prod
   ```

### Вариант 2: Docker

1. **Соберите Docker-образ:**
   ```bash
   docker build -t project-template-web .
   ```

2. **Запустите контейнер:**
   ```bash
   docker run -p 3000:3000 \
     -e AUTH_SECRET=your-secret \
     -e KEYCLOAK_CLIENT_ID=project-template \
     -e KEYCLOAK_CLIENT_SECRET=your-secret \
     -e KEYCLOAK_ISSUER=https://sso.server.group/realms/project-template \
     project-template-web
   ```

### Вариант 3: Standalone Node.js

1. **Соберите проект:**
   ```bash
   pnpm build
   ```

2. **Запустите production сервер:**
   ```bash
   pnpm start
   ```

   Или с использованием standalone output:
   ```bash
   node .next/standalone/server.js
   ```

## Настройка Keycloak

Для корректной работы SSO авторизации настройте клиент в Keycloak:

### Valid Redirect URIs

```
# Для локальной разработки
http://localhost:3000/api/auth/callback/keycloak

# Для Vercel preview
https://*.vercel.app/api/auth/callback/keycloak

# Для продакшена
https://your-domain.com/api/auth/callback/keycloak
```

### Valid Post Logout Redirect URIs

```
http://localhost:3000
https://*.vercel.app
https://your-domain.com
```

### Web Origins (CORS)

```
http://localhost:3000
https://*.vercel.app
https://your-domain.com
```

### Настройки клиента

- **Client Protocol:** openid-connect
- **Access Type:** confidential
- **Standard Flow Enabled:** ON
- **Direct Access Grants Enabled:** ON (опционально, для тестирования)

-- Создаём таблицу пользователей
CREATE TABLE IF NOT EXISTS "Users" (
    "Id"            SERIAL           PRIMARY KEY,
    "Email"         VARCHAR(100)     NOT NULL UNIQUE,
    "PasswordHash"  VARCHAR(255)     NOT NULL,
    "IsActivated"   BOOLEAN          NOT NULL DEFAULT FALSE,
    "ActivationLink" VARCHAR(255)
);

-- Создаём таблицу товаров
CREATE TABLE IF NOT EXISTS "Products" (
    "Id"        SERIAL           PRIMARY KEY,
    "Title"     VARCHAR(255),
    "Price"     NUMERIC(10,2),
    "ImageUrl"  TEXT,
    "UserId"    INTEGER          NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE
);

-- Создаём таблицу сообщений
CREATE TABLE IF NOT EXISTS "Messages" (
    "Id"          SERIAL           PRIMARY KEY,
    "Content"     TEXT             NOT NULL,
    "SenderId"    INTEGER          NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ReceiverId"  INTEGER          NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId"   INTEGER          NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "SentAt"      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу для хранения refresh-токенов
CREATE TABLE IF NOT EXISTS "Tokens" (
    "Id"           SERIAL           PRIMARY KEY,
    "RefreshToken" VARCHAR(500)     NOT NULL,
    "UserId"       INTEGER          NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE
);

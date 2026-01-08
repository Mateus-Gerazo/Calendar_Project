# Docker Setup - Calendar Project

Este projeto está configurado para rodar completamente com Docker e Docker Compose.

## Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (geralmente incluído no Docker Desktop)

## Estrutura Docker

O projeto consiste em 3 containers:
- **postgres**: Banco de dados PostgreSQL
- **server**: API backend (Node.js/Express)
- **client**: Frontend React (Vite)

## Comandos Disponíveis

### Produção

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (apaga dados do banco)
docker-compose down -v

# Reconstruir imagens
docker-compose build

# Reconstruir e iniciar
docker-compose up -d --build
```

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (com hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços de desenvolvimento
docker-compose -f docker-compose.dev.yml down
```

## Acessos

Após iniciar os containers:

- **Frontend**: http://localhost:80 (produção) ou http://localhost:5173 (desenvolvimento)
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432

## Variáveis de Ambiente

As variáveis de ambiente estão configuradas no `docker-compose.yml`. Para produção, você pode criar um arquivo `.env` na raiz do projeto e referenciá-lo no docker-compose.yml.

### Exemplo de .env para produção:

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=calendar_app
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:80
```

## Volumes

O Docker cria um volume persistente para o PostgreSQL:
- `postgres_data`: Dados do banco de dados (produção)
- `postgres_data_dev`: Dados do banco de dados (desenvolvimento)

## Troubleshooting

### Verificar se os containers estão rodando:
```bash
docker-compose ps
```

### Ver logs de um serviço específico:
```bash
docker-compose logs server
docker-compose logs client
docker-compose logs postgres
```

### Acessar o banco de dados:
```bash
docker-compose exec postgres psql -U postgres -d calendar_app
```

### Reconstruir um serviço específico:
```bash
docker-compose build server
docker-compose up -d server
```

### Limpar tudo e começar do zero:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Desenvolvimento vs Produção

- **Desenvolvimento** (`docker-compose.dev.yml`): 
  - Hot-reload habilitado
  - Volumes montados para edição de código em tempo real
  - Frontend na porta 5173
  - Logs mais verbosos

- **Produção** (`docker-compose.yml`):
  - Código compilado e otimizado
  - Frontend servido via Nginx
  - Frontend na porta 80
  - Melhor performance

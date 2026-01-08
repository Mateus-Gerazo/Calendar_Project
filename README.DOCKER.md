# Docker Setup - Calendar Project

Este projeto está configurado para rodar completamente com Docker e Docker Compose.

## Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (geralmente incluído no Docker Desktop)

## Estrutura Docker

O projeto possui duas configurações:

### 1. Produção (`docker-compose.yml`)
- Servidor Node.js compilado
- Cliente React compilado servido via Nginx
- PostgreSQL
- Otimizado para produção

### 2. Desenvolvimento (`docker-compose.dev.yml`)
- Hot reload para servidor e cliente
- Volumes montados para desenvolvimento
- Ideal para desenvolvimento local

## Comandos

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
docker-compose build --no-cache
```

### Desenvolvimento

```bash
# Construir e iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços de desenvolvimento
docker-compose -f docker-compose.dev.yml down
```

## Acessos

### Produção
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432

## Variáveis de Ambiente

As variáveis de ambiente são configuradas no `docker-compose.yml` ou `docker-compose.dev.yml`.

Para produção, você pode criar um arquivo `.env` na raiz do projeto:

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=calendar_app
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost
```

E referenciar no docker-compose.yml:

```yaml
environment:
  DB_HOST: ${DB_HOST}
  # ... outras variáveis
```

## Volumes

### Produção
- `postgres_data`: Dados persistentes do PostgreSQL

### Desenvolvimento
- `postgres_data_dev`: Dados persistentes do PostgreSQL (desenvolvimento)
- Volumes montados para hot reload nos serviços server e client

## Troubleshooting

### Verificar se os containers estão rodando
```bash
docker-compose ps
```

### Ver logs de um serviço específico
```bash
docker-compose logs server
docker-compose logs client
docker-compose logs postgres
```

### Acessar o container do banco de dados
```bash
docker-compose exec postgres psql -U postgres -d calendar_app
```

### Reconstruir um serviço específico
```bash
docker-compose build server
docker-compose up -d server
```

### Limpar tudo e começar do zero
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Health Checks

Todos os serviços possuem health checks configurados:

- **PostgreSQL**: Verifica se o banco está pronto para conexões
- **Server**: Verifica o endpoint `/health`
- **Client**: Verifica se o Nginx está respondendo

Você pode verificar o status com:
```bash
docker-compose ps
```

## Desenvolvimento Local vs Docker

### Desenvolvimento Local
- Execute `npm install` em cada diretório
- Execute `npm run dev` manualmente
- Configure PostgreSQL localmente

### Docker
- Tudo roda em containers isolados
- Não precisa instalar dependências localmente
- PostgreSQL roda em container
- Fácil de compartilhar e deploy

## Próximos Passos

1. Execute `docker-compose up -d` para iniciar
2. Acesse http://localhost (produção) ou http://localhost:5173 (desenvolvimento)
3. O banco de dados será inicializado automaticamente na primeira execução
4. As tabelas serão criadas automaticamente pelo servidor

# 📅 Sistema de Calendário Dinâmico (Full-Stack)

Um sistema completo de gerenciamento de agenda pessoal desenvolvido com arquitetura moderna, separando totalmente o Back-End (API RESTful) do Front-End (SPA). O projeto foi construído utilizando **TypeScript** para garantir robustez e escalabilidade.

## 🚀 Funcionalidades

- **Autenticação Segura:** Login e Registro com JWT (JSON Web Token) e senhas criptografadas (Bcrypt).
- **Calendário Interativo:** Visualização mensal, semanal e diária (baseado em `react-big-calendar`).
- **CRUD de Eventos:** Criação, Edição e Exclusão de eventos com validação de datas.
- **Integração Externa:**
  - Botão para gerar link direto para o **Google Calendar**.
  - Exportação de eventos em formato **.ics** (iCalendar).
- **Arquitetura Escalável:**
  - Preparado para futura integração com **WhatsApp Bot** (campo `telefone` no banco).
  - API independente do Front-End.

## 🛠️ Tech Stack

### Back-End (`/server`)
- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Driver `pg` com queries SQL puras)
- **Auth:** JWT + BcryptJS

### Front-End (`/client`)
- **Framework:** React.js
- **Linguagem:** TypeScript
- **Bibliotecas:** - `react-big-calendar` (Visualização)
  - `date-fns` (Manipulação de datas)
  - `axios` (Comunicação HTTP)
  - `react-router-dom` (Navegação)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v16 ou superior)
- [PostgreSQL](https://www.postgresql.org/)

---

## 🔧 Instalação e Configuração

Siga os passos abaixo na ordem para configurar o ambiente de desenvolvimento.

### Passo 1: Configurar o Banco de Dados

1. Acesse o seu PostgreSQL (pgAdmin ou terminal).
2. Crie um banco de dados chamado `calendario_db`.
3. Execute o seguinte script SQL para criar as tabelas:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) UNIQUE, -- Ex: "+5511999999999"
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    contatos TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

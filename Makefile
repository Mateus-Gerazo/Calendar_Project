.PHONY: help build up down logs restart clean dev dev-up dev-down

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose build

up: ## Inicia os containers em modo produção
	docker-compose up -d

down: ## Para os containers
	docker-compose down

logs: ## Mostra os logs dos containers
	docker-compose logs -f

restart: ## Reinicia os containers
	docker-compose restart

clean: ## Para e remove containers, volumes e imagens
	docker-compose down -v
	docker system prune -f

dev-up: ## Inicia os containers em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml up -d

dev-down: ## Para os containers de desenvolvimento
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Mostra os logs dos containers de desenvolvimento
	docker-compose -f docker-compose.dev.yml logs -f

rebuild: ## Reconstrói as imagens e inicia os containers
	docker-compose build --no-cache
	docker-compose up -d

ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

up:
	docker compose up -d

up-logs:
	docker compose up

down:
	docker-compose down

build:
	docker-compose build

sync-env:
	cp .env $(ROOT_DIR)/api/.env -f
	cp .env $(ROOT_DIR)/web/.env -f

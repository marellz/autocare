ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

up:
	docker compose up 

up-d:
	docker compose up -d

down:
	docker-compose down

build:
	docker-compose build

sync-env:
	cp .env $(ROOT_DIR)/api/.env -f
	cp .env $(ROOT_DIR)/web/.env -f

seed:
	docker exec -ti autocare-api npm run seed

refresh:
	docker exec -ti autocare-api npm run refresh
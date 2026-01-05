# Convenience targets for common project workflows

.PHONY: install dev build lint preview test coverage clean

install:
	@npm install

dev:
	@npm run dev

build:
	@npm run build

lint:
	@npm run lint

preview:
	@npm run preview

test:
	@npm test

coverage:
	@npx vitest run --coverage

clean:
	rm -rf node_modules .eslintcache coverage dist

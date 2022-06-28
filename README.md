# transcendence-api

## Usage

Run following commands in `transcendence-env` directory.

### Setup

```
docker-compose exec api yarm migration:run
```

### Migration

Automatically generate migration file from Entity files
```
docker-compose exec api yarn migration:generate <name>
```
Create migration file template
```
docker-compose exec api yarn migration:create <name>
```
Run migrations
```
docker-compose exec api yarn migration:run
```
Revert latest migration
```
docker-compose exec api yarn migration:revert
```
Show migrations
```
docker-compose exec api yarn migration:show
```

### Seeding

Show TypeORM Seeding config
```
docker-compose exec api yarn seed:config
```
Execute seed
```
docker-compose exec api yarn seed:run [-s SeederClassName]
```

### Test

Run all tests
```
docker-compose exec api yarn test
```

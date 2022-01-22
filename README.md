

**migration**
```
docker-compose exec api yarn migration:generate <name>  # make migrations file
docker-compose exec api yarn migration:run              # migrate
docker-compose exec api yarn migration:revert           # revert migration
```

**test**
```
docker-compose exec api yarn test  # run all tests
```
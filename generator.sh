docker run --rm -v $(pwd)/../:/local openapitools/openapi-generator-cli:v5.3.1 generate -i /local/docs/openapi.yaml -g typescript-nestjs -o /local/api/src/generated

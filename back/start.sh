#!/bin/bash
set -e

echo "Aguardando MongoDB iniciar..."

for i in {1..30}; do
  nc -z mongo 27017 && break
  echo "Mongo ainda não disponível... tentando de novo ($i)"
  sleep 1
done

echo "Mongo está disponível! Rodando seed..."
node dist/seed.js

echo "Seed finalizado. Iniciando a API..."
node dist/server.js
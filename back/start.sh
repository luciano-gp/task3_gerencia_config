#!/bin/bash
set -e

echo "Aguardando MongoDB iniciar..."

for i in {1..90}; do
  nc -z mongo 27017 && break
  nc -z mongo 27018 && break
  echo "Mongo ainda não disponível... tentando de novo ($i)"
  sleep 1
done

echo "Mongo está disponível! Rodando seed..."
node dist/seed.js

echo "Seed finalizado. Iniciando a API..."
node dist/server.js
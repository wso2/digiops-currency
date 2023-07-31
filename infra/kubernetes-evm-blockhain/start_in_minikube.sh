#!/usr/bin/env bash
echo "Starting minikube"
minikube delete
minikube start --cpus 4 --memory 4096
./blockchainit
kubectl apply -f yaml/

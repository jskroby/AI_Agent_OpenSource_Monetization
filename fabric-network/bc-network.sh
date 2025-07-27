#!/bin/bash
# Generate crypto material and genesis block
cryptogen generate --config=./crypto-config.yaml
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block

# Start the network
docker-compose -f docker-compose-cli.yaml up -d

# Create channel and join peers
docker exec cli peer channel create -o orderer.example.com:7050 -c healthcare -f ./channel-artifacts/channel.tx
docker exec cli peer channel join -b healthcare.block

# Deploy chaincode
docker exec cli peer lifecycle chaincode package healthcare.tar.gz --path chaincode --lang golang --label healthcare_1

docker exec cli peer lifecycle chaincode install healthcare.tar.gz

docker exec cli peer lifecycle chaincode approveformyorg \
  --channelID healthcare --name healthcare --version 1.0 \
  --package-id $(docker exec cli peer lifecycle chaincode queryinstalled | awk '/healthcare_1/ {print $3}' | sed 's/,//') \
  --sequence 1

docker exec cli peer lifecycle chaincode commit -o orderer.example.com:7050 \
  --channelID healthcare --name healthcare --version 1.0 --sequence 1

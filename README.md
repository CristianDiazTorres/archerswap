# ArcherSwap Frontend

This project contains the main features of the ArcherSwap application.


## Overview

Official frontend repo of [exchange.archerswap.finance](https://archerswap.finance). The best AMM+NFT DEX on Core Chain.


## To Run

```
yarn
yarn start
```

The app will be running at http://localhost:3000/
<br/><br/>

# Deployment Guide


## 1. Contract Deployment

First of all, deploy ArcherswapFactory, MasterChef, BOW PEB20 token and Pairs contracts.
<br/><br/>


## 2. Deploy Subgraph

Go to [Archerswap-subgraph](https://github.com/Smart-Cookie-Group/archerswap-subgraph) repo and follow the instruction there, after deploying subgraph proceed to step 3.
<br/><br/>

## 3. Deploy Info Portal at [info.archerswap.finance](https://info.archerswap.finance)

Go to [Archerswap-info](https://github.com/Smart-Cookie-Group/archerswap-info) repo and follow the instruction there, after deploying subgraph proceed to step 4.
<br/><br/>

## 4. Deploy Exchange at [exchange.exchange.archerswap.finance](http://exchange.exchange.archerswap.finance/)

Go to [Archerswap-exchange](https://github.com/Smart-Cookie-Group/archerswap-exchange) repo and follow the instruction there, after deploying subgraph proceed to step 5.
<br/><br/>

## 5. Deploy front-end repo at [exchange.archerswap.finance](https://exchange.archerswap.finance)
After updating and deploying all parts of the archerswap ecosystem, rightnow comes the last part which is updating front-end repo and deploying it.

First we need to update contracts addresses in different parts of the repo:
<br/>

### 5.1. Update contracts addresses in contracts.ts
Go to ``` src/config/constants/contracts.ts ``` and update the following addresses:
- masterChef [at 1116 chainID]
- No need to redeploy the multicall contract so leave it as it is.
<br/>

### 5.2. Update BOW address in tokens.ts
Go to ``` src/config/constants/tokens.ts ``` and update the following token address:
- BOW [at 1116 chainID]
<br/>

### 5.3. Update Pools in pools.ts
Go to ``` src/config/constants/pools.ts ``` and update the following pools addresses:
- BOW Pool [at 1116 chainID]
- BOW Pool [at 1116 chainID]
<br/>

### 5.3. Update Farms in farms.ts
Go to ``` src/config/constants/farms.ts ``` and update the each farm with its corresponding contract address addresses, update each lp with its ArcherswapPair contract address at chainID 1116.
<br/>

### 5.4. Update Subgraph link
Go to ``` src/apollo/client.js ``` and update the uri link to match the link of the newly deployed subgraph like this:
```
uri: 'https://api.thegraph.com/subgraphs/name/nas-pang/pancakeswap' --> uri: 'https://api.thegraph.com/subgraphs/name/username/subgraph-name'
```
<br/>

### 5.5. Build project and Deploy
After you finished all necessary modifications, go to project root. Run these commands to build.
``` 
yarn 
yarn build
```

After building completion, you will have a deployable build folder at the root called ``` build ```..
<br/>







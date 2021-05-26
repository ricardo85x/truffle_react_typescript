# README.md

### Template project with a working Dapp using truffle and React with typescript

### setup

1 - install global dependencies with yarn(npm)

```bash
cd truffle_react_typescript
yarn add global @truffle/hdwallet-provider dotenv
```

2 - install dapp dependencies

 

```bash
cd client
yarn
```

3 - deploy sample contract on dev network

```bash
cd ..
truffle dev
> migrate
```

- make sure truffle is your PATH
- this comand will create the client/src/contracts files
- the dapp need this files to run properly

4 - run the dapp

```bash
# open a new terminal
cd client
yarn start
```

5 - test the app on http://127.0.0.1:3000

### files to edit

- create new contract files on **contract** folder
- add it on **migration**/**2_deploy_contracts**.**js**
- There are only two dapps file to edit:
- client/src/lib/getWeb3.ts - This file is used to detect the metamask
- client/src/App.tsx - This is the main dapp file, edit it to your needs

This project was inspired on **truffle unbox react,** but with updated solidity and using typescript.
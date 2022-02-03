const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 =  require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    'fire congress empty grit travel priority mansion blind purpose power symbol scan',
    'https://rinkeby.infura.io/v3/b68bb37ddec846d684208b2d779f7a02'

);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log ('Deploying from account', accounts[0]);

    const result = await  new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();

//0xaB097D0D508142Bef0FaDac5424468B765794605 // deployed to addresscd
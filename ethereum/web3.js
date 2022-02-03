import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // Running in browser and metamask
  web3 = new Web3 (window.web3.currentProvider);
} else {
  // Running in Next / Node, or user is not running Metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/b68bb37ddec846d684208b2d779f7a02'
  );
  web3 = new Web3(provider);
}

export default web3;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; // Ganache account list
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // Get the list of unlocked accounts
  accounts = await web3.eth.getAccounts();

  // Use an account to deploy the factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 1000000 });

  factory.setProvider(provider);

  // Use the factory to deploy a campaign contract with 100 wei minimum
  await factory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: 1000000 }); //accounts[0] is the manager

  // Retrieve the deployed campaign
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //takes first element from array and assign to campaignAddress
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaign', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it('marks caller as manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });
  it('allows contributions and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 100
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });
  it('requires minimum contributions', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: 99 // Not enough
      });

      assert(false);
    } catch (err) {
      assert.equal(err.name, 'c');
    }
    });
    it('allows a manager to make a payment request', async () => {
        await campaign.methods
          .createRequest('Buy Batteries', 100000, accounts[2])
          .send({
            from: accounts[0],
            gas: 1000000
          });
    
        const request = await campaign.methods.requests(0).call();
    
        assert.equal(request.description, 'Buy Batteries');
        assert.equal(request.value, 100000);
        assert.equal(request.recipient, accounts[2]);
        assert(!request.complete);
        assert.equal(request.approvalCount, 0);
      });
      it('processes requests', async () => {
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei('10', 'ether') // Plenty!
        });
        await campaign.methods
      .createRequest('Buy Batteries', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: 1000000
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: 1000000
    });

    await campaign.methods.finaliseRequest(0).send({
      from: accounts[0],
      gas: 1000000
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log(balance);

    assert(balance > 104);
        });
}); 

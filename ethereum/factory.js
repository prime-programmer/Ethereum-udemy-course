import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const address = '0xb6C032f5722b734052F2A7262A7A6CBE4260bC34';
const factory = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  address
);



export default factory;
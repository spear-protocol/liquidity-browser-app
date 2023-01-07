const HUB_CONTRACT_ADDRESS = "0xe263C67c412A374Ea24eC7075C3DdbdC89b1e381";
const HUB_API_URL = "http://localhost/";
const RPC_URL = "http://192.168.86.33:7545";
/* const HUB_CONTRACT_ADDRESS = "0x799FdefFcf058Da88E2e0bC8ce19412872E3e8D8";
const HUB_API_URL = "http://tartarus.spear.technology/";
const RPC_URL = "http://tartarus.spear.technology:7545/"; */


const nocust = getNocust();
const web3 = new Web3();

//const wallets = web3.eth.accounts.wallet.create(2);

//const BOB_PUB = "0x5A62cA211e892C41a91a520821D5020347DCA1a3";
//const BOB_PRIV = "b4d0f75abd00dde4d05520a6c688c53fc02160fd7f8c95df72df08a180b23f63";

const BOB_PUB = "0xE075CAdAa054aeF4F02C94a91979ED0ECf45b3A8";
const BOB_PRIV = "2dad0c5bf3cd0d5757f9e1d4e4e7c1057c39f8f7675ff9a5c2feceaa351af6b9"

const ALICE_PUB = "0xB73959A8D3F49195E5bCca3586B4BFB92487D804";
const ALICE_PRIV = "942202df9bcfa355cb68a947e625eaaf42bc51c07ba303099195a4b32146d8d4";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
    await nocust.init({
        contractAddress: HUB_CONTRACT_ADDRESS,
        operatorUrl: HUB_API_URL,
        rpcUrl: RPC_URL
    });
}

init();

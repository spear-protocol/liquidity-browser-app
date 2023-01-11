const HUB_CONTRACT_ADDRESS = "0xe263C67c412A374Ea24eC7075C3DdbdC89b1e381";
const HUB_API_URL = "http://tartarus.spear.technology/";
const RPC_URL = "http://tartarus.spear.technology:7545/";
const AUSD_ADDRESS = "0x549BD80b7666e689b8f28FD554a66dC382E2388F";

const nocust = getNocust();
const web3 = new Web3();
const gasPriceVal = 20;

var FROM_PUB = "";
var TO_PUB = "";

const DEFAULT_PUB = "0x5A62cA211e892C41a91a520821D5020347DCA1a3";
const DEFAULT_PRIV = "b4d0f75abd00dde4d05520a6c688c53fc02160fd7f8c95df72df08a180b23f63";

//const DEFAULT_PUB = "0xE075CAdAa054aeF4F02C94a91979ED0ECf45b3A8";
//const DEFAULT_PRIV  = "2dad0c5bf3cd0d5757f9e1d4e4e7c1057c39f8f7675ff9a5c2feceaa351af6b9"

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

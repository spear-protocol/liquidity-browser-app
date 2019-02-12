$(document).ready(function(){
  console.log("hello bob with address: " + BOB_PUB);

  $("#bob-address").text(BOB_PUB);
  
  // Specify to which commit-chain we want to connect
  const lqdManagerB = new LQDManager({
    rpcApi: web3,
    hubApiUrl: HUB_API_URL,
    contractAddress: HUB_CONTRACT_ADDRESS,
  });

  function callBack (transfer) {
      console.log(transfer)
      console.log("Bob is receiving a transfer of " + transfer.amount + " wei from " + transfer.wallet.address);
      $("#send-button").prop('disabled', false);
      $("#send-button").text('Send To Alice');
      $("#bob-alert").text("Bob is receiving a transfer of " + transfer.amount + " wei from " + transfer.wallet.address + " with tx id " + transfer.id);
      $("#bob-alert").removeClass("d-none");
      $("#get-money-button").prop('disabled', false);
  }

  const getMoney = () => {
    $("#send-button").prop('disabled', true);
    $("#send-button").text('Receiving...');
    $("#get-money-button").prop('disabled', true);

    const Http = new XMLHttpRequest();
    const url="https://faucet.liquidity.network/" + BOB_PUB;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
      console.log(Http.responseText)
    }
  }

  async function register() {
    // Register an address to be used with the LQD manager
    const incomingTransferEventEmitter = await lqdManagerB.register(BOB_PUB);

    // Trigger a log upon an incoming transfer
    incomingTransferEventEmitter.on('IncomingTransfer', callBack)

    console.log("Bob is ready to receive transfers !");
    $("#get-money-button").removeClass("d-none");
  }
  
  const sendToALice = async () => {
    $("#send-button").prop('disabled', true);
    $("#send-button").text('⌛ Sending...');
    $("#get-money-button").prop('disabled', true);

    var val = $("#amount").val() || 0;
    val = parseInt(val);
    console.log(val);
    
    // Send fETH on the commit-chain to Alice  
    const txId = await lqdManagerB.postTransfer({
        to: ALICE_PUB,
        // 0.00 fEther in Wei as BigNumber. 
        amount: val,
        from: BOB_PUB,
     });
  
    console.log("Transfer to Alice sent ! Transaction ID: ", txId);
  }

  register();

  window.sendToALice = sendToALice;
  window.getMoney = getMoney;
  
});





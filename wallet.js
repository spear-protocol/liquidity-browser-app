$(document).ready(function () {
  $("#account-address").text('Account: ' + DEFAULT_PUB);

  var offChainBalance = 0;
  var isRegistered = false;

  async function getOffChainBalance() {
    if (FROM_PUB == "") {
      FROM_PUB = DEFAULT_PUB;
    }
    offChainBalance = await nocust.getBalance(FROM_PUB, AUSD_ADDRESS);
    $("#account-off-chain-balance").text('Off-chain Balance: ' + web3.utils.fromWei(offChainBalance.toString()) + ' AUSD');
  }

  async function callBack(transfer) {
    console.log(transfer)
    console.log("You are receiving a transfer of " + web3.utils.fromWei(transfer.amount.toString(),'ether') + " AUSD from " + transfer.wallet.address);
    $("#send-button").prop('disabled', false);
    $("#send-button").text('💸 Send');
    $("#account-alert").text("You are receiving a transfer of " + web3.utils.fromWei(transfer.amount.toString(),'ether') + " AUSD from " + transfer.wallet.address + " with tx id " + transfer.id);
    $("#account-alert").removeClass("d-none");
    $("#account-off-chain-balance").text('Off-chain Balance: ...updating...');
    await sleep(10000);
    getOffChainBalance();
  }

  function clearAlert() {
    $("#account-alert").removeClass("d-none");
  }

  async function initializeAccount() {
    // Initialize address to be used with the Nocust manager
    try {
      nocust.addPrivateKey(DEFAULT_PRIV);
      console.log("Added default private key");
      isRegistered = await nocust.isWalletRegistered(DEFAULT_PUB);
      if (isRegistered !== true) {
        await nocust.registerWallet(DEFAULT_PUB);
        console.log("Registered Default Account");
      }
      FROM_PUB = DEFAULT_PUB

      $("#send-button").prop('disabled', false);
      $("#send-button").text('💸 Send');
      $("#register-button").prop('disabled', false);
      $("#register-button").text('🙋‍♂️ Register');

      console.log("Default Account is ready to receive transfers !");
    }
    catch (err) {
      if (err.message.includes("timeout")) {
        console.log("Restarting registration due to timeout");
        register();
      }
    }
  }

  const registerAccount = async () => {

    var NEW_PRIV = $("#private-key").val()
    if (NEW_PRIV.substring(0,1) !== "0x") {
      NEW_PRIV = "0x" + NEW_PRIV;
    }
    
    let newAccount = web3.eth.accounts.privateKeyToAccount(NEW_PRIV);
    var NEW_PUB = newAccount.address;

    // Register an address to be used with the Nocust manager
    try {
      nocust.addPrivateKey(NEW_PRIV);
      console.log("Added private key for new account");
      isRegistered = await nocust.isWalletRegistered(NEW_PUB, AUSD_ADDRESS);
      if (isRegistered !== true) {
        await nocust.registerWallet(NEW_PUB, AUSD_ADDRESS);
      } 
      console.log("Registered");
      FROM_PUB = NEW_PUB

      nocust.subscribe({
        address: FROM_PUB,
        event: 'TRANSFER_CONFIRMATION',
        callback: callBack,
        token: AUSD_ADDRESS
      });
      console.log("Subscribed New Account");

      $("#account-address").text('Account: ' + FROM_PUB);
      getOffChainBalance();

      let onChainBalance = await nocust.getParentChainBalance(FROM_PUB, AUSD_ADDRESS);
      if (onChainBalance >= 100000000000000000000) {
        $("#account-on-chain-balance").text('On-chain Balance: ' + onChainBalance + ' AUSD');
      } else {
        $("#account-on-chain-balance").text('On-chain Balance: ' + web3.utils.fromWei(onChainBalance.toString()) + ' AUSD');
      }

      $("#account-alert").text("New Account Registered");
      $("#account-alert").removeClass("d-none");
    }
    catch (err) {
      if (err.message.includes("timeout")) {
        console.log("Restarting registration due to timeout");
        register();
      }
    }
  }

  const offChainTransfer = async () => {
    $("#account-alert").addClass("d-none");

    var val = $("#send-amount").val() || 0;
    offChainBalance = await nocust.getBalance(FROM_PUB, AUSD_ADDRESS);
    var ausd = web3.utils.fromWei(offChainBalance.toString());

    if (Number(val) > Number(ausd)) {
      $("#account-alert").text("😭 Insufficient Funds!!");
      $("#account-alert").removeClass("d-none");
      return;
    }

    TO_PUB = $("#to-address").val()

    $("#send-button").prop('disabled', true);
    $("#send-button").text('⌛ Sending...');

    // transfer on the commit-chain  
    const tx = await nocust.transfer({
      from: FROM_PUB,
      to: TO_PUB,
      amount: web3.utils.toWei(val.toString(),'ether'),
      token: AUSD_ADDRESS
    });

    console.log("Transfer sent ! Transaction ID: ", tx.txId);

    $("#send-button").text('💸 Send');
    $("#send-button").prop('disabled', false);
    alert(`'Transfer sent! Transaction ID: ${tx.txId}`)

    $("#account-off-chain-balance").text('Off-chain Balance: ...updating...');
    await sleep(10000);
    getOffChainBalance();
  }
  
  initializeAccount();
  getOffChainBalance();

  window.offChainTransfer = offChainTransfer;
  window.registerAccount = registerAccount;
  window.clearAlert =   clearAlert;
});





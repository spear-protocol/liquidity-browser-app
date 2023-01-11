$(document).ready(function () {
  $("#contract-address").text('Contract: ' + HUB_CONTRACT_ADDRESS);
  
  var onChainBalance = 0;

  $("#deposit-button").prop('disabled', false);
  $("#deposit-button").text('⬆️ Deposit');
  $("#withdraw-button").prop('disabled', false);
  $("#withdraw-button").text('⬇️ Withdraw');
  
  async function getOnChainBalance() {
    if (FROM_PUB == "") {
      FROM_PUB = DEFAULT_PUB;
    }
    onChainBalance = await nocust.getParentChainBalance(FROM_PUB, AUSD_ADDRESS);
    if (onChainBalance >= 100000000000000000000) {
      $("#account-on-chain-balance").text('On-chain Balance: ' + onChainBalance + ' AUSD');
    } else {
      $("#account-on-chain-balance").text('On-chain Balance: ' + web3.utils.fromWei(onChainBalance.toString()) + ' AUSD');
    }
  }

  const enableDeposit = async () => {
    try {
      const approvalPromise = await nocust.approveDeposits({
        address: FROM_PUB,
        gasPrice: web3.utils.toWei(gasPriceVal.toString(),'gwei'),
        token: AUSD_ADDRESS,
        gasLimit: 150000
      });

      console.log('Approve deposit successful! Transaction ID: ', approvalPromise);
    }catch (err) {
      if (err.message.includes("timeout")) {
        console.log("Error approving deposits for this account");
      }
    }

  }

  const deposit = async () => {
    $("#bridge-alert").text("Deposit may fail if On-chain ETH is insufficient");
    $("#bridge-alert").removeClass("d-none");

    var val = $("#deposit-amount").val() || 0;

    if (Number(val) > Number(onChainBalance)) {
      $("#account-alert").text("😭 Insufficient On-chain Funds!!");
      $("#account-alert").removeClass("d-none");
      return;
    }

    if (FROM_PUB == "") {
      FROM_PUB = DEFAULT_PUB;
    }

    $("#deposit-button").prop('disabled', true);
    $("#deposit-button").text('⌛ Depositing...');

    enableDeposit();
    await sleep(10000);

    // deposit to the commit-chain  
    const tx = await nocust.deposit({
      address: FROM_PUB,
      amount: web3.utils.toWei(val.toString(),'ether'),
      gasPrice: web3.utils.toWei(gasPriceVal.toString(),'gwei'),
      token: AUSD_ADDRESS
    });

    console.log("Deposit successful! Transaction ID: ", tx.txId);

    $("#deposit-button").prop('disabled', false);
    $("#deposit-button").text('⬆️ Deposit');
    alert(`'Deposit successful! Transaction ID: ${tx.txId}`)

    $("#account-off-chain-balance").text('Off-chain Balance: ...updating...');
    $("#account-on-chain-balance").text('On-chain Balance: ...updating...');
    await sleep(10000);
    offChainBalance = await nocust.getBalance(FROM_PUB, AUSD_ADDRESS);
    $("#account-off-chain-balance").text('Off-chain Balance: ' + web3.utils.fromWei(offChainBalance.toString()) + " AUSD");
    getOnChainBalance();
  }

  const withdraw = async () => {
    $("#bridge-alert").text("Withdrawal will be confirmed on the next Eon");
    $("#bridge-alert").removeClass("d-none");

    var val = $("#withdraw-amount").val() || 0; 
    var balance = await nocust.getBalance(FROM_PUB, AUSD_ADDRESS);
    balance = web3.utils.fromWei(balance.toString())

    if (Number(val) > Number(balance)) {
      $("#bridge-alert").text("😭 Insufficient Funds!!");
      $("#bridge-alert").removeClass("d-none");
      return;
    }

    TO_PUB = $("#withdraw-address").val() || 0;

    if (FROM_PUB == "") {
      FROM_PUB = DEFAULT_PUB;
    }

    if (TO_PUB == "0x") {
      TO_PUB = FROM_PUB;
    }

    $("#withdraw-button").prop('disabled', true);
    $("#withdraw-button").text('⌛ Withdrawing...');

    // withdraw on the commit-chain
    const tx1 = await nocust.withdraw({
      address: TO_PUB,
      amount: web3.utils.toWei(val.toString(),'ether'),
      gasPrice: web3.utils.toWei(gasPriceVal.toString(),'gwei'),
      token: AUSD_ADDRESS
    });

    console.log("Withdraw requested ! Transaction ID: ", tx1.txId);

    $("#withdraw-button").prop('disabled', false);
    $("#withdraw-button").text('⬇️ Withdraw');
    alert(`'Withdraw successful! Transaction ID: ${tx1.txId}`)
  }

  getOnChainBalance();

  window.deposit = deposit;
  window.withdraw = withdraw;
});
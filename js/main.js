url = new URL(window.location.href);
let server = undefined;
let counter = 0;
let transactionsCounter=0;
let addedNotice = false;

if (url.searchParams.get('test')) {
	console.log('Using Test Network!')
	network = "testnet"
	server = new stellar.Server('https://horizon-testnet.stellar.org');
} else {
	network = "public"
	server = new stellar.Server('https://horizon.stellar.org');
}

var txHandler = function (txResponse) {
	const fee = txResponse['fee_charged']
	const id = txResponse['id']
	const url = network == "public" ? `https://stellar.expert/explorer/public/tx/${id}` : `https://stellar.expert/explorer/testnet/tx/${id}`
	const operationCount = txResponse['operation_count'];
    console.log(txResponse);	
    console.log(fee);	
    counter+= fee / 10e6;
    transactionsCounter++;
    document.querySelector("#fee-count").innerText = counter;
    document.querySelector("#transactions-count").innerText = transactionsCounter;
    document.querySelector('.transaction-cards').insertAdjacentHTML('afterbegin',`
    <div class="row">
    <div class="col">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Transaction: ${id} </span>
          <p>Source Account: ${txResponse['source_account']}</p>
          <p>Operation Count: ${operationCount} ${operationCount == 1 ? "Operation" : "Operations"}</p>
          <p>Fee: ${fee} stroops</p>
        </div>
        <div class="card-action">
          <a href="${url}">Open in Stellar Expert</a>
        </div>
      </div>
    </div>
  </div>`)

  if(transactionsCounter > 500){
  	let card = document.querySelector('.row:last-child')
  	document.querySelector('.transaction-cards').removeChild(card)
  	if(!addedNotice){ 
  		addedNotice = true
  		document.querySelector('.transaction-cards').insertAdjacentHTML('afterend', '<p>The website has a limit of showing 500 transactions...</p>')
  	} 
  }
  

};

server.transactions().stream({
    onmessage: txHandler
})

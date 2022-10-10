const buttonCalculate = document.getElementById('btnCalc');
const buttonBallance = document.getElementById('btnBall')
const input = document.getElementById('input');
const contentContainer = document.getElementById('info');
const nftInfoContainer = document.getElementById('nft')


buttonCalculate.addEventListener('click', () => {calculate(input.value)});
buttonBallance.addEventListener('click', () => {showBallance(input.value)});

async function calculate (address) {
  const regex = /^[\w]{42}$/i;
  if (regex.test(address)) {
    input.classList.remove('invalid')
    input.classList.add('valid')
    const jsonData = await fetch("https://mintium.space/api/usersTortugaFarm.json");
    const data = await jsonData.json();
    contentContainer.innerText = `Your bonuses are:\nDAIQUIRI: ${data.DAIQUIRI[address] ? data.DAIQUIRI[address].toFixed(4) : 0 }\nAAPLQQX: ${data.AAPLQQX[address] ? data.AAPLQQX[address].toFixed(4) : 0}\nBARREL: ${data.BARREL[address] ? data.BARREL[address].toFixed(4) : 0}\nYELLOW: ${data.YELLOW[address] ? data.YELLOW[address].toFixed(4) :0}\nMICROB: ${data.MICROB[address] ? data.MICROB[address].toFixed(4) :0}`
    nftInfoContainer.innerText = '';
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');
    contentContainer.innerText = 'You entered invalid wallet address';
    nftInfoContainer.innerText = '';
  }
} 

async function showBallance (address) {
  const regex = /^[\w]{42}$/i;
  if (regex.test(address)) {
    input.classList.remove('invalid')
    input.classList.add('valid')
    const ballancePromise = await fetch(`https://explorer-api.minter.network/api/v2/addresses/${address}`)
    const ballanceData = await ballancePromise.json();
    const nftOwnersPromise = await fetch('https://mintium.space/api/nftOwners.json');
    const nftOwners = await nftOwnersPromise.json();
    let nftArray = [];
    for (key in nftOwners) {
      if (nftOwners[key] === address) {
        nftArray.push(key);
      }
    }
    let result = nftArray.map(getNFTBallance)
    Promise.all(result)
    .then((values) => {
      let nftTotal = 0;
      values.forEach((value) => nftTotal += +value);
      return nftTotal
    })
    .then((nftTotal) => nftInfoContainer.innerText = `Total ballance of all NFT's: \n${nftTotal ? nftTotal.toFixed(4) : 0 } Tortuga`)
    const ballanceArray = [...ballanceData.data.balances].filter((element) => element.coin.id === 3673);
    contentContainer.innerText = `Current Tortuga ballance: ${ballanceArray.length > 0 ? Number(ballanceArray[0].amount).toFixed(4) : 0}\nYou have ${nftArray.length} NFT's linked to your wallet`
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');
    contentContainer.innerText = 'You entered invalid wallet address';
  }
}

async function getNFTBallance (address) {
  let nftTotal;
  const nftBallancePromise = await fetch(`https://explorer-api.minter.network/api/v2/addresses/${address}`);
  const nftBallance = await nftBallancePromise.json();
  const ballanceArray = [...nftBallance.data.balances].filter((element) => element.coin.id === 3673);
  return nftTotal = Number(ballanceArray[0].amount)
}
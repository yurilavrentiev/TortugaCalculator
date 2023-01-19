const buttonCalculate = document.getElementById("btnCalc");
const buttonBallance = document.getElementById("btnBall");
const input = document.getElementById("input");
const contentContainer = document.getElementById("info");
const nftInfoContainer = document.getElementById("nft");

buttonCalculate.addEventListener("click", () => {
  calculate(input.value);
});
buttonBallance.addEventListener("click", () => {
  showBallance(input.value);
});

async function calculate(address) {
  const regex = /^[\w]{42}$/i;
  if (regex.test(address)) {
    input.className = "valid";
    const data = await fetch(
      "https://api2.quota.team/data/bonusFriday.json"
    ).then((responce) => responce.json());

    contentContainer.innerText = `Your bonuses are:\nDAIQUIRI: ${
      data.DAIQUIRI[address] ? data.DAIQUIRI[address].toFixed(4) : 0
    }\nAAPLQQX: ${
      data.AAPLQQX[address] ? data.AAPLQQX[address].toFixed(4) : 0
    }\nBARREL: ${
      data.BARREL[address] ? data.BARREL[address].toFixed(4) : 0
    }\nYELLOW: ${
      data.YELLOW[address] ? data.YELLOW[address].toFixed(4) : 0
    }\nMICROB: ${
      data.MICROB[address] ? data.MICROB[address].toFixed(4) : 0
    }\nISLAND: ${
      data.ISLAND[address] ? data.ISLAND[address].toFixed(4) : 0
    }\nUBERQQX: ${
      data.UBERQQX[address] ? data.UBERQQX[address].toFixed(4) : 0
    }\nNTDOYQX: ${
      data.NTDOYQX[address] ? data.NTDOYQX[address].toFixed(4) : 0
    }\nBIGMAC: ${
      data.BIGMAC[address] ? data.BIGMAC[address].toFixed(4) : 0
    }\nQUOTA: ${
      data.QUOTA[address] ? data.QUOTA[address].toFixed(4) : 0
    }\nOBSIDIAN: ${
      data.OBSIDIAN[address] ? data.OBSIDIAN[address].toFixed(4) : 0
    }\nSAPPHIRE: ${
      data.SAPPHIRE[address] ? data.SAPPHIRE[address].toFixed(4) : 0
    }`;

    nftInfoContainer.innerText = "";
  } else {
    input.className = "invalid";
    contentContainer.innerText = "You entered invalid wallet address";
    nftInfoContainer.innerText = "";
  }
}

async function showBallance(address) {
  const regex = /^[\w]{42}$/i;
  if (regex.test(address)) {
    input.className = "valid";
    const ballanceData = await fetch(
      `https://explorer-api.minter.network/api/v2/addresses/${address}`
    ).then((responce) => responce.json());
    const nftOwners = await fetch(
      "https://api2.quota.team/data/nftOwners.json"
    ).then((responce) => responce.json());
    const totalWalletBallance = await fetch(
      "https://api2.quota.team/data/coins/TORTUGA.json"
    ).then((responce) => responce.json());
    let nftArray = [];
    for (key in nftOwners) {
      if (nftOwners[key] === address) {
        nftArray.push(key);
      }
    }
    let result = nftArray.map(getNFTBallance);
    Promise.all(result)
      .then((values) => {
        let nftTotal = 0;
        values.forEach((value) => (nftTotal += +value));
        return nftTotal;
      })
      .then(
        (nftTotal) =>
          (nftInfoContainer.innerText = `Total ballance of all NFT's: \n${
            nftTotal ? nftTotal.toFixed(4) : 0
          } Tortuga`)
      );
    const ballanceArray = [...ballanceData.data.balances].filter(
      (element) => element.coin.id === 3673
    );
    contentContainer.innerText = `Current Tortuga ballance: ${
      totalWalletBallance[address] ? totalWalletBallance[address].toFixed(4) : 0
    }\nYou have ${nftArray.length} NFT's linked to your wallet`;
  } else {
    input.className = "invalid";
    contentContainer.innerText = "Please, enter a valid wallet address";
    nftInfoContainer.innerText = "";
  }
}

async function getNFTBallance(address) {
  let nftTotal;
  const nftBallance = await fetch(
    `https://explorer-api.minter.network/api/v2/addresses/${address}`
  ).then((response) => response.json());
  const ballanceArray = [...nftBallance.data.balances].filter(
    (element) => element.coin.id === 3673
  );
  return (nftTotal = Number(ballanceArray[0].amount));
}

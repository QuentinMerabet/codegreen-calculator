import { useState, useEffect, useId } from "react";
import { fetchJSON } from "../utils/fetchJSON";
import { buildApiUrl } from "../utils/buildApiUrl";
import Image from "next/image";

export default function FormAddress(props) {
  const [address, setAddress] = useState("");
  const [calculation, setCalculation] = useState();
  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const [currentResult, setCurrentResult] = useState();
  const [totalResult, setTotalResult] = useState();

  const id = useId();
  const apiKey = "X2BBEZYNQQCBH7QM1PZ69EFRSGUE3SQBZ6";
  const maxApiResult = 10_000;

  const KgCo2PerGas = 0.0001809589427;

  async function submitAddress(event) {
    setIsFetching(true);
    event.preventDefault(); // Prevent refresh

    let txPages = []; // Storing results in pages in case their is more than maxApiResult
    let txList = {}; // Current tx list returned by API
    let totalTxCount = 0; // Total number of tx received

    // Fetching Etherscan
    let apiResult = await fetchJSON(buildApiUrl(address), 99999999);
    txList = apiResult.result;
    txPages.push(txList);

    let lowestBlock;
    while (txList.length == maxApiResult) {
      lowestBlock = txList[txList.length - 1].blockNumber;
      let currentPage = txPages.length + 1;
      console.log("there's more! Fetching page", currentPage);
      apiResult = await fetchJSON(buildApiUrl(address, lowestBlock));

      txList = apiResult.result;
      console.log("taille dernier retour:", txList.length);
      console.log("dernier element:", txList[txList.length - 1].gasUsed);
      txPages.push(txList);
    }

    // Counting total gas used
    let totalGasUsed = 0;
    for (let page = 0; page < txPages.length; page++) {
      for (let i = 0; i < txPages[page].length; i++) {
        totalGasUsed += parseInt(txPages[page][i].gasUsed);
        totalTxCount++;
      }
    }
    setCalculation(
      `Pages: ${
        txPages.length
      } / Total TX Count: ${totalTxCount} / Total gas used: ${totalGasUsed} Gwei / Total Kg CO2: ${Math.round(
        totalGasUsed * KgCo2PerGas
      )}`
    );
    setIsFetching(false);
  }

  if (isFetching) {
    return (
      <>
        <p>Loading...</p>
        <Image src="/img/loader.gif" alt="loading" height={200} width={200} />
      </>
    );
  } else {
    return (
      <>
        <form onSubmit={(event) => submitAddress(event)}>
          <label>Ethereum Address</label>
          <br />
          <input
            value={address}
            onInput={(e) => setAddress(e.target.value)}
            type="text"
            name="address"
            id={id}
            pattern="^0x[a-fA-F0-9]{40}$"
            required
          />
          <br />
          <button type="submit">Let's go</button>
          {error ? <span className="error">{error}</span> : ""}
        </form>
        {calculation ? <p>{calculation}</p> : <p>No data yet</p>}
      </>
    );
  }
}

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
  const maxApiResult = 10_000;

  const KgCo2PerGasOld = 0.0001809589427;
  const KgCo2PerGasNew = 0.00031923;
  const KwhPerGasNew = 0.00054615;

  async function submitAddress(event) {
    setIsFetching(true);
    let startingTime = Date.now();
    event.preventDefault(); // Prevent refresh

    // Init
    let txPages = []; // Storing results in pages in case their is more than maxApiResult
    let txList = {}; // Current tx list returned by API
    let totalTxCount = 0; // Total number of tx received
    let lowestBlock;
    let done = false;

    // Fetching Etherscan API loop
    while (!done) {
      // Keeping track of the request id
      let currentPage = txPages.length + 1;
      console.log(
        "Request number",
        currentPage,
        "TxList length",
        txList.length
      );
      // Fetching
      let apiResult = await fetchJSON(
        buildApiUrl("txlist", address, lowestBlock)
      );
      // Error handling
      if (
        (apiResult.status === "0" &&
          apiResult.message === "No transactions found") ||
        apiResult.status !== "1"
      ) {
        console.log(apiResult.message);
        setError(apiResult.message);
        setIsFetching(false);
        done = true;
        return;
      }

      // If not the last page/request
      if (apiResult.result.length == maxApiResult) {
        done = false;
        // Updating the lowest block fetched based on the direct API result
        lowestBlock = apiResult.result[apiResult.result.length - 1].blockNumber;
        // Filter out the last block received as we don't know if its complete (no more cloned tx fix)
        txList = apiResult.result.filter(
          (txs) => txs.blockNumber > lowestBlock
        );
      } else {
        // Not filtering results as it's the last page and we have the garanty to have every data fitting in the request's response.
        txList = apiResult.result;
        done = true;
      }
      // Storing the transactions list in an array (one row per request to the API)
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

    // Printing the data
    setCalculation(
      `Total API Request: ${
        txPages.length
      } / Total TX Count: ${totalTxCount} / Total gas used: ${totalGasUsed} Gwei / Total KgCO2 (Carbon.fyi algo): ${Math.round(
        totalGasUsed * KgCo2PerGasOld
      )} / Total KgCO2 (C-Level algo): ${Math.round(
        totalGasUsed * KgCo2PerGasNew
      )} / Total KWH (C-Level algo): ${Math.round(totalGasUsed * KwhPerGasNew)}`
    );
    // Execution time for science!
    let endingTime = Date.now();
    console.log(
      "Execution time:",
      Math.round((endingTime - startingTime) / 1000),
      "seconds"
    );
    setIsFetching(false);
  }

  // Render component
  if (isFetching) {
    return (
      <>
        <p>Loading...</p>
        <Image src="/img/loader.gif" alt="loading" height={250} width={250} />
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
        {calculation ? <p>{calculation}</p> : ""}
      </>
    );
  }
}

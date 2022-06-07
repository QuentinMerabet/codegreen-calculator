import { useState, useEffect, useId } from "react";
import { fetchJSON } from "../utils/fetchJSON";
import { buildApiUrl } from "../utils/buildApiUrl";
import { coolNumber } from "../utils/coolNumber";
import Image from "next/image";

export default function Calculator(props) {
  const [address, setAddress] = useState("");
  const [calculation, setCalculation] = useState([]);
  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Results
  const [resultTx, setResultTx] = useState();
  const [resultTotalGas, setResultTotalGas] = useState();
  const [resultTotalKgCO2, setResultTotalKgCO2] = useState();
  const [contract, setContract] = useState();

  const id = useId();
  const maxApiResult = 10_000;

  // Algo
  const KgCo2PerGas = 0.00031923;
  const KwhPerGas = 0.00054615;

  async function submitAddress(event) {
    event.preventDefault(); // Prevent refresh
    let startingTime = Date.now();

    setIsFetching(true);
    setIsDone(false);

    // Init
    let txPages = []; // Storing results in pages in case their is more than maxApiResult
    let txList = {}; // Current tx list returned by API
    let totalTxCount = 0; // Total number of tx received
    let lowestBlock;
    let done = false;

    // Fetching Etherscan API loop
    while (!done && !error) {
      // Keeping track of the request id
      let currentPage = txPages.length + 1;
      console.log("Request number", currentPage);
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
        console.log("Fetch error: ", apiResult.message);
        setError("Fetch error: " + apiResult.message);
        return;
      }

      // If not the last page/request
      if (apiResult.result.length == maxApiResult) {
        // Updating the lowest block fetched based on the direct API result
        lowestBlock = apiResult.result[apiResult.result.length - 1].blockNumber;
        // Filter out the last block received as we don't know if its complete (no more cloned tx fix)
        txList = apiResult.result.filter(
          (txs) => txs.blockNumber > lowestBlock
        );
        // Storing the transactions list in an array (one row per request to the API)
        txPages.push(txList);
      } else {
        // Not filtering results as it's the last page and we have the garanty to have every data fitting in the request's response.
        txList = apiResult.result;
        // Storing the transactions list in an array (one row per request to the API)
        txPages.push(txList);
        done = true;
      }
    }

    // Counting total gas used
    let totalGasUsed = 0;
    for (let page = 0; page < txPages.length; page++) {
      for (let i = 0; i < txPages[page].length; i++) {
        totalGasUsed += parseInt(txPages[page][i].gasUsed);
        totalTxCount++;
      }
    }

    // Registering data
    setContract(address);
    setResultTx(totalTxCount); // Tx Count
    setResultTotalGas(totalGasUsed); // Total gas used in Gwei
    setResultTotalKgCO2(Math.round(totalGasUsed * KgCo2PerGas));

    // Console data
    // Execution time for science!
    let endingTime = Date.now();
    console.log(
      txPages.length,
      "API request(s) executed in",
      Math.round((endingTime - startingTime) / 1000),
      "seconds."
    );

    // The end!
    setIsFetching(false);
    setIsDone(true);
  }

  // Render component
  if (isFetching) {
    return (
      <div className="my-40 w-full flex flex-col items-center justify-center">
        <div className="loading">
          <Image src="/img/fist.png" alt="loading" height={45} width={45} />
        </div>
        <p>Processing contract's transactions...</p>
      </div>
    );
  } else if (isDone) {
    return (
      <div>
        <div className="text-center mb-5">
          <h2 className="m-0">Calculated Footprint</h2>
          <span className="address">
            <i className="fa-solid fa-check"></i>
            {contract}
          </span>
        </div>
        <div className="flex m-auto p-10 gap-20 box">
          <div className="main-results flex flex-col items-center">
            <i className="fa-light fa-clouds"></i>
            <span className="amount">{coolNumber(resultTotalKgCO2)}</span>
            <span className="element">CO2 Emission</span>
            <span className="unit">Kg</span>
          </div>
          <div className="main-results flex flex-col items-center">
            <i className="fa-light fa-globe"></i>
            <span className="amount">{coolNumber(resultTx)}</span>
            <span className="element">Transactions</span>
            <span className="unit"></span>
          </div>
          <div className="main-results flex flex-col items-center">
            <i className="fa-light fa-fire"></i>
            <span className="amount">{coolNumber(resultTotalGas)}</span>
            <span className="element">Gas Used</span>
            <span className="unit">Gwei</span>
          </div>
        </div>
        <p className="text-center mt-3 mb-12">
          <a href="#" target="_blank">
            How is this calculated?
          </a>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3>What does it mean?</h3>
            <p>
              Discover what the contract’s amount of Carbon emitted is
              equivalent to.
            </p>
            <div className="example box min-w-full p-5 mb-4 flex flex-row items-center gap-3 relative">
              <i className="fa-light fa-plane"></i>
              <div className="flex flex-col items-left">
                <span className="amount">x0</span>
                <span className="element">Paris - NYC flights</span>
              </div>
              <a
                className="source absolute bottom-3 right-4"
                href="#"
                target="_blank"
              >
                Read source
              </a>
            </div>
            <div className="example box min-w-full p-5 mb-4 flex flex-row items-start gap-3 relative">
              <i className="fa-light fa-home"></i>
              <div className="flex flex-col items-left">
                <span className="amount">0</span>
                <span className="element">Electricity of house</span>
              </div>
              <a
                className="source absolute bottom-3 right-4"
                href="#"
                target="_blank"
              >
                Read source
              </a>
            </div>
          </div>
          <div className="box white p-10 min-w-full">
            <h3>
              <i className="fa-solid fa-bee"></i> Offset Now
            </h3>
            <p>
              Please contact our team of expert to find the solution that fits
              you the best.
            </p>
            <a href="#" target="_blank" className="button">
              <i className="fa-regular fa-arrow-right"></i>
              Contact Us
            </a>
            <p className="mb-0">
              You’ll soon be able to directly offset your contract’s carbon
              footprint here.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="">
          <div className="tool-title flex items-center mb-5">
            <i className="fa-solid fa-calculator"></i>
            <h2>
              Carbon Footprint<br></br>Calculator
            </h2>
          </div>
          <p>
            Estimate an Ethereum based Smart Contract impact on the
            environnement, and let us handle the Carbon offset.
          </p>
          <form onSubmit={(event) => submitAddress(event)}>
            <label>Ethereum Contract Address</label>
            <input
              value={address}
              onInput={(e) => setAddress(e.target.value)}
              type="text"
              name="address"
              placeholder="0x12345678901234567890"
              size="22"
              id={id}
              pattern="^0x[a-fA-F0-9]{40}$"
              required
            />
            <button type="submit">
              <i className="fa-regular fa-arrow-right"></i>
            </button>
            {error ? <span className="error">{error}</span> : ""}
          </form>
          <p>
            <a href="#" target="_blank">
              Learn more
            </a>{" "}
            about our method.
            <br />
            Powered with <i className="fa-solid fa-heart"></i> by Heal Labs
          </p>
        </div>
      </>
    );
  }
}

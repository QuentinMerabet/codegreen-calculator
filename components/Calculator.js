import { useState, useEffect, useId } from "react";
import { fetchJSON } from "../utils/fetchJSON";
import { buildApiUrl } from "../utils/buildApiUrl";
import { coolNumber } from "../utils/coolNumber";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

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
  const KgCo2PerGas = 0.0003182308;
  const KwhPerGas = 0.00054615;
  // Comparison
  const KgCo2AbsorbedPerTree = 25;
  const KgCo2PerPassengerForParisNYC = 500; // Source : https://eco-calculateur.dta.aviation-civile.gouv.fr/comment-ca-marche
  const KgCo2PerFlightForParisNYC = 500 * 333;
  const KgPerMileCar = 0.2214; // Source : https://www.nimblefins.co.uk/average-co2-emissions-car-uk
  const KgCo2PerCupOfCoffee = 0.05; // Source :
  const KgCo2PerTShirt = 12; // Source :
  const KgCo2PerBigMac = 2.35; // Source :
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
        reset();
        setError("Error: " + apiResult.message);
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

  function reset() {
    setIsDone(false);
    setError(false);
    setIsFetching(false);
  }

  // Render (new)
  return (
    <AnimatePresence exitBeforeEnter>
      {isFetching && !isDone && (
        <motion.div
          key="loader"
          initial={{ y: "8vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-8vh", opacity: 0 }}
          transition={{ type: "spring", when: "afterChildren", stiffness: 50 }}
        >
          <div className="my-40 w-full flex flex-col items-center justify-center">
            <div className="loading">
              <Image src="/img/fist.png" alt="loading" height={45} width={45} />
            </div>
            <p>Analyzing contract's transactions...</p>
          </div>
        </motion.div>
      )}
      {isDone && !isFetching && (
        <motion.div
          key="results"
          initial={{ y: "8vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-8vh", opacity: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <div className="text-center mb-5">
            <h2 className="m-0">Calculated Footprint</h2>
            <span className="address">
              <i className="fa-solid fa-check"></i>
              {contract}
            </span>
          </div>
          <div className="flex m-auto justify-center p-10 gap-6 md:gap-20 box md:w-min">
            <motion.div
              key="ico1"
              initial={{ y: "20", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              className="main-results flex flex-col items-center"
            >
              <i className="fa-light fa-clouds"></i>
              <span className="amount">{coolNumber(resultTotalKgCO2)}</span>
              <span className="element">CO2 Emission</span>
              <span className="unit">Kg</span>
            </motion.div>
            <motion.div
              key="ico2"
              initial={{ y: "20", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.4 }}
              className="main-results flex flex-col items-center"
            >
              <i className="fa-light fa-globe"></i>
              <span className="amount">{coolNumber(resultTx)}</span>
              <span className="element">Transactions</span>
              <span className="unit"></span>
            </motion.div>
            <motion.div
              key="ico3"
              initial={{ y: "20", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.7 }}
              className="main-results flex flex-col items-center"
            >
              <i className="fa-light fa-fire"></i>
              <span className="amount">{coolNumber(resultTotalGas)}</span>
              <span className="element">Gas Used</span>
              <span className="unit">Gwei</span>
            </motion.div>
          </div>
          <div className="text-center mt-3 mb-12">
            <Link href="/methodology">
              <a>
                <i className="fa-regular fa-circle-question"></i> How is this
                calculated
              </a>
            </Link>{" "}
            |{" "}
            <a onClick={() => reset()}>
              <i className="fa-regular fa-arrow-rotate-right"></i> Try again
            </a>{" "}
            |{" "}
            <Dialog.Root>
              <Dialog.Trigger>
                <a>
                  <i className="fa-regular fa-cloud-arrow-down"></i> See
                  complete report
                </a>
              </Dialog.Trigger>
              <Dialog.Portal>
                <motion.div
                  key="dialog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <Dialog.Content>
                    <Dialog.Close className="close">
                      <i className="fa-solid fa-xmark-large"></i>
                    </Dialog.Close>
                    <Dialog.Title>Full Carbon report</Dialog.Title>
                    <span className="address">{contract}</span>
                    <p>
                      This is a full report with numbers that are not rounded.
                    </p>
                    <ul>
                      <li>
                        <strong>Transactions analyzed</strong>
                        <span className="block number">{resultTx}</span>
                      </li>
                      <li>
                        <strong>Gwei of Gas used</strong>
                        <span className="block number">{resultTotalGas}</span>
                      </li>
                      <li>
                        <strong>Kg of CO2 Emission</strong>
                        <span className="block number">{resultTotalKgCO2}</span>
                      </li>
                    </ul>
                  </Dialog.Content>
                </motion.div>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3>What does this all mean?</h3>
              <p>
                Discover what the contract’s amount of Carbon emitted is
                equivalent to.
              </p>
              <div className="example box justify-center md:justify-start min-w-full p-5 mb-4 flex flex-row items-center gap-3 relative">
                <i className="fa-light fa-plane"></i>
                <div className="flex flex-col items-left">
                  <span className="amount">
                    {coolNumber(
                      resultTotalKgCO2 / KgCo2PerPassengerForParisNYC
                    )}
                  </span>
                  <span className="element">Paris-NYC flights</span>
                </div>
                <a
                  className="source absolute top-3 right-4"
                  href="https://eco-calculateur.dta.aviation-civile.gouv.fr/comment-ca-marche"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-regular fa-circle-info"></i>
                </a>
              </div>
              <div className="example box justify-center md:justify-start min-w-full p-5 mb-4 flex flex-row items-start gap-3 relative">
                <i className="fa-light fa-car"></i>
                <div className="flex flex-col items-left">
                  <span className="amount">
                    {coolNumber(resultTotalKgCO2 / KgPerMileCar)}
                  </span>
                  <span className="element">Miles in a Car</span>
                </div>
                <a
                  className="source absolute top-3 right-4"
                  href="https://www.nimblefins.co.uk/average-co2-emissions-car-uk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-regular fa-circle-info"></i>
                </a>
              </div>
              <div className="example box justify-center md:justify-start min-w-full p-5 mb-4 flex flex-row items-start gap-3 relative">
                <i className="fa-light fa-burger-cheese"></i>
                <div className="flex flex-col items-left">
                  <span className="amount">
                    {coolNumber(resultTotalKgCO2 / KgCo2PerBigMac)}
                  </span>
                  <span className="element">Big Mac</span>
                </div>
                <a
                  className="source absolute top-3 right-4"
                  href="https://clevercarbon.io/carbon-footprint-of-common-items/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-regular fa-circle-info"></i>
                </a>
              </div>
              <div className="example box justify-center md:justify-start min-w-full p-5 mb-4 flex flex-row items-start gap-3 relative">
                <i className="fa-light fa-shirt"></i>
                <div className="flex flex-col items-left">
                  <span className="amount">
                    {coolNumber(resultTotalKgCO2 / KgCo2PerTShirt)}
                  </span>
                  <span className="element">T-Shirt</span>
                </div>
                <a
                  className="source absolute top-3 right-4"
                  href="https://clevercarbon.io/carbon-footprint-of-common-items/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-regular fa-circle-info"></i>
                </a>
              </div>
              <div className="example box justify-center md:justify-start min-w-full p-5 mb-4 flex flex-row items-start gap-3 relative">
                <i className="fa-light fa-mug-hot"></i>
                <div className="flex flex-col items-left">
                  <span className="amount">
                    {coolNumber(resultTotalKgCO2 / KgCo2PerCupOfCoffee)}
                  </span>
                  <span className="element">Cup of coffee</span>
                </div>
                <a
                  className="source absolute top-3 right-4"
                  href="https://clevercarbon.io/carbon-footprint-of-common-items/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-regular fa-circle-info"></i>
                </a>
              </div>
            </div>
            <div className="box white p-10 h-min">
              <h3>
                <i className="fa-solid fa-bee"></i> Offset Now
              </h3>
              <p>
                Don't freak out, we can help! Let's work together to make the
                space more sustainable.
              </p>
              <p>
                Get in touch with our team to find the solution that suits you
                the best.
              </p>

              <a
                href="https://www.codegreen.earth/contact"
                target="_blank"
                rel="noreferrer"
                className="button"
              >
                <i className="fa-regular fa-arrow-right"></i>
                Contact Us
              </a>
              <p className="mb-0">
                You’ll soon be able to directly offset your contract’s carbon
                footprint here.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {!isFetching && !isDone && (
        <motion.div
          key="home"
          initial={{ y: "-8vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-8vh", opacity: 0 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 50 }}
        >
          <div className="tool-title flex items-start mb-5">
            <i className="fa-solid fa-calculator"></i>
            <h2>
              Carbon Footprint<br></br>Calculator
            </h2>
          </div>
          <p>
            Calculate the carbon footprint of an Ethereum contract or wallet
            address.
          </p>
          <form onSubmit={(event) => submitAddress(event)}>
            <label>Ethereum Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            <Link href="/methodology">
              <a>Learn more</a>
            </Link>{" "}
            about our methodology.
            <br />
            Powered with <i className="fa-solid fa-heart"></i> by Heal Labs
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

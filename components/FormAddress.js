import { useState, useEffect, useId } from "react";
import { fetchJSON } from "../utils/fetchJSON";
import { buildApiUrl } from "../utils/buildApiUrl";

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

    // Fetching Etherscan
    let txPages = [];
    let txList = {};
    let totalTxCount = 0;
    let apiResult = await fetchJSON(buildApiUrl(address, 0));
    txList = apiResult.result;
    txPages.push(txList);

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
    console.log("done!", txList);
    console.log(txPages);
    setIsFetching(false);
  }

  if (isFetching) {
    return (
      <>
        <p>Loading...</p>
        <img src="https://c.tenor.com/4Nh-kwo0mSQAAAAC/batman-thinking.gif" />
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

import Link from "next/link";

export default function Methodology() {
  return (
    <main className="m-4 lg:p-20 p-5">
      <Link href="/">
        <a className="block mb-6">
          <i className="fa-regular fa-arrow-left"></i>{" "}
          <span>Go back to Calculator</span>
        </a>
      </Link>
      <h2>The Code Green Methodology</h2>
      <p>
        The Code Green Calculator is taking full advantage of one of the most
        revolutionary innovations introduced by the Blockchain; radical
        transparency.
        <br />
        Everything is public here — each variable, wallet, transaction, and of
        course, every unit of gas consumed.
        <br />
        That’s why our Calculator is so incredibly precise, down to the last
        block.
      </p>
      <p>
        Here’s the formula we use to calculate the carbon footprint of
        transactions :
        <br />
        <span className="number font-bold">
          Total Gas Unit Consumed * $KgCO2 emitted Per Gas Unit = Kg of CO2
          emitted By Contract
        </span>
      </p>
      <h3>Total Gas Unit consumed</h3>
      <p>
        In order to find the total Gwei consumed by a smart contract, we
        retrieve every single transaction that happened on it. For that, we use
        the Etherscan API.
        <br /> When the number of transactions exceeds 1000, we retrieve the
        Etherscan API block per block. That’s why you if you just input a larger
        contract - you may have noticed you had to wait a little longer.
        <br />
        Once we’ve retrieved each and every smart contract transaction, we then
        add every gas unit consumed per transaction. That’s how we finally get
        the Total Gas Unit consumed by the smart contract.
      </p>
      <h3>Kg of CO2 emitted per Gas Unit</h3>
      <p>
        Unlike other calculators, we deliberately chose not to attach an
        estimated Co2/kg figure for each Ethereum transaction because we know it
        is inherently inaccurate. ‘Transactions’ vary wildly in terms of energy
        consumption depending on the type of transaction - for example minting
        an NFT is far more energy consuming than a simple transfer on the
        Ethereum blockchain.
        <br />
        Instead - our calculator automatically measures the overall, real-time
        smart contract footprint based on the kg co2 per unit of gas. This is a
        far more accurate indication of the real smart contract footprint.
        <br />
        Even here - deciding what the kg co2 unit of gas presents yet another
        hurdle because estimations for this vary considerably too. We decided to
        use one of the most pessimistic estimations that puts{" "}
        <strong>0.0003182308 Kg CO2/Gas Unit</strong> based on calculations made
        by{" "}
        <a
          href="https://memoakten.medium.com/analytics-the-unreasonable-ecological-cost-of-cryptoart-72f9066b90d"
          target="_blank"
        >
          Memo Akten
        </a>
        .
      </p>
      <p>
        Like all carbon footprint analysis - this is a best estimate from
        currently available figures. Given there is no precise ‘scientific
        formula’ to calculate this - we would rather err on the side of caution
        to ensure you are mitigating the full impacts of your energy
        consumption.
      </p>
      <h3>What will happen after Ethereum 2.0?</h3>
      <p>
        Ethereum has announced plans for a drastic reduction of the impact of
        its network down by -99%, which is anticipated to start in the summer of
        2022. Once Ethereum merges to a less energy consuming proof of stake
        protocol (known as ‘the Merge’), the calculation of the Kg/CO2 emitted
        per Gas Unit will be very different.
      </p>
      <p>This will allow us to provide an estimation based on:</p>
      <ul>
        {" "}
        <li>
          The old calculation for the transactions that happenned before the
          Block of the Merge.
        </li>{" "}
        <li>
          The new calculation (approximately -99%) for the transactions that
          happened after the Block of the Merge.
        </li>
      </ul>
    </main>
  );
}

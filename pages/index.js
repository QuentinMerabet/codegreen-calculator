import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Calculator from "../components/Calculator";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CODE GREEN - Carbon Footprint Calculator</title>
        <meta
          name="description"
          content="Ethereum Footprint Calculator powered by Heal Labs for Code Green <3"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://images.squarespace-cdn.com/content/v1/616d2a0c699392292ca43696/55568348-4808-4053-9e96-da6a4a4245e8/favicon.ico?format=100w"
        />
      </Head>

      <main className="container mx-auto lg:p-20 p-5">
        <Calculator />
      </main>
      <section></section>
      <footer></footer>
    </div>
  );
}

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Calculator from "../components/Calculator";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CODE GREEN - Calculator</title>
        <meta
          name="description"
          content="Calculator powered by Heal Labs for Code Green <3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="p-5 flex items-center gap-5">
        <a href="https://codegreen.earth/">
          <h1 className="logo flex-shrink-0">Code Green</h1>
        </a>
        <div className="separator flex-none"></div>
        <span className="powered flex-col">Powered by Heal Labs</span>
      </nav>
      <main className="container mx-auto lg:p-20 p-5">
        <Calculator />
      </main>
      <section></section>
      <footer></footer>
    </div>
  );
}

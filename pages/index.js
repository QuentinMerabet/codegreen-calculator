import Head from "next/head";
import Image from "next/image";
import FormAddress from "../components/FormAddress";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CODE GREEN - Calculator</title>
        <meta name="description" content="Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="grid place-content-center h-screen">
          <div className="p-8 rounded-xl bg-white">
            <h1>Calculator</h1>
            <p>This is a demo test for the Code Green Calculator.</p>
            <FormAddress />
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

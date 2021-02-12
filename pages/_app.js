import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  	<div>
  		<Head>
        <link rel="icon" href="/icon.png"/>
      </Head>
  		<div className="stars"></div>
      <div className="twinkling"></div>
  		<Component {...pageProps} />
  	</div>
  );
}

export default MyApp

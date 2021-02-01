import Link from 'next/link'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="container">
        <h1 style={{font:"72px Courier, monospace"}}><b>ARCADE</b></h1>
        <div className={styles.grid}>
          <Link href="/tictactoe">
            <a className={styles.card} style={{fontSize:'24px',fontFamily:'Courier, monospace'}}>Tic-tac-toe</a>
          </Link>
          <Link href="/connectfour">
            <a className={styles.card} style={{fontSize:'24px',fontFamily:'Courier, monospace'}}>Connect Four</a>
          </Link>
          <Link href="/maze">
            <a className={styles.card} style={{fontSize:'24px',fontFamily:'Courier, monospace'}}>Maze</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

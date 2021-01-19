import Link from 'next/link'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="container">
        <h1 style={{fontSize:"72px"}}>Arcade</h1>
        <div className={styles.grid}>
          <Link href="/tictactoe">
            <a className={styles.card} style={{fontSize:'24px'}}>Tic-tac-toe</a>
          </Link>
          <Link href="/connectfour">
            <a className={styles.card} style={{fontSize:'24px'}}>Connect Four</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

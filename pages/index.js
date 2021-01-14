import Link from 'next/link'
import styles from '../styles/home.module.css'

export default function Home() {
  return (
    <div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="container">
        <h1 style={{font:"72px Phosphate"}}>Arcade</h1>
        <div className={styles.grid}>
          <Link href="/tictactoe">
            <a className={styles.card} style={{fontSize:'24px',fontFamily:'Chalkduster, fantasy'}}>Tic-tac-toe</a>
          </Link>
          <Link href="/connectfour">
            <a className={styles.card} style={{fontSize:'24px',fontFamily:'Copperplate, fantasy'}}>Connect Four</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

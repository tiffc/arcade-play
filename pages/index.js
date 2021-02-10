import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/home.module.css'

export default function Home() {
  const [index, setIndex] = useState(0);
  const titles = [<h1 className={styles.headline + ' ' + styles.typewriterA}>arcade</h1>, <h1 className={styles.headline + ' ' + styles.typewriterB}>play</h1>];

  useEffect(() => {
    const id = setInterval(() => setIndex(1 - index), 3750);
    return () => clearInterval(id);
  }, [index]);

  return (
    <div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="container">
        {titles[index]}
        <div className={styles.grid}>
          <Link href="/tictactoe">
            <a className={styles.card} style={{fontSize:'32px',fontFamily: 'Indie Flower, cursive'}}>Tic-tac-toe</a>
          </Link>
          <Link href="/connectfour">
            <a className={styles.card} style={{fontSize:'32px',fontFamily: 'Rajdhani, sans-serif'}}>Connect Four</a>
          </Link>
          <Link href="/maze">
            <a className={styles.card} style={{fontSize:'32px',fontFamily: 'Maven Pro, sans-serif'}}>Maze</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import styles from '../styles/home.module.css'

export default function Home() {
  const router = useRouter();
  const [inProp, setInProp] = useState(true);
  const [index, setIndex] = useState(0);
  const titles = [<h1 className={styles.headline + ' ' + styles.typewriterA}>arcade</h1>, <h1 className={styles.headline + ' ' + styles.typewriterB}>play</h1>];

  useEffect(() => {
    const id = setTimeout(() => setIndex(1 - index), 3750);
    return () => clearTimeout(id);
  }, [index]);

  const exit = (path) => {
    setInProp(false);
    router.prefetch(path);
    setTimeout(() => {router.push(path)}, 500);
  }

  return (
    <div>
      <Head>
        <title>Arcade Play</title>
      </Head>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="page">
        <div className="container">
          {titles[index]}
          <div className={styles.grid}>
            <button className={styles.card} onClick={() => exit('/tictactoe')} style={{fontSize:'32px',fontFamily: 'Indie Flower, cursive'}}>Tic-tac-toe</button>
            <button className={styles.card} onClick={() => exit('/connectfour')} style={{fontSize:'32px',fontFamily: 'Rajdhani, sans-serif'}}>Connect Four</button>
            <button className={styles.card} onClick={() => exit('/maze')} style={{fontSize:'32px',fontFamily: 'Josefin Slab, serif'}}>Maze</button>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="panel-transition">
        <div className="panel"/>
      </CSSTransition>
    </div>
  )
}

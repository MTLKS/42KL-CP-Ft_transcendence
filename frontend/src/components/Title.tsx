import { useState, useEffect } from 'react'
import sleep from '../functions/sleep'


function Title() {
  const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const initTitle: string = 'PONGsh';
  const [title, setTitle] = useState(initTitle);
  const timesBetweenLetters: number = 10;
  const timesBeforeDone: number = 0;
  const msBetweenAnimation: number = 7000;
  const msBetweenSwitch: number = 30;
  let i: number = 0;

  useEffect(animateStart, []);
  return (
    <h1 className='font-bungee text-highlight text-[200px] leading-none'>
      {title}
    </h1>
  )

  function animateStart() {

    const interval = setInterval(animateTitle, msBetweenAnimation);
    return () => clearInterval(interval);
  }

  async function animateTitle() {
    while (i <= initTitle.length * timesBetweenLetters) {
      const tmp = title.split("").map((letter, index) => {
        if (index >= i / timesBetweenLetters) return initTitle[index]
        return letters[Math.floor(Math.random() * 52)];
      }).join("");
      setTitle(tmp);
      i += 1;
      await sleep(msBetweenSwitch);
    }
    i = 0;
    while (i <= timesBeforeDone) {
      const tmp = title.split("").map(() => letters[Math.floor(Math.random() * 52)]).join("");
      setTitle(tmp);
      i += 1;
      await sleep(msBetweenSwitch);
    }
    i = 0;
    while (i <= initTitle.length * timesBetweenLetters) {
      const tmp = title.split("").map((letter, index) => {
        if (index <= i / timesBetweenLetters) return initTitle[index]
        return letters[Math.floor(Math.random() * 52)];
      }).join("");
      setTitle(tmp);
      i += 1;
      await sleep(msBetweenSwitch);
    }
    i = 0;
  }
}

export default Title
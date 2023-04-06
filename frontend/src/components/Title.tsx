import { useState, useEffect } from 'react'
import sleep from '../functions/sleep'


function Title() {
    const letters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const initTitle:string = 'PONGsh';
    const [title, setTitle] = useState(initTitle);
    const timesBetweenLetters:number = 4;
    const timesBeforeDone:number = 20;
    const msBetweenAnimation:number = 5000;
    const msBetweenSwitch:number = 50;
    let i:number = 0;
    

    // animateStart();
    useEffect(animateStart, []);
    return (
        <h1 className='glitch text-9xl tracking-tighter font-medium'>
            <span className=' glitch-child1' aria-hidden="true" >{title}</span>
            {title}
            <span className=' glitch-child2' aria-hidden="true" >{title}</span>
        </h1>
    )

    function animateStart() {
    
        const interval = setInterval(animateTitle, msBetweenAnimation);
        return () => clearInterval(interval);
    }
    
    async function animateTitle() {
        while (i <=initTitle.length * timesBetweenLetters) {
            const tmp = title.split("").map((letter, index) => {
                if(index>=i / timesBetweenLetters)return initTitle[index]
                return letters[Math.floor(Math.random() * 52)];
            }).join("");
            setTitle(tmp);
            i += 1;
            await sleep(msBetweenSwitch);
        }
        i = 0;
        while (i <=timesBeforeDone) {
            const tmp = title.split("").map(() => letters[Math.floor(Math.random() * 52)]).join("");
            setTitle(tmp);
            i += 1;
            await sleep(msBetweenSwitch);
        }
        i = 0;
        while (i <=initTitle.length * timesBetweenLetters) {
            const tmp = title.split("").map((letter, index) => {
                if(index<=i / timesBetweenLetters)return initTitle[index]
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
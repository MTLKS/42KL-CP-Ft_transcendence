import React from 'react'

function Title() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // document.querySelector("h1")?.onmouseover = {(event) => {
    //         event.target.innerText = event.target.innerText.split("")
    //         .map(letter => letters[Math.random()*26] ).join("");
    // }};
    return (
        <h1
            // onMouseOver={(e) => {
            //     let i:number = 0;
            //     console.log(e.currentTarget.innerText);
            //     const interval= setInterval(() => {
            //         document.querySelector('h1')?.innerText =
                    
            //         document.querySelector('h1')?.innerText.split("")
            //                 .map(letter => letters[Math.floor(Math.random() * 26)]).join("");
            //         if(i>= document.querySelector('h1')?.innerText.length) clearInterval(interval);
            //         i += 1;
            //     }, 200);
            // }}
        >Title</h1>
    )
    async function animate() {
    }
}

export default Title
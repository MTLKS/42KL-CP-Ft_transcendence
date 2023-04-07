import React from 'react'
import PromptField from '../PromptField/PromptField'
import SrcollView from '../components/SrcollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'

function Terminal() {
  const [elements, setElements] = React.useState([] as JSX.Element[])
  const [index, setIndex] = React.useState(0);
  function card(index: number) {
    return <Card key={index}>
      <p className='text-gray-300 text-2xl tracking-tighter mb-5 text-center h-15'>This is a card</p>
    </Card>;
  }

  return (
    <div className='h-screen flex flex-col'>
      <SrcollView>
        <p className='text-gray-300 text-2xl tracking-tighter mb-5 text-center h-15'>Welcome to PONGsh</p>
        {elements}
      </SrcollView>
      <PromptField handleCommands={(command) => {
        switch (command) {
          case "login":
            login();
            break;
          case "sudo":
            rickroll();
            break;
          case "ls":
            rickroll();
            break;
          case "add":
            const newCard = card(index);
            const newList = elements.concat(newCard);
            setIndex(index + 1);
            setElements(newList);
            break;
          case "clear":
            setIndex(0);
            setElements([]);
            break;
          default:
            break;
        }
      }} />
    </div>
  )
}

export default Terminal
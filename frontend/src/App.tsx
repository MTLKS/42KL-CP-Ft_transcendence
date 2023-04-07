import PromptField from "./PromptField/PromptField";
import Button from "./components/Buttons";
import Title from "./components/Title";
import "./index.css";

function App() {
  newFunction();
  return (
    <div className='bg-gray-900 h-screen w-screen font-'>
      <Title />
      <PromptField />
    </div>
  )

  function newFunction() {
    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    let code: { code: string | null } = { code: urlParams.get('code') };
    if (code.code !== "null")
      console.log(code);
  }
}

export default App

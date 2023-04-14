import Title from '../components/Title';
import login from '../functions/login';
import PromptField from '../components/PromptField';
import sleep from '../functions/sleep';
import { useEffect, useRef, useState } from 'react';

function LoginBadge() {
  return (
    <div className='mt-[25px] p-3 font-bungee leading-none rounded-3xl h-[150px] w-[160px] border-4 border-highlight flex flex-col items-center'
      style={{ borderWidth: '10px' }}>
      <div className='flex flex-rol mt-1'>
        <div className='text-3xl'>42</div>
        <div className='ml-[0.375rem] mt-[0.375rem] h-[1.5rem] w-16 bg-highlight rounded-sm' />
      </div>
      <div className='flex flex-rol'>
        <div className='mr-[0.375rem] mt-[0.375rem] h-[1.5rem] w-16 bg-highlight rounded-sm' />
        <div className='text-3xl'>ft</div>
      </div>
      <div className='text-xs mt-1'>transcendence</div>
    </div>
  )
}

function SkewedPattern() {
  return (
    <div className='flex flex-row'>
      <div className='w-[500px]' />
      <div className='bg-accRed h-16 w-9 mx-1 -skew-x-[18deg]' />
      <div className='bg-accCyan h-16 w-9 mx-1 -skew-x-[18deg]' />
      <div className='bg-accYellow h-16 w-9 mx-1 -skew-x-[18deg]' />
      <div className='bg-accBlue h-16 w-9 mx-1 -skew-x-[18deg]' />
    </div>
  )
}

function Login() {

  const [errorCount, setErrorCount] = useState(0);

  const promptFieldRef = useRef<any>(null);

  useEffect(() => {
    promptFieldRef.current?.focusOnInput();
  }, []);

  return (
    <div className='w-[80%] h-full mx-auto flex flex-col justify-center items-center text-highlight'>
      <SkewedPattern />
      <div className='flex flex-row mb-8 relative'>
        <div className='w-[95%] mr-4'>
          <Title />
        </div>
        <LoginBadge />
      </div>
      <PromptField
        handleCommands={handleCommands}
        availableCommands={["LOGIN"]}
        center={true}
        capitalize={true}
        ref={promptFieldRef}
      />
      {
        (errorCount >= 3 && <div className='animate-pulse text-md uppercase opacity-0'>Have you tried using the 'login' command?</div>)
      }
    </div >
  )

  function handleCommands(command: string[]) {
    switch (command[0]) {
      case "LOGIN":
        login();
        break;
      default:
        setErrorCount(errorCount + 1);
    }
  }
}

export default Login
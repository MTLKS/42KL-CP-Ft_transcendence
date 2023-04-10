import Button from '../components/Buttons';
import Title from '../components/Title';
import login from '../functions/login';
import PromptField from '../PromptField/PromptField';
import sleep from '../functions/sleep';

function Login() {
  focusOnInput();
  return (
    <div className=' flex flex-col items-center text-white'>
      <div className='mt-[10%] flex flex-row'>
        <div className='w-[500px]' />
        <div className='bg-redOld h-16 w-9 -skew-x-[18deg] mx-1' />
        <div className='bg-cyanOld h-16 w-9 -skew-x-[18deg] mx-1' />
        <div className='bg-yellowOld h-16 w-9 -skew-x-[18deg] mx-1' />
        <div className='bg-blueOld h-16 w-9 -skew-x-[18deg] mx-1' />
      </div>
      <div className=' flex flex-row mb-8'>
        <Title />
        <div className='mt-[25px] p-3 bugee  leading-none 
        rounded-3xl h-[150px] w-[160px] border-4 border-white 
        flex flex-col items-center'
          style={{ borderWidth: '10px' }}
        >
          <div className='flex flex-rol mt-1'>
            <div className='text-3xl'>42</div>
            <div className='ml-[0.375rem] mt-[0.375rem] h-[1.5rem] w-16 bg-white rounded-sm' />
          </div>
          <div className='flex flex-rol'>
            <div className='mr-[0.375rem] mt-[0.375rem] h-[1.5rem] w-16 bg-white rounded-sm' />
            <div className='text-3xl'>ft</div>
          </div>
          <div className='text-xs mt-1'>transcendence</div>
        </div>
      </div>
      <PromptField
        handleCommands={handleCommands}
        availableCommands={["LOGIN"]}
        center={true}
        capitalize={true}
      />
      <div className='text-md uppercase'>have you tried the 'login' command?</div>
    </div >
  )

  async function focusOnInput() {
    await sleep(100);
    document.querySelector('input')?.focus()
  }

  function handleCommands(command: string) {
    switch (command) {
      case "LOGIN":
        login();
        break;
    }
  }
}

export default Login
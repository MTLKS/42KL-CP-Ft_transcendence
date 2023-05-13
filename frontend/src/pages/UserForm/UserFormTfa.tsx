import React, { useEffect, useRef, useState } from 'react'

function UserFormTfa() {

  const [tfaCode, setTfaCode] = useState<string>('');
  const tfaCodeInputRef = useRef<HTMLInputElement>(null);
  const [currentDigit, setCurrentDigit] = useState<number>(0);

  useEffect(() => {
    tfaCodeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (tfaCode.length === 0) {
      setCurrentDigit(0);
      return ;
    }
    setCurrentDigit(tfaCode.length - 1);
  }, [tfaCode]);

  return (
    <div className=''>
      <div className='flex flex-col gap-y-2 cursor-pointer' onClick={() => tfaCodeInputRef.current?.focus()}>
        <p className='w-full'>2FA Verification</p>
        <p className='text-sm text-highlight/80 font-normal'>Hold on! We need to verify your 2FA code before we proceed.</p>
        <div className='flex flex-row gap-x-3 items-center h-fit'>
          <div className='flex flex-row gap-x-1 w-fit text-2xl'>
            {showTypedCode()}
          </div>
          <p className='bg-accRed text-highlight px-3 py-1'>FAILED!</p>
        </div>
      </div>
      <input
        onKeyDown={handleKeyPress}
        onChange={handleOnchange}
        value={tfaCode}
        className='h-0 w-0'
        type="text"
        ref={tfaCodeInputRef}
      />
    </div>
  )

  function showTypedCode() {
    const code = [];
    const currentTfaLength = tfaCode.length;

    for (let i = 0; i < 6; i++) {
      if (i < currentTfaLength) {
        code.push(
          <div key={i} className={`text-dimshadow bg-highlight rounded-sm aspect-square w-8 px-1 py-0.5 border border-highlight text-center`}>
            {tfaCode[i]}
          </div>
        );
      } else {
        code.push(
          <div key={i} className={`text-highlight bg-highlight rounded-sm aspect-square w-8 px-1 py-0.5 border ${i === currentTfaLength && 'border-dimshadow animate-pulse'} text-center`}>
            0
          </div>
        )
      }
    }
    return code;
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && tfaCode.length === 6) {
      e.preventDefault();
      setTfaCode(tfaCode.slice(0, -1));
    }
  }

  function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
    
    if (tfaCode.length >= 6) return ;

    // check if the value only contains numbers
    if (e.target.value.match(/^[0-9]*$/)) {
      setTfaCode(e.target.value);
    }
  }
}

export default UserFormTfa
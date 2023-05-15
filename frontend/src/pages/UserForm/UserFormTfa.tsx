import React, { useEffect, useRef, useState } from 'react'
import { checkTFA } from '../../functions/tfa';
import { set } from 'lodash';

interface UserFormTfaProps {
  tfaVerified: boolean;
  setTFAVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserFormTFAStatus(props: {tfaVerified: boolean}) {

  // Props
  const { tfaVerified } = props;

  if (tfaVerified) {
    return (<p className='bg-accGreen text-highlight px-3 py-1'>SUCCESS!</p>)
  }
  return (<p className='bg-accRed text-highlight px-3 py-1'>FAILED!</p>);
}

function UserFormTfa(props: UserFormTfaProps) {

  // Props
  const { tfaVerified, setTFAVerified } = props;

  // Hooks
  const [tfaCode, setTfaCode] = useState<string>('');
  const tfaCodeInputRef = useRef<HTMLInputElement>(null);
  const [currentDigit, setCurrentDigit] = useState<number>(0);
  const [hasResult, setHasResult] = useState<boolean>(false);

  useEffect(() => {
    tfaCodeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (tfaCode.length === 0) {
      setCurrentDigit(0);
      return ;
    }
    setCurrentDigit(tfaCode.length - 1);

    if (tfaCode.length === 6) {
      verifyTfaCode();
    }
  }, [tfaCode]);

  return (
    <div className='animate-pulse-short'>
      <div className='flex flex-col gap-y-2 cursor-pointer' onClick={() => tfaCodeInputRef.current?.focus()}>
        <p className='w-full'>2FA Verification</p>
        <p className='text-sm text-highlight/80 font-normal'>Hold on! We need to verify your 2FA code before we proceed.</p>
        <div className='flex flex-row gap-x-3 items-center h-fit'>
          <div className='flex flex-row gap-x-1 w-fit text-2xl'>
            {showTypedCode()}
          </div>
          {hasResult && <UserFormTFAStatus tfaVerified={tfaVerified}/>}
        </div>
      </div>
      <input
        onKeyDown={handleKeyPress}
        onChange={handleOnchange}
        value={tfaCode}
        className='h-0 w-0'
        type="text"
        ref={tfaCodeInputRef}
        disabled={tfaVerified}
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
    
    if (hasResult) setHasResult(false);

    if (tfaCode.length >= 6) return ;

    // check if the value only contains numbers
    if (e.target.value.match(/^[0-9]*$/)) {
      setTfaCode(e.target.value);
    }
  }

  async function verifyTfaCode() {
    const result = await checkTFA(tfaCode);
    setTFAVerified(result.boolean);
    if (!result.boolean) setTfaCode('');
    if (!hasResult) setHasResult(true);
  }
}

export default UserFormTfa
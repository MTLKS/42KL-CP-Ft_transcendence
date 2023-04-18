import React, { useState } from 'react'

interface FormQuestionProps {
  question: string;
  answer: string;
  borderColor: string;
  updateAnswer: (ans: string) => void;
}

function UserFormQuestion(props: FormQuestionProps) {

  const [ans, setAns] = useState(props.answer);
  const [borderColor, setBorderColor] = useState(props.borderColor);

  return (
    <div className='flex flex-col gap-2'>
      <p className='font-semibold text-lg lg:text-xl'>{props.question}</p>
      <textarea
        rows={3}
        className={`[resize:none] bg-dimshadow border-${borderColor} border-2 lg:border-4 rounded-md font-semibold text-xs sm:text-sm md:text-lg lg:text-xl p-2 lg:p-3 w-full focus:[outline:none] focus:animate-pulse-short`}
        value={ans}
        autoComplete='off'
        onChange={handleChange}
        onClick={resetBorderColor}
      >
      </textarea>
    </div>
  )

  function handleChange(e: React.FormEvent<HTMLTextAreaElement>) {
    setAns(e.currentTarget.value);
    props.updateAnswer(e.currentTarget.value);
  }

  function resetBorderColor() {
    setBorderColor(`highlight`);
  }
}

export default UserFormQuestion
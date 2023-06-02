import React, { useState } from 'react'

interface FormQuestionProps {
  question: string;
  answer: string;
  updateAnswer: (ans: string) => void;
}

function UserFormQuestion(props: FormQuestionProps) {

  const [ans, setAns] = useState(props.answer);

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-lg font-semibold lg:text-xl'>{props.question}</p>
      <textarea
        rows={3}
        className={`[resize:none] bg-dimshadow border-highlight border-2 lg:border-4 rounded-md font-semibold text-xs sm:text-sm md:text-lg lg:text-xl p-2 lg:p-3 w-full focus:[outline:none] focus:animate-pulse-short`}
        value={ans}
        autoComplete='off'
        onChange={handleChange}
      >
      </textarea>
    </div>
  )

  function handleChange(e: React.FormEvent<HTMLTextAreaElement>) {
    setAns(e.currentTarget.value);
    props.updateAnswer(e.currentTarget.value);
  }
}

export default UserFormQuestion
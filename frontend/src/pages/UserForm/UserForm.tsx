import React, { useEffect, useState } from 'react'
import UserFormAvatar from './UserFormAvatar';
import { UserData } from '../../modal/UserData';
import UserFormName from './UserFormName';
import UserFormQuestion from './UserFormQuestion';
import { getAwesomeSynonym, getRandomIceBreakingQuestion } from '../../functions/fun';
import { Profanity, ProfanityOptions } from '@2toad/profanity';
import { PolkaDotContainer } from '../../components/Background';
import { ErrorPopup } from '../../components/Popup';
import { dataUrlToBlob, toDataUrl } from '../../functions/toDataURL';
import Api from '../../api/api';

enum ErrorCode {
  NAMETOOSHORT,
  NAMETOOLONG,
  EMPTYNAME,
  EMPTYANS,
  PROFANENAME,
  PROFANEANS
}

const getError = (code: ErrorCode) => {

  switch (code) {
    case ErrorCode.EMPTYNAME:
      return ("We need your name, not your silence!");
    case ErrorCode.EMPTYANS:
      return ("No answer? OK! We'll just sit here and wait...");
    case ErrorCode.NAMETOOSHORT:
      return ("Longer name, please. (MIN: 5 chars)");
    case ErrorCode.NAMETOOLONG:
      return ("Name too epic, please shorten. (MAX: 15 chars)");
    case ErrorCode.PROFANENAME:
      return ("Uh oh, that name might be rated R.");
    case ErrorCode.PROFANEANS:
      return ("Please keep it PG. You answer contains profanity.");
    default:
      return ("Error 42: Unknown error occurred");
  }
}

function UserForm(props: UserData) {

  const [avatar, setAvatar] = useState('');
  const [userName, setFinalName] = useState(props.intraName);
  const [questionAns, setQuestionAns] = useState("");
  const [borderColors, setborderColors] = useState({nameBorder: `highlight`, questionBorder: `highlight`});
  const [awesomeSynonym, setAwesomeSynonym] = useState(getAwesomeSynonym());
  const [iceBreakingQuestion, setIceBreakingQuestion] = useState(getRandomIceBreakingQuestion());
  const [popups, setPopups] = useState<JSX.Element[]>([]);

  // convert the image from intra to data:base64
  useEffect(() => {
    toDataUrl(props.avatar)
      .then((res) => setAvatar(res))
  }, []);

  return (
    <PolkaDotContainer>
      <div className='w-full h-fit flex flex-col gap-2 lg:gap-4 items-end z-30 mt-6'>
        {popups}
      </div>
      <div className='flex flex-row w-[80%] h-fit justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:gap-10'>
        <UserFormAvatar intraID={props.intraName} avatarUrl={avatar} setAvatar={setAvatar}/>
        <div className='w-[48%] lg:w-[40%] h-full my-auto flex flex-col font-extrabold text-highlight gap-3'>
          <p className='uppercase text-base lg:text-xl text-dimshadow bg-highlight w-fit p-2 lg:p-3 font-semibold lg:font-extrabold'>user info</p>
          <UserFormName user={props} awesomeSynonym={awesomeSynonym} updateName={updateName} borderColor={borderColors.nameBorder}/>
          <UserFormQuestion question={iceBreakingQuestion} answer={questionAns} updateAnswer={updateAnswer} borderColor={borderColors.nameBorder}/>
          <div
            className='font-semibold lg:font-extrabold flex-1 w-full h-full bg-highlight hover:bg-dimshadow text-dimshadow hover:text-highlight border-2 border-highlight text-center p-2 lg:p-3 text-base lg:text-lg cursor-pointer transition hover:ease-in-out'
            onClick={handleSubmit}
          >
            Submit
          </div>
        </div>
      </div>
    </PolkaDotContainer>
  )

  function updateName(name: string) {
    setFinalName(name);
  }

  function updateAnswer(ans: string) {
    setQuestionAns(ans);
  }

  function checkNameAndAnswer() {
    let errors: ErrorCode[] = new Array();
    const options = new ProfanityOptions();
    options.wholeWord = true;
    const profanity = new Profanity(options);

    if (!userName)
      errors.push(ErrorCode.EMPTYNAME);
    if (userName.length < 5 && !errors.includes(ErrorCode.EMPTYNAME))
      errors.push(ErrorCode.NAMETOOSHORT);
    if (userName.length > 15)
      errors.push(ErrorCode.NAMETOOLONG);
    if (profanity.exists(userName)) // need another way to do this shit. cannot detect if the string is "fuckthisshit"
      errors.push(ErrorCode.PROFANENAME);
    if (!questionAns)
      errors.push(ErrorCode.EMPTYANS);
    if (profanity.exists(questionAns))
      errors.push(ErrorCode.PROFANEANS);
    return (errors);
  }

  async function handleSubmit() {

    let errors: ErrorCode[] = checkNameAndAnswer();
    let formData = new FormData();

    if (errors.length === 0)  { // meaning no error, can POST latest info to server
      Api.updateToken(
        "Authorization",
        document.cookie
        .split(";")
        .find((cookie) => cookie.includes("Authorization"))
        ?.split("=")[1] ?? ""
      );
      formData.append("userName", userName);
      formData.append("avatar", avatar);
      await Api.post("/user", formData);
      Api.get("/user").then((res) => console.log(res));
      setPopups([]);
      return ;
    }
    setPopups(errors.map((error) => <ErrorPopup key={error} text={getError(error)} />))
  }
}

export default UserForm
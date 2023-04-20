import React, { useEffect, useState } from 'react'
import UserFormAvatar from './UserFormAvatar';
import { UserData } from '../../modal/UserData';
import UserFormName from './UserFormName';
import UserFormQuestion from './UserFormQuestion';
import { getAwesomeSynonym, getRandomIceBreakingQuestion } from '../../functions/fun';
import { PolkaDotContainer } from '../../components/Background';
import { ErrorPopup } from '../../components/Popup';
import { dataURItoFile, toDataUrl } from '../../functions/toDataURL';
import Api from '../../api/api';
import sleep from '../../functions/sleep';
import login from '../../functions/login';

enum ErrorCode {
  NAMETOOSHORT,
  NAMETOOLONG,
  EMPTYNAME,
  EMPTYANS,
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
    default:
      return ("Error 42: Unknown error occurred");
  }
}

interface UserFormProps {
  userData: UserData;
}

function UserForm(props: UserFormProps) {
  const { userData } = props;

  const [avatar, setAvatar] = useState('');
  const [userName, setFinalName] = useState(userData.intraName);
  const [fileExtension, setFileExtension] = useState<string>('jpeg');
  const [questionAns, setQuestionAns] = useState("");
  const [awesomeSynonym, setAwesomeSynonym] = useState(getAwesomeSynonym());
  const [iceBreakingQuestion, setIceBreakingQuestion] = useState(getRandomIceBreakingQuestion());
  const [popups, setPopups] = useState<JSX.Element[]>([]);

  // convert the image from intra to data:base64
  useEffect(() => {
    toDataUrl(userData.avatar)
      .then((res) => setAvatar(res))
  }, []);

  return (
    <PolkaDotContainer>
      <div className='w-full h-fit flex flex-col gap-2 lg:gap-4 items-end z-30 mt-6'>
        {popups}
      </div>
      <div className='flex flex-row w-[80%] h-fit justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:gap-10'>
        <UserFormAvatar intraName={userData.intraName} avatarUrl={avatar} setAvatar={setAvatar} setFileExtension={setFileExtension} />
        <div className='w-[48%] lg:w-[40%] h-full my-auto flex flex-col font-extrabold text-highlight gap-3'>
          <p className='uppercase text-base lg:text-xl text-dimshadow bg-highlight w-fit p-2 lg:p-3 font-semibold lg:font-extrabold'>user info</p>
          <UserFormName user={userData} awesomeSynonym={awesomeSynonym} updateName={updateName} />
          <UserFormQuestion question={iceBreakingQuestion} answer={questionAns} updateAnswer={updateAnswer} />
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

    if (!userName)
      errors.push(ErrorCode.EMPTYNAME);
    if (userName.length < 5 && !errors.includes(ErrorCode.EMPTYNAME))
      errors.push(ErrorCode.NAMETOOSHORT);
    if (userName.length > 16)
      errors.push(ErrorCode.NAMETOOLONG);
    if (!questionAns)
      errors.push(ErrorCode.EMPTYANS);
    return (errors);
  }

  async function handleSubmit() {

    let errors: ErrorCode[] = checkNameAndAnswer();
    let formData = new FormData();
    let avatarFile;

    if (errors.length === 0) {
      Api.updateToken(
        "Authorization",
        document.cookie
          .split(";")
          .find((cookie) => cookie.includes("Authorization"))
          ?.split("=")[1] ?? ""
      );
      avatarFile = dataURItoFile(avatar, `${userData.intraName}`);
      formData.append("userName", userName);
      formData.append("image", avatarFile);
      await Api.post("/user", formData).then((res) => console.log(res));
      Api.get("/user").then((res) => console.log(res));
      setPopups([]);
      await sleep(1000);
      login();
      return;
    }
    setPopups(errors.map((error) => <ErrorPopup key={error} text={getError(error)} />))
  }
}

export default UserForm
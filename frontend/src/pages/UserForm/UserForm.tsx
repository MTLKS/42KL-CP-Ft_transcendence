import React, { useEffect, useMemo, useState } from 'react'
import UserFormAvatar from './UserFormAvatar';
import { UserData } from '../../model/UserData';
import UserFormName from './UserFormName';
import UserFormQuestion from './UserFormQuestion';
import { getAwesomeSynonym, getRandomIceBreakingQuestion } from '../../functions/fun';
import { PolkaDotContainer } from '../../components/Background';
import { ErrorPopup } from '../../components/Popup';
import { dataURItoFile, toDataUrl } from '../../functions/toDataURL';
import Api from '../../api/api';
import sleep from '../../functions/sleep';
import login from '../../functions/login';
import { FaArrowLeft } from 'react-icons/fa';
import UserFormTfa from './UserFormTfa';

interface IAPIResponse {
  intraId: number,
  userName: string,
  intraName: string,
  elo: number,
  accessToken: string,
  avatar: string,
  tfaSecret: string,
  error: string
}

enum ErrorCode {
  IMAGETOOBIG,
  NAMETOOSHORT,
  NAMETOOLONG,
  NAMEINVALID,
  NAMETAKEN,
  EMPTYNAME,
  EMPTYANS
}

const getError = (code: ErrorCode) => {

  switch (code) {
    case ErrorCode.EMPTYNAME:
      return ("We need your name, not your silence!");
    case ErrorCode.EMPTYANS:
      return ("No answer? OK! We'll just sit here and wait...");
    case ErrorCode.NAMETOOSHORT:
      return ("Longer name, please. (MIN: 1 chars)");
    case ErrorCode.NAMETOOLONG:
      return ("Name too epic, please shorten. (MAX: 16 chars)");
    case ErrorCode.IMAGETOOBIG:
      return ("Image too good, make it smaller. (MAX: 3MB)")
    case ErrorCode.NAMETAKEN:
      return ("Epic name taken, please choose another one.");
    case ErrorCode.NAMEINVALID:
      return ("Names like Elon Musk's son not allowed");
    default:
      return ("Error 42: Unknown error occurred");
  }
}

interface UserFormProps {
  userData: UserData;
  isUpdatingUser: boolean;
  setIsUpdatingUser: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserForm(props: UserFormProps) {
  const { userData, isUpdatingUser, setIsUpdatingUser } = props;

  const [avatar, setAvatar] = useState('');
  const [userName, setFinalName] = useState(userData.intraName);
  const [fileExtension, setFileExtension] = useState<string>('jpeg');
  const [questionAns, setQuestionAns] = useState("");
  const awesomeSynonym = useMemo(() => getAwesomeSynonym(), []);
  const iceBreakingQuestion = useMemo(() => getRandomIceBreakingQuestion(), []);
  const [popups, setPopups] = useState<JSX.Element[]>([]);

  // convert the image from intra to data:base64
  useEffect(() => {
    toDataUrl(userData.avatar)
      .then((res) => setAvatar(res))
  }, []);

  return (
    <div className=''>
      <div className='w-full h-fit flex flex-col gap-2 lg:gap-4 items-end z-30 mt-6'>
        {popups}
      </div>
      { 
        // extra feature: check if the user actually modified their name and avatar or not. If they did, ask for confirmation before back to homepage
        isUpdatingUser && 
        <button className='absolute top-8 left-8 h-fit p-3 rounded-md bg-highlight text-center cursor-pointer flex flex-row gap-x-3 items-center group hover:bg-dimshadow border-highlight border-2 transition-all duration-200 focus:outline-dashed focus:outline-[3px] focus:outline-highlight' onClick={() => setIsUpdatingUser(false)}>
          <FaArrowLeft className='text-dimshadow font-extrabold text-xl group-hover:text-highlight'/>
          <span className='font-extrabold text-xl group-hover:text-highlight'>BACK</span>
        </button>
      }
      <div className='flex flex-row w-[80%] h-fit justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:gap-10'>
        <UserFormAvatar intraName={userData.intraName} avatarUrl={avatar} setAvatar={setAvatar} setFileExtension={setFileExtension} />
        <div className='w-[48%] lg:w-[40%] h-full my-auto flex flex-col font-extrabold text-highlight gap-3'>
          <p className='uppercase text-base lg:text-xl text-dimshadow bg-highlight w-fit p-2 lg:p-3 font-semibold lg:font-extrabold'>user info</p>
          <UserFormName user={userData} awesomeSynonym={awesomeSynonym} updateName={updateName} />
          <UserFormQuestion question={iceBreakingQuestion} answer={questionAns} updateAnswer={updateAnswer} />
          <UserFormTfa />
          <div className='font-semibold lg:font-extrabold flex-1 w-full h-full bg-highlight hover:bg-dimshadow text-dimshadow hover:text-highlight border-2 border-highlight text-center p-2 lg:p-3 text-base lg:text-lg cursor-pointer transition hover:ease-in-out' onClick={handleSubmit}>
            Submit
          </div>
        </div>
      </div>
    </div>
  )

  function updateName(name: string) {
    setFinalName(name);
  }

  function updateAnswer(ans: string) {
    setQuestionAns(ans);
  }

  function checkNameAndAnswer() {
    let errors: ErrorCode[] = new Array();

    if (!userName || userName.trim() === '')
      errors.push(ErrorCode.EMPTYNAME);
    if (userName.length < 1 && !errors.includes(ErrorCode.EMPTYNAME))
      errors.push(ErrorCode.NAMETOOSHORT);
    if (userName.length > 16)
      errors.push(ErrorCode.NAMETOOLONG);
    if (!questionAns)
      errors.push(ErrorCode.EMPTYANS);
    if (/^[a-zA-Z0-9_-]+$/.test(userName) === false)
      errors.push(ErrorCode.NAMEINVALID);
    return (errors);
  }

  async function handleSubmit() {

    let errors: ErrorCode[] = checkNameAndAnswer();
    let formData = new FormData();
    let avatarFile;

    sessionStorage.removeItem(`image-${userData.avatar}`)
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
      try {
        await Api.patch("/user", formData).then((res) => {
          let retVal = res.data as IAPIResponse;
          if (retVal.error === "Invalid username - username already exists or invalid") {
            throw new Error(ErrorCode.NAMETAKEN.toString());
          }
        });
      } catch (Error: any) {
        return setPopups([parseInt(Error.toString().slice(7))].map((error) => <ErrorPopup key={error} text={getError(error)} />))
      }
      setPopups([]);
      await sleep(1000);
      return login();
    }
    setPopups(errors.map((error) => <ErrorPopup key={error} text={getError(error)} />))
  }
}

export default UserForm
import React from 'react'
import PixelatedImage from '../../components/PixelatedImage'
import ProfileElo from '../Profile/Expanded/ProfileElo'
import { UserData } from '../../model/UserData'
import ProfileSmall from '../Profile/Expanded/ProfileSmall'
import duck from '../../../assets/duck.png'
import { Active } from '../../../../backend/src/entity/active.entity';

let myProfile: UserData = {
  accessToken: "hidden",
  avatar: "",
  elo: 400,
  intraId: 130305,
  intraName: "wricky-t",
  tfaSecret: null,
  userName: "JOHNDOE",
  winning: true
}

function Lobby() {
  return (
    <div className=' flex flex-col font-bungee tracking-widest text-highlight items-center p-10  box-border'>
      <h1 className='text-[40px] font-extrabold'>OPPONENT</h1>
      <LobbyProfile />
      <div className='flex-1  flex flex-row w-full box-border'>
        <div className=' flex-1 flex flex-col items-center box-border m-10'>
          <div className=' grid grid-cols-2 grid-rows-2 w-full gap-x-20 gap-y-10 max-h-96'>
            <img src={duck} className=' border-4 border-highlight rounded-lg' />
            <img src={duck} className=' border-4 border-highlight rounded-lg' />
            <img src={duck} className=' border-4 border-highlight rounded-lg' />
            <img src={duck} className=' border-4 border-highlight rounded-lg' />
          </div>
          <h2 className='text-[25px] text-highlight font-extrabold'>gamemode: Sudden Death</h2>
          <div className='flex flex-row gap-x-5 w-full'>
            <LobbyButton title='boring' />
            <LobbyButton title='standard' color='accCyan' />
            <LobbyButton title='death' color='accRed' selected />
          </div>
        </div>
        <div className=' flex-2 flex flex-col items-center'>
          <h2 className='text-[25px] text-highlight font-extrabold'>gamemode: Sudden Death</h2>
        </div>
      </div>
    </div>
  )
}

export default Lobby

function LobbyProfile() {
  return <div className={` flex flex-row w-fit box-border bg-highlight font-jbmono tracking-normal transition-all duration-300 ease-in-out h-20 cursor-pointer`}>
    <div className={'w-20 h-20 aspect-square transition-all'}>
      <PixelatedImage src={duck} pixelSize={1} className='w-full' />
    </div>
    <div className={`flex flex-row overflow-hidden items-center transition-all duration-500 ease-in-out w-fit h-20`}>
      <div className='flex flex-col justify-center mx-5'>
        <div className=' text-2xl text-dimshadow font-extrabold'>{myProfile.userName}</div>
        <div className=' text-xs text-dimshadow'>THE BLACKHOLE DESTROYER</div>
      </div>
    </div>
    <div className={'h-20 transition-all duration-1000 ease-in-out'}>
      <ProfileElo expanded={false} elo={200} winning={true} />
    </div>
  </div>
}

interface LobbyButtonProps {
  title?: string;
  onClick?: () => void;
  color?: string;
  selected?: boolean;
}

function LobbyButton(props: LobbyButtonProps) {
  const { title, onClick, color, selected } = props;

  return (
    <div className=' relative flex-1 box-border'>
      {/* {!selected || <div className={`border-${color ?? "highlight"} border-4 rounded animate-ping w-full h-full absolute top-0 left-0`} />} */}
      <button
        className={`
        w-full bg-${color ?? "highlight"}/10 cursor-pointer rounded p-2
        group hover:bg-${color ?? "highlight"}
        border-[3px] border-${color ?? "highlight"}/${!selected ? 50 : 100} transition-all duration-200 focus:outline-dimshadow`}
        onClick={onClick}
      >
        <p className={`uppercase font-extrabold text-md text-${color ?? "highlight"} group-hover:text-dimshadow text-center`}>{title}</p>
      </button>
    </div>
  )
}
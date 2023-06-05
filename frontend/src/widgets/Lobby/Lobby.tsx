import React, { useMemo } from 'react'
import PixelatedImage from '../../components/PixelatedImage'
import ProfileElo from '../Profile/Expanded/ProfileElo'
import { UserData } from '../../model/UserData'
import ProfileSmall from '../Profile/Expanded/ProfileSmall'
import duck from '../../../assets/duck.png'
import speedGIF from '../../../assets/GIFS/SpeedPaddle.gif'
import speedPNG from '../../../assets/GIFS/SpeedPaddle.png'
import spinGIF from '../../../assets/GIFS/SpinPaddle.gif'
import spinPNG from '../../../assets/GIFS/SpinPaddle.png'
import standardGIF from '../../../assets/GIFS/StandardGame.gif'
import { Active } from '../../../../backend/src/entity/active.entity';
import { PaddleType } from '../../game/gameData'
import { gameData } from '../../main'

let myProfile: UserData = {
  accessToken: "hidden",
  avatar: "",
  elo: 400,
  intraId: 130305,
  intraName: "wricky-t",
  tfaSecret: null,
  userName: "JOHNDOE",
  winning: true,
  email: "hidden",
}

function Lobby() {
  const [selectedMode, setSelectedMode] = React.useState('standard');
  const [ready, setReady] = React.useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = React.useState<PaddleType>(PaddleType.Vzzzzzzt);

  return (
    <div className=' flex flex-col font-bungee tracking-widest text-highlight items-center p-10 box-border h-full'>
      <div className=' flex flex-row w-full box-border h-full'>
        <div className=' h-full flex-1 flex flex-col items-center box-border m-10 mt-0'>
          <h1 className='text-[40px] font-extrabold'>OPPONENT</h1>
          <div className="mb-12 border-4 rounded border-highlight">
            <LobbyProfile />
          </div>
          <div className=' shrink grid grid-cols-2 grid-rows-2 w-full gap-x-20 gap-y-20 max-w-md max-h-md place-items-center box-border'>
            <PowerUpButton onClick={() => setSelectedPowerUp(PaddleType.Vzzzzzzt)} selected={selectedPowerUp === PaddleType.Vzzzzzzt} gif={speedGIF} img={speedPNG} title='Vzzzzzzt' content='Faster ball.' />
            <PowerUpButton onClick={() => setSelectedPowerUp(PaddleType.Piiuuuuu)} selected={selectedPowerUp === PaddleType.Piiuuuuu} gif={spinGIF} img={spinPNG} title='Piiuuuuu' content={'Hold left click to hold the ball on contact,\nrelease left click to release.'} />
            <PowerUpButton onClick={() => setSelectedPowerUp(PaddleType.Ngeeeaat)} selected={selectedPowerUp === PaddleType.Ngeeeaat} gif={spinGIF} img={spinPNG} title='Ngeeeaat' content='Longer paddle.' />
            <PowerUpButton onClick={() => setSelectedPowerUp(PaddleType.Vrooooom)} selected={selectedPowerUp === PaddleType.Vrooooom} gif={spinGIF} img={spinPNG} title='Vrooooom' content='Stronger spin.' />
          </div>
          <h2 className=' mt-auto text-[25px] text-highlight font-extrabold'>gamemode: <span className={selectedMode === "boring" ? "text-highlight" : selectedMode === "standard" ? "text-accCyan" : "text-accRed"}>{selectedMode}</span> </h2>
          <div className=' flex flex-row gap-x-2 w-full h-fit'>
            <LobbyButton title='boring' selected={selectedMode === "boring"} onClick={() => setSelectedMode("boring")} />
            <LobbyButton title='standard' color='accCyan' selected={selectedMode === "standard"} onClick={() => setSelectedMode("standard")} />
            <LobbyButton title='death' color='accRed' selected={selectedMode === "sudden death"} onClick={() => setSelectedMode("sudden death")} />
          </div>
        </div>
        <div className=' top-0 w-64 flex flex-col items-center gap-3 box-border'>
          <div className='flex-1'></div>
          <LobbyReadyButton >
            <p className={`uppercase font-extrabold w-full text-md text-highlight group-hover:text-dimshadow text-center`}
              onClick={() => gameData.leaveLobby()}
            >leave</p>
          </LobbyReadyButton>
          <LobbyReadyButton onClick={() => sendReady()} selected={ready}>
            <p className={`uppercase font-extrabold text-3xl m-5 ${ready ? "text-dimshadow" : "text-highlight"} group-hover:text-dimshadow text-center`}>ready</p>
          </LobbyReadyButton>
        </div>
      </div>
    </div>
  )

  function sendReady() {
    setReady(!ready);
    if (selectedPowerUp === PaddleType.Ngeeeaat)
      gameData.sendReady(ready, "Ngeeeaat");
    else if (selectedPowerUp === PaddleType.Piiuuuuu)
      gameData.sendReady(ready, "Piiuuuuu");
    else if (selectedPowerUp === PaddleType.Vrooooom)
      gameData.sendReady(ready, "Vrooooom");
    else if (selectedPowerUp === PaddleType.Vzzzzzzt)
      gameData.sendReady(ready, "Vzzzzzzt");
  }
}

export default Lobby

interface PowerUpButtonProps {
  title?: string;
  content?: string;
  gif?: string;
  img?: string;
  selected?: boolean;
  onClick?: () => void;
}


function PowerUpButton(props: PowerUpButtonProps) {
  const { title, content, onClick, gif, img, selected } = props;
  const [hover, setHover] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const hoverRef = React.useRef<HTMLDivElement>(null);

  return (
    <button className='w-full relative cursor-pointer'
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => handleMouseMove(e)}
    >
      {imgLoaded ? null : <div className=' animate-pulse bg-highlight/50 border-4 rounded-lg aspect-square' />}
      <img src={hover ? gif : img} className={` border-4 w-full ${selected ? "border-highlight animate-pulse" : "border-highlight/10"} rounded-lg transition-colors hover:border-highlight ${imgLoaded ? " opacity-100" : " opacity-0"}`}
        onLoad={() => imgOnLoad()}
      />
      <div ref={hoverRef} className={`z-10 pointer-events-none font-jbmono rounded-lg border-highlight border-2 text-start bg-dimshadow absolute w-[400px] p-2 transition-opacity ease-in duration-200 ${hover ? " opacity-100" : " opacity-0"} `}>
        <h3 className=' text-lg'>{title}</h3>
        <p className=' text-sm font-normal'>{content}</p>
      </div>
    </button>
  )

  function imgOnLoad() {
    setImgLoaded(true);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (buttonRef.current == null || hoverRef.current == null) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hoverRef.current.style.left = `${x + 10}px`;
    hoverRef.current.style.top = `${y + 10}px`;
  }
}

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
  const [hover, setHover] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const hoverRef = React.useRef<HTMLDivElement>(null);

  const bg = useMemo(() => {
    if (color == null && hover) return 'bg-highlight'
    if (color == null) return 'bg-highlight/10'
    if (color === 'accCyan' && hover) return 'bg-accCyan'
    if (color === 'accCyan') return 'bg-accCyan/10'
    if (color === 'accRed' && hover) return 'bg-accRed'
    if (color === 'accRed') return 'bg-accRed/10'
  }, [color, hover]);

  const border = useMemo(() => {
    if (color == null && selected) return 'border-highlight'
    if (color == null) return 'border-highlight/10'
    if (color === 'accCyan' && selected) return 'border-accCyan'
    if (color === 'accCyan') return 'border-accCyan/10'
    if (color === 'accRed' && selected) return 'border-accRed'
    if (color === 'accRed') return 'border-accRed/10'
  }, [color, selected]);

  const text = useMemo(() => {
    if (color == null) return selected ? 'text-highlight' : 'text-highlight/20'
    if (color === 'accCyan') return selected ? 'text-accCyan' : 'text-accCyan/40'
    if (color === 'accRed') return selected ? 'text-accRed' : 'text-accRed/40'
  }, [color, selected]);

  return (
    <button
      ref={buttonRef}
      className={`relative box-border
        flex-1 ${bg} cursor-pointer rounded-xl p-4
        group hover:${bg}
        border-[4px] ${border} transition-all duration-200 focus:outline-dimshadow`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => handleMouseMove(e)}
    >
      <p className={`uppercase font-extrabold text-lg ${text} group-hover:text-dimshadow text-center`} style={{ fontSize: "25px" }}>{title}</p>
      <div ref={hoverRef} className={`z-10 pointer-events-none font-jbmono rounded-lg border-highlight border-4 text-start bg-dimshadow absolute w-[400px] h-[228px] transition-opacity ease-in duration-200 ${hover ? " opacity-100" : " opacity-0"} `}>
        {imgLoaded ? null : <div className='w-full h-full flex justify-center rounded-[4px] items-center animate-pulse bg-highlight/50' />}
        <img src={standardGIF} height={200} width={400} className={` bg-clip-content rounded-[4px] ${imgLoaded ? "" : "hidden"}`} onLoad={() => imgOnLoad()} />
      </div>
    </button>
  )

  function imgOnLoad() {
    setImgLoaded(true);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (buttonRef.current == null || hoverRef.current == null) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hoverRef.current.style.left = `${x + 20}px`;
    hoverRef.current.style.top = `${y - 228}px`;
  }
}

interface LobbyReadyButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  selected?: boolean;
}

function LobbyReadyButton(props: LobbyReadyButtonProps) {
  const { onClick, children, selected = false } = props;
  return (
    <button
      className={`
        w-full ${selected ? "bg-highlight" : "bg-transparent  hover:bg-highlight/70"} cursor-pointer rounded-xl group
        border-[4px] border-highlight transition-all duration-200 focus:outline-dimshadow`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
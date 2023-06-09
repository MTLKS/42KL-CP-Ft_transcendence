import { FaSadCry } from 'react-icons/fa'
import { UserData } from '../../../model/UserData'
import { useContext } from 'react';
import UserContext from '../../../contexts/UserContext';

interface EmptyFriendlistProps {
  userData: UserData
}

function EmptyFriendlist(props: EmptyFriendlistProps) {

  const { userData } = props;
  const { myProfile } = useContext(UserContext);

  if (userData.intraId === myProfile.intraId) {
    return (
      <div className='flex flex-col items-center m-auto text-2xl text-center w-fit h-fit text-highlight gap-y-4'>
        <p className='flex flex-row gap-x-3'>You have no friends... Boohoo <FaSadCry className='animate-bounce text-accYellow' /></p>
        <p className='text-lg'>Use <span className='bg-highlight text-dimshadow'>friend add [username]</span> to add some friends!</p>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col items-center m-auto text-2xl text-center w-fit h-fit text-highlight gap-y-4'>
        <p className='flex flex-row gap-x-3'>{userData.userName} has no friends... Boohoo <FaSadCry className='animate-bounce text-accYellow' /></p>
        <p className='text-lg'>Use <span className='bg-highlight text-dimshadow'>friend add {userData.intraName}</span> to send a friend request!</p>
      </div>
    )
  }
}

export default EmptyFriendlist
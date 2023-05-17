import previewProfileContext from "../../../contexts/PreviewProfileContext";
import { getProfileOfUser } from "../../../functions/profile";
import { FriendData } from "../../../model/FriendData";
import { UserData } from "../../../model/UserData";
import Profile from "../../Profile/Profile";
import { useContext } from "react";

function FriendActionProfileCard(props: { isCurrentIndex: boolean, friend: FriendData, friendIntraName: string }) {
  const { isCurrentIndex, friend, friendIntraName } = props;
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(previewProfileContext);
  
  return (
    <div
      className={`flex flex-row ${isCurrentIndex ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={() => replaceProfile(friend)
      }
    >
      <img
        className="aspect-square h-full object-cover"
        src={friend.avatar}
        alt=""
      />
      <div className='group-hover:bg-highlight h-full p-3.5'>
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friend.userName} ({friendIntraName})</p>
      </div>
    </div>
  )

  async function replaceProfile(friend: FriendData) {
    let friendData = await getProfileOfUser(friendIntraName);
    console.log(friendData.data as UserData);
    setPreviewProfileFunction(friendData.data as UserData);
    setTopWidgetFunction(<Profile expanded={true} />)
  }
}

export default FriendActionProfileCard;

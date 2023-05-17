import PreviewProfileContext from "../../../contexts/PreviewProfileContext";
import { getProfileOfUser } from "../../../functions/profile";
import { FriendData } from "../../../model/FriendData";
import { UserData } from "../../../model/UserData";
import Profile from "../../Profile/Profile";
import { useContext } from "react";

function FriendActionProfileCard(props: { isCurrentIndex: boolean, friend: FriendData, friendIntraName: string }) {
  const { isCurrentIndex, friend, friendIntraName } = props;
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(PreviewProfileContext);

  return (
    <button
      className={`flex flex-row ${isCurrentIndex && friend.status.toLowerCase() !== "blocked" ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={replaceProfile}
      disabled={friend.status.toLowerCase() === "blocked"}
    >
      <img
        className="aspect-square h-full object-cover"
        src={friend.avatar}
        alt={friend.userName + "'s avatar"}
      />
      <div className='group-hover:bg-highlight h-full p-3.5'>
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friend.userName} ({friendIntraName})</p>
      </div>
    </button>
  )

  async function replaceProfile() {
    let friendData = await getProfileOfUser(friendIntraName);
    setPreviewProfileFunction(friendData.data as UserData);
    setTopWidgetFunction(<Profile expanded={true} />)
  }
}

export default FriendActionProfileCard;

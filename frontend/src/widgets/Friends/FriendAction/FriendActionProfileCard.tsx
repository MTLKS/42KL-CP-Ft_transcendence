import PreviewProfileContext from "../../../contexts/PreviewProfileContext";
import { getProfileOfUser } from "../../../api/profileAPI";
import { FriendData } from "../../../model/FriendData";
import { UserData } from "../../../model/UserData";
import Profile from "../../Profile/Profile";
import { useContext } from "react";

interface FriendActionProfileCardProps {
  isCurrentIndex: boolean;
  friendInfo: UserData;
  friendshipStatus: string;
}

function FriendActionProfileCard(props: FriendActionProfileCardProps) {
  const { isCurrentIndex, friendInfo, friendshipStatus } = props;
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(PreviewProfileContext);

  return (
    <button
      className={`flex flex-row ${isCurrentIndex && friendshipStatus.toLowerCase() !== "blocked" ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={replaceProfile}
      disabled={friendshipStatus.toLowerCase() === "blocked"}
    >
      <img
        className="aspect-square h-full object-cover"
        src={friendInfo.avatar}
        alt={friendInfo.userName + "'s avatar"}
      />
      <div className='group-hover:bg-highlight h-full p-3.5'>
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friendInfo.userName} ({friendInfo.intraName})</p>
      </div>
    </button>
  )

  async function replaceProfile() {

    if (friendshipStatus.toLowerCase() === "blocked") return;

    let friendData = await getProfileOfUser(friendInfo.intraName);
    setPreviewProfileFunction(friendData.data as UserData);
    setTopWidgetFunction(<Profile expanded={true} />)
  }
}

export default FriendActionProfileCard;

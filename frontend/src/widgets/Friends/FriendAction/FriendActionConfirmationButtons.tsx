import { AxiosResponse } from "axios";
import { useContext } from "react";
import { FriendActionContext, ActionCardsContext, ActionOutputContext, FriendsContext } from "../../../contexts/FriendContext";
import { addFriend, acceptFriend, deleteFriendship, blockExistingFriend } from "../../../functions/friendactions";
import { getFriendList } from "../../../functions/friendlist";
import { ACTION_TYPE } from "./FriendActionCard";

interface FriendActionConfirmationButtonsProps {
  friendIntraName: string;
  friendUserName: string;
  ignoreAction?: () => void;
}

function FriendActionConfirmationButtons(props: FriendActionConfirmationButtonsProps) {

  const action = useContext(FriendActionContext);
  let { actionCards } = useContext(ActionCardsContext);
  const { selectedIndex, setSelectedIndex } = useContext(ActionCardsContext);
  let { setOutputStr, setOutputStyle, setShowOutput } = useContext(ActionOutputContext);
  const { friendIntraName, friendUserName, ignoreAction } = props;
  let yesAction: (name: string) => Promise<AxiosResponse>;
  let noAction: (name:string) => Promise<AxiosResponse>;

  const { setFriends } = useContext(FriendsContext);

  setActionFunctions();

  return (
    <>
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={handleYesAction}>
        <span className='font-extrabold'>y</span>es
      </button>
      /
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`}
        onClick={
          action === ACTION_TYPE.ACCEPT
          ? handleNoAction
          : ignoreAction
        }
      >
        <span className='font-extrabold'>n</span>o
      </button>
      {
        action === ACTION_TYPE.ACCEPT
        ? <>
            /
            <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={ignoreAction}>
              <span className='font-extrabold'>i</span>gnore
            </button>
          </>
        : <></>
      }
    </>
  )

  function setActionFunctions() {
    switch (action) {
      case ACTION_TYPE.ADD:
        yesAction = addFriend;
        break;
      case ACTION_TYPE.ACCEPT:
        yesAction = acceptFriend;
        noAction = deleteFriendship;
        break;
      case ACTION_TYPE.BLOCK:
        yesAction = blockExistingFriend;
        break;
      case ACTION_TYPE.UNBLOCK:
        yesAction = deleteFriendship;
        break;
      case ACTION_TYPE.UNFRIEND:
        yesAction = deleteFriendship;
        break;
      default:
        break;
    }
  }

  function getOutputString() {
    switch (action) {
      case ACTION_TYPE.ACCEPT || ACTION_TYPE.ADD:
        return `'${friendUserName}' is your friend now! HOORAY!`
      case ACTION_TYPE.BLOCK:
        return `'${friendUserName}' has been blocked. :(`
      case ACTION_TYPE.UNBLOCK:
        return `'${friendUserName}' has been unblocked. You need to send another friend request to be his/her friend again.`
      case ACTION_TYPE.UNFRIEND:
        return `'${friendUserName}' has been unfriended. Bye bye friend...`
      default:
        return '';
    }
  }

  function handleYesAction() {
    yesAction(friendIntraName)
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        if (action !== ACTION_TYPE.UNFRIEND)
          setOutputStyle("bg-accCyan");
        setOutputStr(getOutputString());
        setShowOutput(true);
      })
      .catch(err => console.log(err));
    }
    
    // will only used by ACTION.TYPE = ACCEPT
    function handleNoAction() {
      noAction(friendIntraName)
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        setOutputStyle("bg-accRed");
        setOutputStr(`You rejected friend request from '${friendUserName}'`);
        setShowOutput(true);
      })
      .catch(err => console.log(err));
  }
}

export default FriendActionConfirmationButtons;
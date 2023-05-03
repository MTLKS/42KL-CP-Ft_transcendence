import { useContext, useRef } from "react";
import { ActionFunctionsContext, FriendActionContext } from "../../../contexts/FriendContext";
import { ACTION_TYPE } from "./FriendActionCard";
import { blockStranger } from "../../../functions/friendactions";
import { getFriendList } from "../../../functions/friendlist";
import { FriendsContext } from "../../../contexts/FriendContext";

interface FriendActionConfirmationButtonsProps {
  friendIntraName: string;
  friendUserName: string;
  ignoreAction?: () => void;
  alternativeAction?: () => void;
}

function FriendActionConfirmationButtons(props: FriendActionConfirmationButtonsProps) {

  const { setFriends } = useContext(FriendsContext);
  const action = useContext(FriendActionContext);
  const { yesAction, noAction } = useContext(ActionFunctionsContext);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  
  const { friendIntraName, ignoreAction, alternativeAction } = props;

  return (
    <>
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={alternativeAction !== undefined ? alternativeAction : handleYesAction} ref={yesBtnRef}>
        <span className='font-extrabold'>y</span>es
      </button>
      /
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`}
        ref={noBtnRef}
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
  
  function handleYesAction() {
    yesAction(friendIntraName, true);
  }

  function handleNoAction() {
    noAction(friendIntraName, true);
  }
}

export default FriendActionConfirmationButtons;
interface NewChatRoomState {
  isChannel: boolean,
  members: string[],
  dmReceiver: string,
}

export const newChatRoomInitialState: NewChatRoomState = {
  isChannel: false,
  members: [],
  dmReceiver: '',
}

type NewChatRoomAction = 
  | { type: 'SET_IS_CHANNEL', payload: boolean }
  | { type: 'SELECT_MEMBER', payload: string }
  | { type: 'DESELECT_MEMBER', payload: string }
  | { type: 'CREATE_CHATROOM'}

export default function newChatRoomReducer(state = newChatRoomInitialState, action: NewChatRoomAction): NewChatRoomState {
  switch (action.type) {
    case 'SET_IS_CHANNEL': {
      return {
        ...state,
        isChannel: action.payload,
      }
    }
    case 'SELECT_MEMBER': {
      return {
        ...state,
        members: state.isChannel ? [...state.members, action.payload] : [action.payload],
      }
    }
    case 'DESELECT_MEMBER': {
      return {
        ...state,
        members: state.members.filter(member => member !== action.payload),
      }
    }
    case 'CREATE_CHATROOM': {
      
    }
    default:
      return state
  }
}
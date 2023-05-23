import { ChatroomData, MemberData } from "../../../../model/ChatRoomData";
import { UserData } from "../../../../model/UserData"

interface ChannelMemberRole {
  memberInfo: UserData,
  role: 'admin' | 'member' | 'owner'
}

export enum NewChannelError {
  INVALID_CHANNEL_NAME,
  INVALID_PASSWORD,
  INVALID_NEW_PASSWORD,
  REQUIRED_PASSWORD_TO_MAKE_CHANGES,
}

export interface NewChannelState {
  members: ChannelMemberRole[],
  channelName: string,
  isPrivate: boolean,
  password: string | null,
  newPassword: string | null,
  errors: NewChannelError[],
  isNewChannel: boolean,
}

export const newChannelInitialState: NewChannelState = {
  members: [],
  channelName: '',
  isPrivate: false,
  password: null,
  newPassword: null,
  errors: [],
  isNewChannel: true,
}

export type NewChannelAction =
  | { type: 'SET_CHANNEL_VISIBILITY', isPrivate: boolean }
  | { type: 'SELECT_MEMBER', userInfo: UserData }
  | { type: 'DESELECT_MEMBER', userInfo: UserData }
  | { type: 'ASSIGN_AS_OWNER', intraName: string }
  | { type: 'ASSIGN_AS_ADMIN', intraName: string }
  | { type: 'ASSIGN_AS_MEMBER', intraName: string}
  | { type: 'SET_CHANNEL_NAME', channelName: string }
  | { type: 'SET_CHANNEL_PRIVACY', isPrivate: boolean }
  | { type: 'SET_CHANNEL_PASSWORD', password: string | null }
  | { type: 'SET_CHANNEL_NEW_PASSWORD', newPassword: string | null }
  | { type: 'SET_CHANNEL_INFO', chatroomData: ChatroomData, members: MemberData[] }
  | { type: 'ADD_ERROR', error: NewChannelError}
  | { type: 'IS_EDIT_CHANNEL'}
  | { type: 'RESET_ERRORS'}
  | { type: 'RESET'}
  | { type: 'CLONE_STATE', state: NewChannelState };

export default function newChannelReducer(state = newChannelInitialState, action: NewChannelAction): NewChannelState {
  switch (action.type) {
    case 'SELECT_MEMBER': {
      if (state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
      const memberRole: ChannelMemberRole = {
        memberInfo: action.userInfo,
        role: 'member',
      }
      return {
        ...state,
        members: [...state.members, memberRole],
      }
    }
    case 'DESELECT_MEMBER': {
      if (!state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
      return {
        ...state,
        members: state.members.filter(member => member.memberInfo.intraName !== action.userInfo.intraName),
      }
    }
    case 'ASSIGN_AS_OWNER': {
      return {
        ...state,
        members: state.members.map(member => {
          if (member.memberInfo.intraName === action.intraName) {
            return {
              ...member,
              role: 'owner',
            }
          }
          return member
        }),
      }
    }
    case 'ASSIGN_AS_ADMIN': {
      return {
        ...state,
        members: state.members.map(member => {
          if (member.memberInfo.intraName === action.intraName) {
            return {
              ...member,
              role: 'admin',
            }
          }
          return member
        }),
      }
    }
    case 'ASSIGN_AS_MEMBER': {
      return {
        ...state,
        members: state.members.map(member => {
          if (member.memberInfo.intraName === action.intraName) {
            return {
              ...member,
              role: 'member',
            }
          }
          return member
        }),
      }
    }
    case 'ADD_ERROR': {
      return {
        ...state,
        errors: [...state.errors, action.error],
      }
    }
    case 'SET_CHANNEL_NAME': {
      return {
        ...state,
        channelName: action.channelName,
      }
    }
    case 'SET_CHANNEL_PASSWORD': {
      return {
        ...state,
        password: action.password,
      }
    }
    case 'SET_CHANNEL_NEW_PASSWORD': {
      return {
        ...state,
        newPassword: action.newPassword,
      }
    }
    case 'SET_CHANNEL_PRIVACY': {
      return {
        ...state,
        isPrivate: action.isPrivate,
      }
    }
    case 'SET_CHANNEL_INFO': {
      const { chatroomData, members } = action;
      return {
        ...state,
        channelName: chatroomData.channelName,
        isPrivate: chatroomData.isPrivate,
        password: chatroomData.password === null ? null : '',
        newPassword: null,
        members: members.map(member => {
          const role = member.isAdmin ? (chatroomData.owner?.intraName === member.user.intraName ? 'owner' : 'admin') : 'member';
          const memberRole: ChannelMemberRole = {
            memberInfo: member.user,
            role: role,
          }
          return memberRole;
        })
      }
    }
    case 'IS_EDIT_CHANNEL': {
      return {
        ...state,
        isNewChannel: false,
      }
    }
    case 'RESET_ERRORS': {
      return {
        ...state,
        errors: [],
      }
    }
    case 'CLONE_STATE': {
      return action.state;
    }
    case 'RESET': {
      return newChannelInitialState;
    }
    default:
      return state
  }
}
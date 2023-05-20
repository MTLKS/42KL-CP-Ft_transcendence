import { UserData } from "../../../../model/UserData"

interface ChannelMemberRole {
  memberInfo: UserData,
  role: 'admin' | 'member' | 'owner'
}

export interface NewChannelState {
  members: ChannelMemberRole[],
  channelName: string,
  isPrivate: boolean,
  password: string,
}

export const newChannelInitialState: NewChannelState = {
  members: [],
  channelName: '',
  isPrivate: false,
  password: '',
}

export type NewChannelAction =
  | { type: 'SELECT_MEMBER', userInfo: UserData }
  | { type: 'DESELECT_MEMBER', userInfo: UserData }
  | { type: 'ASSIGN_AS_OWNER', userInfo: UserData }
  | { type: 'ASSIGN_AS_ADMIN', userInfo: UserData }
  | { type: 'ASSIGN_AS_MEMBER', userInfo: UserData}
  | { type: 'SET_CHANNEL_NAME', channelName: string }
  | { type: 'SET_CHANNEL_PRIVACY', isPrivate: boolean }
  | { type: 'SET_CHANNEL_PASSWORD', password: string }
  | { type: 'CREATE_CHATROOM' }

export default function newChannelReducer(state = newChannelInitialState, action: NewChannelAction): NewChannelState {
  switch (action.type) {
    case 'SELECT_MEMBER': {
      // by default select member as a member
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
      return {
        ...state,
        members: state.members.filter(member => member.memberInfo.intraName !== action.userInfo.intraName),
      }
    }
    case 'ASSIGN_AS_OWNER': {
      return {
        ...state,
        members: state.members.map(member => {
          if (member.memberInfo.intraName === action.userInfo.intraName) {
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
          if (member.memberInfo.intraName === action.userInfo.intraName) {
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
          if (member.memberInfo.intraName === action.userInfo.intraName) {
            return {
              ...member,
              role: 'member',
            }
          }
          return member
        }),
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
    case 'SET_CHANNEL_PRIVACY': {
      return {
        ...state,
        isPrivate: action.isPrivate,
      }
    }
    case 'CREATE_CHATROOM': {

    }
    default:
      return state
  }
}
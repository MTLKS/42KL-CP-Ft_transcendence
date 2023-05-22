import { UserData } from "../../../../model/UserData"

interface ChannelMemberRole {
  memberInfo: UserData,
  role: 'admin' | 'member' | 'owner'
}

export enum NewChannelError {
  INVALID_CHANNEL_NAME = 400,
  INVALID_PASSWORD = 410,
}

export interface NewChannelState {
  members: ChannelMemberRole[],
  channelName: string,
  isPrivate: boolean,
  password: string | null,
  errors: NewChannelError[],
}

export const newChannelInitialState: NewChannelState = {
  members: [],
  channelName: '',
  isPrivate: false,
  password: '',
  errors: [],
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
  | { type: 'ADD_ERROR', error: NewChannelError}
  | { type: 'RESET_ERRORS'}
  | { type: 'CREATE_CHANNEL' }
  | { type: 'RESET'};

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
    case 'SET_CHANNEL_PRIVACY': {
      return {
        ...state,
        isPrivate: action.isPrivate,
      }
    }
    case 'CREATE_CHANNEL': {
    }
    case 'RESET_ERRORS': {
      return {
        ...state,
        errors: [],
      }
    }
    case 'RESET': {
      return newChannelInitialState;
    }
    default:
      return state
  }
}
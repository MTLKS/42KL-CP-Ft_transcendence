import { UserData } from "../../../../model/UserData"

interface ChannelMemberRole {
  memberInfo: UserData,
  role: 'admin' | 'member' | 'owner'
}

enum NewChannelError {
  CHANNEL_NAME_EMPTY,
  CHANNEL_NAME_TOO_LONG,
  CHANNEL_NAME_TOO_SHORT,
  CHANNEL_PASSWORD_TOO_LONG,
  CHANNEL_PASSWORD_TOO_SHORT,
}

export interface NewChannelState {
  members: ChannelMemberRole[],
  channelName: string,
  isPrivate: boolean,
  password: string,
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
  | { type: 'SELECT_MEMBER', userInfo: UserData }
  | { type: 'DESELECT_MEMBER', userInfo: UserData }
  | { type: 'ASSIGN_AS_OWNER', userInfo: UserData }
  | { type: 'ASSIGN_AS_ADMIN', userInfo: UserData }
  | { type: 'ASSIGN_AS_MEMBER', userInfo: UserData}
  | { type: 'SET_CHANNEL_NAME', channelName: string }
  | { type: 'SET_CHANNEL_PRIVACY', isPrivate: boolean }
  | { type: 'SET_CHANNEL_PASSWORD', password: string }
  | { type: 'CREATE_CHANNEL' }

export default function newChannelReducer(state = newChannelInitialState, action: NewChannelAction): NewChannelState {
  switch (action.type) {
    case 'SELECT_MEMBER': {
      if (state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
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
      if (!state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
      return {
        ...state,
        members: state.members.filter(member => member.memberInfo.intraName !== action.userInfo.intraName),
      }
    }
    case 'ASSIGN_AS_OWNER': {
      if (!state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName && member.role === 'owner')) {
        return state;
      }
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
      if (!state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName && member.role === 'admin')) {
        return state;
      }
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
      if (!state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName && member.role === 'member')) {
        return state;
      }
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
    case 'CREATE_CHANNEL': {
      const newState = {...state}
      if (state.channelName === '') {
        newState.errors.push(NewChannelError.CHANNEL_NAME_EMPTY)
      }
      if (state.channelName.length > 16) {
        newState.errors.push(NewChannelError.CHANNEL_NAME_TOO_LONG)
      }
      if (state.channelName.length < 1) {
        newState.errors.push(NewChannelError.CHANNEL_NAME_TOO_SHORT)
      }
      if (state.password.length > 16) {
        newState.errors.push(NewChannelError.CHANNEL_PASSWORD_TOO_LONG)
      }
      if (state.password.length < 1) {
        newState.errors.push(NewChannelError.CHANNEL_PASSWORD_TOO_SHORT)
      }
      if (newState.errors.length === 0) {
        console.log("Create channel");
        return state;
      }
      return newState;
    }
    default:
      return state
  }
}
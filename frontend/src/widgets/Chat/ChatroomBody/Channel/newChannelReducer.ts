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
  WRONG_PASSWORD,
}

export interface NewChannelState {
  members: ChannelMemberRole[],
  inviteList: ChannelMemberRole[],
  channelName: string,
  isPrivate: boolean,
  isInviting: boolean,
  password: string | null,
  newPassword: string | null,
  isPasswordProtected: boolean,
  errors: NewChannelError[],
  isNewChannel: boolean,
  hasChanges: boolean,
  isOwner: boolean,
  isAdmin: boolean,
  isTryingToDeleteChannel: boolean,
  deleteConfirmed: boolean,
}

export const newChannelInitialState: NewChannelState = {
  members: [],
  inviteList: [],
  channelName: '',
  isPrivate: false,
  isInviting: false,
  isPasswordProtected: false,
  password: null,
  newPassword: null,
  errors: [],
  isNewChannel: true,
  hasChanges: false,
  isOwner: false,
  isAdmin: false,
  isTryingToDeleteChannel: false,
  deleteConfirmed: false,
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
  | { type: 'SET_HAS_CHANGES', payload: boolean }
  | { type: 'ADD_ERROR', error: NewChannelError }
  | { type: 'INVITE_MEMBER', userInfo: UserData } // by default, invite will just invite as member
  | { type: 'REMOVE_INVITE', userInfo: UserData }
  | { type: 'IS_EDIT_CHANNEL' }
  | { type: 'TOGGLE_IS_INVITING', isInviting: boolean }
  | { type: 'IS_OWNER', userInfo: UserData }
  | { type: 'IS_ADMIN', userInfo: UserData }
  | { type: 'RESET_ERRORS' }
  | { type: 'RESET_INVITE_LIST' }
  | { type: 'RESET' }
  | { type: 'CLONE_STATE', state: NewChannelState }
  | { type: 'IS_TRYING_TO_DELETE_CHANNEL' }
  | { type: 'CONFIRM_DELETE_CHANNEL' }

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
    case 'IS_OWNER': {
      const ownerData = state.members.find(member => member.role === 'owner');
      return {
        ...state,
        isOwner: ownerData?.memberInfo.intraName === action.userInfo.intraName,
      }
    }
    case 'TOGGLE_IS_INVITING': {
      return {
        ...state,
        isInviting: action.isInviting,
      }
    }
    case 'IS_ADMIN': {
      const isAdmin = state.members.find(member => member.memberInfo.intraName === action.userInfo.intraName && member.role === 'admin');
      return {
        ...state,
        isAdmin: isAdmin !== undefined,
      }
    }
    case 'INVITE_MEMBER': {
      if (state.inviteList.find(invitation => invitation.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
      return {
        ...state,
        inviteList: [...state.inviteList, { memberInfo: action.userInfo, role: 'member' }],
      }
    }
    case 'REMOVE_INVITE': {
      if (!state.inviteList.find(invitation => invitation.memberInfo.intraName === action.userInfo.intraName)) {
        return state;
      }
      return {
        ...state,
        inviteList: state.inviteList.filter(invitation => invitation.memberInfo.intraName !== action.userInfo.intraName),
      }
    }
    case 'RESET_ERRORS': {
      return {
        ...state,
        errors: [],
      }
    }
    case 'RESET_INVITE_LIST': {
      return {
        ...state,
        inviteList: [],
      }
    }
    case 'SET_HAS_CHANGES': {
      if (state.hasChanges === action.payload) {
        return state;
      }
      return {
        ...state,
        hasChanges: action.payload,
      }
    }
    case 'IS_TRYING_TO_DELETE_CHANNEL': {
      return {
        ...state,
        isTryingToDeleteChannel: !state.isTryingToDeleteChannel,
      }
    }
    case 'CONFIRM_DELETE_CHANNEL': {
      return {
        ...state,
        deleteConfirmed: !state.deleteConfirmed,
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
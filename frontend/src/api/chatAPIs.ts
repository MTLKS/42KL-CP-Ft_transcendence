import { AxiosResponse } from "axios"
import api from "./api"
import { CreateChannelData, InviteMemberData, UpdateChannelData, UpdateMemberData } from "../model/ChatRoomData";

const NAMESPACE = "/chat"
const CHANNEL_NAMESPACE = `${NAMESPACE}/room`

export function getChatroomList(): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/channel`);
}

export function getChatroomMessages(channelId: number, perPage: number, page: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/message/${channelId}?perPage=${perPage}&page=${page}`);
}

export function getMemberData(channelId: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/member/${channelId}`);
}

export function createChannel(createChannelData: CreateChannelData) {
  return api.post(`${CHANNEL_NAMESPACE}`, createChannelData);
}

export function updateChannel(updateChannelData: UpdateChannelData) {
  return api.patch(`${CHANNEL_NAMESPACE}`, updateChannelData);
}

export function inviteMemberToChannel(inviteMemberData: InviteMemberData) {
  return api.post(`${CHANNEL_NAMESPACE}/member`, inviteMemberData);
}

export function updateMemberRole(updateMemberData: UpdateMemberData) {
  return api.patch(`${CHANNEL_NAMESPACE}/member`, updateMemberData);
}

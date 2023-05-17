import { AxiosResponse } from "axios"
import api from "../api/api"

const NAMESPACE = "/chat"
const DM_NAMESPACE = "/dm"

export function getChatroomList(): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/dm/channel`);
}

export function getChatroomMessages(channelId: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/dm/message/${channelId}`);
}

export function getMemberData(channelId: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/member/${channelId}`);
}

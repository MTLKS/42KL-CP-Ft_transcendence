import { AxiosResponse } from "axios"
import api from "./api"

const NAMESPACE = "/chat"

export function getChatroomList(): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/channel`);
}

export function getChatroomMessages(channelId: number, perPage: number, page: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/message/${channelId}?perPage=${perPage}&page=${page}`);
}

export function getMemberData(channelId: number): Promise<AxiosResponse> {
  return api.get(`${NAMESPACE}/member/${channelId}`);
}

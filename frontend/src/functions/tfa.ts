import { ITFAData } from "../model/TfaData";
import Api from "../api/api";

export async function getTFA(): Promise<any> {
  return (await Api.get("/2fa")).data as ITFAData;
}

export async function removeTFA(): Promise<any> {
  return (await Api.delete("/2fa")).data as ITFAData;
}

export async function checkTFA(otp: string): Promise<any> {
  return (await Api.post("/2fa", { otp: otp })).data as ITFAData;
}

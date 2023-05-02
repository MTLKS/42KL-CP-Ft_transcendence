import { ITFAData } from "../modal/TfaData";
import Api from "../api/api";

async function getTFA(): Promise<any> {
	return (await Api.get("/2fa")).data as ITFAData;
}

export default getTFA
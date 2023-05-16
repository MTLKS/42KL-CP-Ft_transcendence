import { createContext } from 'react';
import SocketApi from '../api/socketApi';

interface UserData {
  accessToken: string;
  avatar: string;
  elo: number;
  intraId: number;
  intraName: string;
  tfaSecret: string | null;
  userName: string;
}

let myProfile: UserData = {
	accessToken: "hidden",
	avatar: "",
	elo: 400,
	intraId: 130305,
	intraName: "wricky-t",
	tfaSecret: null,
	userName: "JOHNDOE"
}

interface UserContextProps {
	defaultSocket: SocketApi,
	myProfile: UserData;
	setMyProfile: (profile: UserData) => void;
}

const UserContext = createContext<UserContextProps>({
	defaultSocket: new SocketApi(),
	myProfile: myProfile,
	setMyProfile: (profile) => { myProfile = profile }
});

export default UserContext;
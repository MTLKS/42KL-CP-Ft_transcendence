import { createContext } from 'react';
import { UserData } from '../model/UserData';

let myProfile: UserData = {
	accessToken: "hidden",
	avatar: "",
	elo: 400,
	intraId: 130305,
	intraName: "wricky-t",
	tfaSecret: null,
	userName: "JOHNDOE",
	winning: true
}

interface UserContextProps {
	myProfile: UserData;
	setMyProfile: (profile: UserData) => void;
}

const UserContext = createContext<UserContextProps>({
	myProfile: myProfile,
	setMyProfile: (profile) => { myProfile = profile }
});

export default UserContext;
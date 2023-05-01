import { createContext } from 'react';

interface UserData {
  accessToken: string;
  avatar: string;
  elo: number;
  intraId: number;
  intraName: string;
  tfaSecret: string | null;
  userName: string;
}

interface UserContextProps {
	myProfile: UserData | null;
	setMyProfile: (profile: UserData | null) => void;
}

const UserContext = createContext<UserContextProps>({
	myProfile: null,
	setMyProfile: () => {};
});

export default UserContext;
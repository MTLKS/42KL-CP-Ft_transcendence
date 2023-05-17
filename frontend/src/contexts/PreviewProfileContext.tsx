import { UserData } from '../model/UserData';
import { createContext } from 'react'

interface ProfileContextProps {
	setPreviewProfileFunction: (func: UserData) => void;
	setTopWidgetFunction: (func: any) => void;
}

const previewProfileContext = createContext<ProfileContextProps>({
	setPreviewProfileFunction: (func) => {},
	setTopWidgetFunction: (func) => {},
});

export default previewProfileContext;
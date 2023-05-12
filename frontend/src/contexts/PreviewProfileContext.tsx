import { UserData } from '../model/UserData';
import { createContext } from 'react'

interface ProfileContextProps {
	setPreviewProfileFunction: (func: UserData) => void;
	setTopWidgetFunction: (func: any) => void;
}

const PreviewProfileContext = createContext<ProfileContextProps>({
	setPreviewProfileFunction: (func) => { },
	setTopWidgetFunction: (func) => { },
});

export default PreviewProfileContext;
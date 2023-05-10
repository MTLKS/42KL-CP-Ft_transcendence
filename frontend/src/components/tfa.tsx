import { getTFA, removeTFA, checkTFA } from '../functions/tfa';
import { ITFAData } from '../modal/TfaData';
import React, { useEffect } from 'react'
import Card, { CardType } from './Card';

interface TFAProps {
	commands: string[];
}

enum TFACommands {
	help,
	set,
	unset,
	exist,
	success,
	fail,
	notset
}

function help() {
	return (
		<Card type={CardType.SUCCESS}>
			<span className=' text-2xl neonText-white font-bold'>TFA</span><br />
			<p>
				tfa set					: Sets and enables Google tfa<br />
				tfa unset [OTP code]	: Unsets and disable tfa (requires TFA code)<br />
				tfa [OTP code]			: Checks whether code is valid or not<br />
			</p>
		</Card>
	)
}

function Tfa(props: TFAProps) {
	
	const { commands } = props;
	const [tfa, setTfa] = React.useState<ITFAData>({} as ITFAData);
	const [result, setResult] = React.useState<TFACommands>(TFACommands.exist);
	
	if (commands.length === 2 && commands[1] === "set") {
		useEffect(() => {
			getTFA().then((data) => {
				setTfa(data);
				setResult(data.qr === null && data.secretKey === null ? TFACommands.exist : TFACommands.set)
			})
		}, [])
	} else if (commands.length === 3 && commands[1] === "unset" && commands[2].length === 6 && commands[2].match(/^[0-9]+$/) !== null) {
		useEffect(() => {
			setResult(TFACommands.fail)
			checkTFA(commands[2]).then((res) => {
				res.error !== undefined ? setResult(TFACommands.notset) : 
					removeTFA(commands[2]).then(() => { setResult(TFACommands.unset)})
			})
		}, [])
	} else if (commands.length === 2 && commands[1].length === 6 && commands[1].match(/^[0-9]+$/) !== null) {
		useEffect(() => {
			checkTFA(commands[1]).then((res) => {
				setResult(res.error !== undefined ? TFACommands.notset : res.boolean ? TFACommands.success : TFACommands.fail)
			})
		}, [])
	} else {
		return help();
	}

	if (result === TFACommands.set) {
		return (
			<Card type={CardType.SUCCESS}>
				<figure>
					<p className='text-center'>Scan QR code with your Google Authenticator app</p>
					<img src={tfa.qr} className='rounded-md mx-auto object-cover'></img>
					<p className='text-center'> or use secret key: {tfa.secretKey}</p>
				</figure>
			</Card>
		);
	} else if (result === TFACommands.unset) {
		return (<Card type={CardType.SUCCESS}><p>TFA unset and disabled</p></Card>);
	} else if (result === TFACommands.exist) {
		return (<Card type={CardType.ERROR}><p>TFA already set</p></Card>);
	} else if (result === TFACommands.success) {
		return (<Card type={CardType.SUCCESS}><p>TFA OTP is correct</p></Card>);
	} else if (result === TFACommands.fail) {
		return (<Card type={CardType.ERROR}><p>TFA OTP is incorrect</p></Card>);
	} else if (result === TFACommands.notset) {
		return (<Card type={CardType.ERROR}><p>TFA is not set</p></Card>);
	}
	return help();
}

export default Tfa
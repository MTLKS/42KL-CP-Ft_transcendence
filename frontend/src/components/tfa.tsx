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
	fail
}

function help() {
	return (
		<Card type={CardType.SUCCESS}>
			<span className=' text-2xl neonText-white font-bold'>TFA</span><br />
			<p>
				tfa set			: Sets and enables tfa<br />
				tfa reset		: Generates a new tfa<br />
				tfa unset		: Unsets and disable tfa<br />
				tfa [code]		: Checks whether code is valid or not<br />
			</p>
		</Card>
	)
}

function Tfa(props: TFAProps) {
	
	const { commands } = props;
	const [tfa, setTfa] = React.useState<ITFAData>({} as ITFAData);
	const [result, setResult] = React.useState<TFACommands>(TFACommands.exist);
	
	if (commands.length === 2) {
		if (commands[1] === "set") {
			console.log(commands[1])
			useEffect(() => {
				console.log("Using")
				getTFA().then((data) => {
					setTfa(data);
					setResult(data.qr === null && data.secretKey === null ? TFACommands.exist : TFACommands.set)
				})
			}, [])
		} else if (commands[1] === "unset") {
			useEffect(() => {
				removeTFA().then(() => {
					setResult(TFACommands.unset)
				})
			}, [])
		} else if (commands[1].length === 6 && commands[1].match(/^[0-9]+$/) !== null) {
			useEffect(() => {
				checkTFA(commands[1]).then((data) => {
					console.log(data);
					setResult(data.boolean ? TFACommands.success : TFACommands.fail)
				})
			}, [])
		} else {
			return help();
		}
	} else {
		return help();
	}

	if (result === TFACommands.set) {
		return (
			<Card type={CardType.SUCCESS}>
				<figure>
					<img src={tfa.qr} className='rounded-md mx-auto object-cover'></img>
					<p className='text-center'>SECRET: {tfa.secretKey}</p>
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
	}
	return help();
}

export default Tfa
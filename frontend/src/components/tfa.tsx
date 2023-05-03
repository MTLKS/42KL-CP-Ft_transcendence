import { getTFA, removeTFA } from '../functions/tfa';
import { ITFAData } from '../modal/TfaData';
import React, { useEffect } from 'react'

interface TFAProps {
	commands: string[];
}

enum TfaCommands {
	help,
	set,
	unset,
	exist
}

function Tfa(props: TFAProps) {
	
	const { commands } = props;
	const [tfa, setTfa] = React.useState<ITFAData>({} as ITFAData);
	const [result, setResult] = React.useState<TfaCommands>(TfaCommands.exist);
	
	if (commands.length === 2) {
		if (commands[1] === "set") {
			useEffect(() => {
				console.log("Using")
				getTFA().then((data) => {
					setTfa(data);
					setResult(data.qr === null && data.secretKey === null ? TfaCommands.exist : TfaCommands.set)
				})
			}, [])
		} else if (commands[1] === "unset") {
			useEffect(() => {
				removeTFA().then(() => {
					setResult(TfaCommands.unset)
				})
			}, [])
		} else if (commands[1] === "reset") {
			console.log("reset");
			return (
				<p>
					{commands[1]}
				</p>
			)
		} else if (commands[1].length === 6 && commands[1].match(/^[0-9]+$/) !== null) {
			console.log("Check");
			return (
				<p>
					{commands[1]}
				</p>
			)
		}
	}

	if (result === TfaCommands.set) {
		return (
			<figure>
				<img src={tfa.qr} className='rounded-md mx-auto object-cover'></img>
				<p className='text-center'>SECRET: {tfa.secretKey}</p>
			</figure>
		)
	} else if (result === TfaCommands.unset) {
		return (<p>TFA unset and disabled</p>)
	} else if (result === TfaCommands.exist) {
		return (<p>TFA already set, use command "tfa unset" to disable tfa</p>)
	}
	return (
		<p>
			tfa set			: Sets and enables tfa<br />
			tfa reset		: Generates a new tfa<br />
			tfa unset		: Unsets and disable tfa<br />
			tfa [code]		: Checks whether code is valid or not<br />
		</p>
	)
}

export default Tfa

// tfa => tfa help
// tfa set => Sets and enables tfa
// tfa 123456 => Checks whether the code is valid or not
// tfa unset => Disables tfa
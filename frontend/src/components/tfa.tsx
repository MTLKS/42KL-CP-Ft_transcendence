import { ITFAData } from '../modal/TfaData';
import React, { useEffect } from 'react'
import getTFA from '../functions/tfa';
import { flushSync } from 'react-dom';

interface TfaProps {
	commands: string[];
}

enum TfaCommands {
	"help",
	"set",
	"exist"
}

function Tfa(props: TfaProps) {
	
	const { commands } = props;
	const [tfa, setTfa] = React.useState<ITFAData>({} as ITFAData);
	const [test, setTest] = React.useState<TfaCommands>(TfaCommands.help);
	
	console.log(commands);
	if (commands.length === 2) {
		if (commands[1] === "set")
			useEffect(() => { getTFA().then((data) => { setTest(data.qr === null && data.secretKey === null ? TfaCommands.exist : TfaCommands.set ) }) }), []
		} else if (commands[1] === "reset") {
			console.log("Reset");
			return (
				<p>
					{commands[1]}
				</p>
			)
		} else if (commands[1] === "unset") {
			console.log("Unset");
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

	if (test === TfaCommands.help) {
		return (
			<p>
				tfa set			: Sets and enables tfa<br />
				tfa reset		: Generates a new tfa<br />
				tfa unset		: Unsets and disable tfa<br />
				tfa [code]		: Checks whether code is valid or not<br />
			</p>
		)
	} else if (test === TfaCommands.set) {
		return (
			<figure>
				<img src={tfa.qr} className='rounded-md mx-auto object-cover h-48'></img>
				<p className='text-center'>SECRET: {tfa.secretKey}</p>
			</figure>
		)
	} else if (test === TfaCommands.exist) {
		return (
			<p>
				TFA already set, use tfa unset to disable tfa
			</p>
		)
	}
}

export default Tfa

// tfa => tfa help
// tfa set => Sets and enables tfa
// tfa 123456 => Checks whether the code is valid or not
// tfa unset => Disables tfa
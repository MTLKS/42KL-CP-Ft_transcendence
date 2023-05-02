import { ITFAData } from '../modal/TfaData';
import React, { useEffect } from 'react'
import getTFA from '../functions/tfa';

function Tfa() {
	
	const [tfa, setTfa] = React.useState<ITFAData>({} as ITFAData);
	useEffect(() => {
		getTFA().then((data) => {
			setTfa(data);
		})
	}, [])
	return (
		<figure>
			<img src={tfa.qr} className='rounded-md mx-auto min-w-128 min-h-128 object-cover'></img>
			<p className='text-center'>SECRET: {tfa.secretKey}</p>
		</figure>
	)
}

export default Tfa
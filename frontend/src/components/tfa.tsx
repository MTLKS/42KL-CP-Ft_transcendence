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
			<img src={tfa.qr} className='rounded-md mx-auto object-cover h-48'></img>
			<p className='text-center'>SECRET: {tfa.secretKey}</p>
		</figure>
	)
}

export default Tfa
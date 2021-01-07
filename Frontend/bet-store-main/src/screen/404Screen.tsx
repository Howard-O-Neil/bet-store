import React, { useState } from 'react'
import { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import styles from '../styles/Notfound.module.scss'

export const Page404Screen = () => {
	const history = useHistory();
	const [timeRedirect, setTimeRedirect] = useState(3);
	const [IsDirect, setIsDirect] = useState(false);
	const [IntervalID, setIntervalID] = useState<NodeJS.Timeout>();
	let k = 3;
	let id:NodeJS.Timeout;
	useEffect(() => {
		 // eslint-disable-next-line react-hooks/exhaustive-deps
		 id = setInterval(
			() => {
				if (k <= 0) {
					setIsDirect(true);
					clearInterval(id);
					return;
				}
				setTimeRedirect(--k);
			}, 1000);
		return clearInterval();
	}, [])

	if (IsDirect === true)
		return (
			<Redirect to="/" />
		);

	return (
		<div className={styles.body} >
			<div className={styles.mainbox}>
				<div className={styles.err}>4</div>
				<i className="far fa-question-circle fa-spin"></i>
				<div className={styles.err2}>4</div>
				<div className={styles.msg}>
					Sorry, the page you are looking for could not be found.
					<br />
					Page redirect in {timeRedirect} sec
				</div>
			</div>
		</div>
	);

}
import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { generateHTMLFromJSON } from '../components/utils';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCe-aiLQ1sJq3BoLd34o4ohrHUZhPt09aA',
	authDomain: 'irrigation-management-app.firebaseapp.com',
	databaseURL: 'https://irrigation-management-app.firebaseio.com',
	projectId: 'irrigation-management-app',
	storageBucket: 'irrigation-management-app.appspot.com',
	messagingSenderId: '714577690981',
	appId: '1:714577690981:web:b2ccd0a1cbf178c5a1218c',
};

const cacheRtl = createCache({
	key: 'muirtl',
	stylisPlugins: [prefixer, rtlPlugin],
});

const Home = () => {
	const [reading, setReading] = useState('N/A');
	const invoiceObj = useRef({ SCALER_NAME: '', SCALER_PHONE: '', ORIGIN: '', DESTINATION: '', DRIVER_NAME: '', VEHICLE_NUMBER: '', TARE_WEIGHT: '', MATERIAL_TYPE: '', MORE_INFO: '' });

	useEffect(() => {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const db = getDatabase(app);
		const weight = ref(db, '/weight');
		onValue(weight, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			setReading(data);
		});
		return () => {};
	}, []);

	const getCurrentDate = () => {
		let day = new Date().getDate();
		let month = new Date().getMonth() + 1;
		let year = new Date().getFullYear();
		return day + '-' + month + '-' + year;
	};

	const getCurrentTime = () => {
		let hours = new Date().getHours();
		let min = new Date().getMinutes();
		let sec = new Date().getSeconds();
		return hours + ':' + min + ':' + sec;
	};

	const handleSaveButton = () => {
		console.table(invoiceObj.current);
		let localTareWeight = invoiceObj.current['TARE_WEIGHT'];
		if (['', 0].includes(localTareWeight)) {
			localTareWeight = 0;
		}
		localTareWeight = parseInt(localTareWeight);

		let netWeight = reading - localTareWeight;
		invoiceObj.current['NET_WEIGHT'] = netWeight;
		invoiceObj.current['TOTAL_WEIGHT'] = reading;
		invoiceObj.current['DATE_NOW'] = getCurrentDate();
		invoiceObj.current['HOUR_NOW'] = getCurrentTime();
		let mywin = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
		mywin.document.write(generateHTMLFromJSON(invoiceObj.current));
		mywin.print();
	};

	return (
		<CacheProvider value={cacheRtl}>
			<div style={styles.container}>
				<div style={styles.weightIndicator}>
					<Typography variant='h3' style={styles.weightReading}>
						{reading} KG
					</Typography>
				</div>
				<div style={styles.pdfInputs} dir='rtl'>
					<TextField id='outlined-basic' label='שם השוקל' variant='outlined' onChange={(e) => (invoiceObj.current['SCALER_NAME'] = e.target.value)} />
					<TextField id='outlined-basic' label='מספר טלפון' variant='outlined' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={(e) => (invoiceObj.current['SCALER_PHONE'] = e.target.value)} />
					<TextField id='outlined-basic' label='מקור' variant='outlined' onChange={(e) => (invoiceObj.current['ORIGIN'] = e.target.value)} />
					<TextField id='outlined-basic' label='יעד' variant='outlined' onChange={(e) => (invoiceObj.current['DESTINATION'] = e.target.value)} />
					<TextField id='outlined-basic' label='שם הנהג' variant='outlined' onChange={(e) => (invoiceObj.current['DRIVER_NAME'] = e.target.value)} />
					<TextField id='outlined-basic' label='מספר רכב' variant='outlined' onChange={(e) => (invoiceObj.current['VEHICLE_NUMBER'] = e.target.value)} />
					<TextField id='outlined-basic' label='משקל טרה' variant='outlined' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={(e) => (invoiceObj.current['TARE_WEIGHT'] = e.target.value)} />
					<TextField id='outlined-basic' label='סוג החומר' variant='outlined' onChange={(e) => (invoiceObj.current['MATERIAL_TYPE'] = e.target.value)} />
					<TextField id='outlined-basic' label='פרטים נוספים' variant='outlined' onChange={(e) => (invoiceObj.current['MORE_INFO'] = e.target.value)} />
					<Button style={{ backgroundColor: greenSuccess }} variant='contained' onClick={handleSaveButton}>
						שמור
					</Button>
				</div>
			</div>
		</CacheProvider>
	);
};

const bluePrimary = '#1890ff';
const greenSuccess = '#52c41a';

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		height: '100vh',
		backgroundColor: 'white',
	},
	weightIndicator: {
		display: 'flex',
		flex: 1,
		backgroundColor: bluePrimary,
		marginBottom: 10,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	weightReading: {
		color: 'white',
	},
	pdfInputs: {
		display: 'flex',
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: 'grey',
		borderRadius: 20,
		flex: 5,
	},
	saveBTN: {},
};

export default Home;

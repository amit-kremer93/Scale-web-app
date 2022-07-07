import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';

// markup

const IndexPage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				{/* <Route path='invoice' element={<Invoice invoiceObj={data} />} /> */}
			</Routes>
		</BrowserRouter>
	);
};

export default IndexPage;

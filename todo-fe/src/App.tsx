import { Suspense, useState } from 'react';
import { MainContainer } from './components/main';
import { LinearProgress, Stack } from '@mui/material';
import { Loading } from './utils/Loading';

function App() {
	return (
		<Suspense fallback={<Loading />}>
			<MainContainer />;
		</Suspense>
	);
}

export default App;

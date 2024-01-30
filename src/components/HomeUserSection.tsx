import React from 'react';
import {UserDataResult} from '../services/queries/home';
import {Stats} from './Stats';

export const HomeUserSection: React.FC<{ userData?: UserDataResult }> = ({userData}) => {
	return (
		<>
			{userData?.stats && <Stats stats={userData.stats} label="Collections"/>}
			{userData?.favorites && <Stats stats={userData.favorites} label="Favorites"/>}
			{userData?.played && <Stats stats={userData.played} label="Played"/>}
		</>
	);
};

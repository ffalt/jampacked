import React from 'react';
import { Stats } from '../components/Stats';
import { UserDataResult } from '../services/queries/home';

export const HomeUserSection: React.FC<{ userData?: UserDataResult }> = ({ userData }) => (
	<>
		{userData?.stats && <Stats stats={userData.stats} label="Collections" />}
		{userData?.favorites && <Stats stats={userData.favorites} label="Favorites" />}
		{userData?.played && <Stats stats={userData.played} label="Played" />}
	</>
);

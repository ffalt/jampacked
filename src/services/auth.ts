import React, {useContext} from 'react';
import dataService from './data';
import {Jam} from './jam';
import FastImage, {Source} from 'react-native-fast-image';

export interface Auth {
	hasUser: boolean,
	user?: Jam.SessionUser,
	isLoading: boolean,
	currentUserID: () => string;
	currentUserName: () => string;
	imgSource: (id: string, size: number) => Source | undefined;
	login: (server: string, name: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const defaultAuth: Auth = {
	hasUser: false,
	user: undefined,
	isLoading: true,
	currentUserID: (): string => dataService.currentUserID,
	currentUserName: (): string => dataService.currentUserName,
	imgSource: (id: string, size: number): Source | undefined => {
		if (!id || !dataService.jam.auth.isLoggedIn()) {
			return;
		}
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		return {
			uri: dataService.jam.image.imageUrl({id, size}, !headers),
			headers,
			priority: FastImage.priority.normal
		};
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	login: async (server: string, name: string, password: string): Promise<void> => {
		// dummy
	},
	logout: async (): Promise<void> => {
		// dummy
	}
};

export const AuthContext = React.createContext<Auth>(defaultAuth);

export const useAuth = (): Auth => useContext<Auth>(AuthContext);

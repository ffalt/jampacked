import React, {useContext} from 'react';
import dataService from './data';
import {ImageFormatType, Jam} from './jam';
import FastImage, {Source} from 'react-native-fast-image';

export interface Auth {
	hasUser: boolean,
	user?: Jam.SessionUser,
	currentUserID: () => string;
	currentUserName: () => string;
	imgSource: (id: string, size: number, format?: ImageFormatType) => Source | undefined;
	login: (server: string, name: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const defaultAuth: Auth = {
	hasUser: false,
	user: undefined,
	currentUserID: (): string => dataService.currentUserID,
	currentUserName: (): string => dataService.currentUserName,
	imgSource: (id: string, size: number, format?: ImageFormatType): Source | undefined => {
		if (!id || !dataService.jam.auth.isLoggedIn()) {
			return;
		}
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		return {
			uri: dataService.jam.image.imageUrl({id, size, format}, !headers),
			headers,
			priority: FastImage.priority.normal
		};
	},
	login: async (_server: string, _name: string, _password: string): Promise<void> => {
		// dummy
	},
	logout: async (): Promise<void> => {
		// dummy
	}
};

export const AuthContext = React.createContext<Auth>(defaultAuth);

export const useAuth = (): Auth => useContext<Auth>(AuthContext);

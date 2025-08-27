import React, { useContext } from 'react';
import jamService from './jam.service.ts';
import FastImage, { Source } from '@d11/react-native-fast-image';
import { ImageFormatType, Jam } from './jam';

export interface Auth {
	hasUser: boolean;
	user?: Jam.SessionUser;
	currentUserID: () => string;
	currentUserName: () => string;
	imgSource: (id: string, size: number, format?: ImageFormatType) => Source | undefined;
	login: (server: string, name: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const defaultAuth: Auth = {
	hasUser: false,
	user: undefined,
	currentUserID: (): string => jamService.auth?.user?.id ?? '',
	currentUserName: (): string => jamService.auth?.user?.name ?? '',
	imgSource: (id: string, size: number, format?: ImageFormatType): Source | undefined => {
		if (!id || !jamService.auth.isLoggedIn()) {
			return;
		}
		const headers = jamService.auth?.auth?.token ? { Authorization: `Bearer ${jamService.auth?.auth?.token}` } : undefined;
		return {
			uri: jamService.image.imageUrl({ id, size, format }, !headers),
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

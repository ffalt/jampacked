import { AlbumType } from '../services/jam';

export interface NavigParameters {
	id?: string;
	name?: string;
	albumType?: AlbumType;
	listType?: string;
}

export interface Navig {
	route: string;
	params?: NavigParameters;
}

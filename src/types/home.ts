export interface HomeEntry {
	id: string;
	name: string;
	route: string;
}

export interface HomeData {
	artistsRecent?: Array<HomeEntry>;
	artistsFaved?: Array<HomeEntry>;
	albumsFaved?: Array<HomeEntry>;
	albumsRecent?: Array<HomeEntry>;
}

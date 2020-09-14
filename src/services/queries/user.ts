import gql from 'graphql-tag';
import {UserResult, UserResult_currentUser_stats_favorite, UserResult_currentUser_stats_played} from './types/UserResult';
import {HomeStatsData} from '../types';
import {AlbumType, ListType} from '../jam';
import {JamRouteLinks} from '../../navigators/Routes';
import {DocumentNode} from 'graphql';

const GET_USERDATA = gql`
    query UserResult {
        currentUser {
            stats {
                bookmark
                playlist
                favorite {
                    album
                    albumTypes {
                        album
                        artistCompilation
                        audiobook
                        compilation
                        series
                        single
                        soundtrack
                        ep
                        live
                        bootleg
                        unknown
                    }
                    artist
                    artistTypes {
                        album
                    }
                    folder
                    series
                    track
                }
                played {
                    album
                    albumTypes {
                        album
                        artistCompilation
                        audiobook
                        compilation
                        series
                        single
                        soundtrack
                        ep
                        live
                        bootleg
                        unknown
                    }
                    artist
                    artistTypes {
                        album
                    }
                    folder
                    series
                    track
                }
            }
        }
    }
`;

export interface UserDataResult {
	stats: HomeStatsData;
	favorites: HomeStatsData;
	played: HomeStatsData;
}

function transformSectionStats(stats: UserResult_currentUser_stats_played | UserResult_currentUser_stats_favorite, listType: ListType): HomeStatsData {
	return [
		{link: JamRouteLinks.artistlist(listType), value: stats.artistTypes.album},
		{link: JamRouteLinks.albumlist(listType, AlbumType.album), value: stats.albumTypes.album},
		{link: JamRouteLinks.albumlist(listType, AlbumType.compilation), value: stats.albumTypes.compilation},
		{link: JamRouteLinks.serieslist(listType), value: stats.series},
		{link: JamRouteLinks.albumlist(listType, AlbumType.audiobook), value: stats.albumTypes.audiobook},
		{link: JamRouteLinks.albumlist(listType, AlbumType.soundtrack), value: stats.albumTypes.soundtrack},
		{link: JamRouteLinks.albumlist(listType, AlbumType.live), value: stats.albumTypes.live},
		{link: JamRouteLinks.albumlist(listType, AlbumType.bootleg), value: stats.albumTypes.bootleg},
		{link: JamRouteLinks.albumlist(listType, AlbumType.ep), value: stats.albumTypes.ep},
		{link: JamRouteLinks.albumlist(listType, AlbumType.single), value: stats.albumTypes.single},
		{link: JamRouteLinks.folderlist(listType), value: stats.folder},
		{link: JamRouteLinks.tracklist(listType), value: stats.track},
	].filter(t => t.value > 0);
}

function transformData(data?: UserResult): UserDataResult | undefined {
	if (!data?.currentUser) {
		return;
	}
	const stats = data.currentUser.stats;
	const base: HomeStatsData = [
		{link: JamRouteLinks.bookmarks(), value: stats.bookmark},
		{link: JamRouteLinks.playlists(), value: stats.playlist}
	].filter(t => t.value !== undefined);
	const favorites: HomeStatsData = transformSectionStats(stats.favorite, ListType.faved);
	const played: HomeStatsData = transformSectionStats(stats.played, ListType.recent);
	return {stats: base, favorites, played};
}

function transformVariables(): void {
	return;
}

export const UserQuery: {
	query: DocumentNode;
	transformData: (d?: UserResult, variables?: void) => UserDataResult | undefined;
	transformVariables: (id: string) => void;
} = {query: GET_USERDATA, transformData, transformVariables};


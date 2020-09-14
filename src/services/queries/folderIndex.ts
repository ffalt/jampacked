import gql from 'graphql-tag';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback} from 'react';
import {FolderIndexResult, FolderIndexResultVariables} from './types/FolderIndexResult';
import {useCacheOrLazyQuery} from '../data';

const GET_FOLDERINDEX = gql`
    query FolderIndexResult($level: Int) {
        folderIndex(filter: {level: $level}) {
            groups {
                name
                items {
                    id
                    name
                    tracksCount
                    folderType
                    childrenCount
                }
            }
        }
    }
`;

function titleCase(s: string): string {
	return s[0].toUpperCase() + s.slice(1);
}

function transformData(data?: FolderIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.folderIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			const desc = `${titleCase(entry.folderType || '')}`;
			// `${(entry.tracksCount || 0) > 0 ? `Tracks: ${entry.tracksCount}` :
			// (@(entry.childrenCount || 0) > 0 ? `Folder: ${entry.childrenCount}` : '')}`;
			index.push({
				id: entry.id,
				objType: JamObjectType.folder,
				desc,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}

export const useLazyFolderIndexQuery = (): [(level: number, forceRefresh?: boolean) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderIndexResult, FolderIndexResultVariables, Index>(GET_FOLDERINDEX, transformData);
	const get = useCallback((level: number, forceRefresh?: boolean): void => {
		query({variables: {level}}, forceRefresh);
	}, [query]);
	return [
		get,
		{
			loading,
			called,
			error,
			index: data
		}
	];
};

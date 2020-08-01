import gql from 'graphql-tag';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback, useEffect, useState} from 'react';
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

function transformData(data?: FolderIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.folderIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			const desc = (entry.folderType || '') + ' ' + (
				(entry.tracksCount || 0) > 0 ? `Tracks: ${entry.tracksCount}` :
					((entry.childrenCount || 0) > 0 ? `Folder: ${entry.childrenCount}` : '')
			);
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
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useCacheOrLazyQuery<FolderIndexResult, FolderIndexResultVariables>(GET_FOLDERINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	const get = useCallback((level: number, forceRefresh?: boolean): void => {
		query({variables: {level}}, forceRefresh);
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			index
		}
	];
};

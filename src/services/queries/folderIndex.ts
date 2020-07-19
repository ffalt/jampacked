import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {FolderType, JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {Index} from '../types';
import {useCallback, useEffect, useState} from 'react';
import {FolderIndexResult, FolderIndexResultVariables} from './types/FolderIndexResult';

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

export const useLazyFolderIndexQuery = (): [(level: number) => void,
	{ loading: boolean, error?: ApolloError, index?: Index, called: boolean }
] => {
	const [index, setIndex] = useState<Index | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<FolderIndexResult, FolderIndexResultVariables>(GET_FOLDERINDEX);

	useEffect(() => {
		setIndex(transformData(data));
	}, [data]);

	const get = useCallback((level: number): void => {
		query({variables: {level}});
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

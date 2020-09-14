import gql from 'graphql-tag';
import {JamObjectType} from '../jam';
import {Index} from '../types';
import {FolderIndexResult, FolderIndexResultVariables} from './types/FolderIndexResult';
import {titleCase} from '../../utils/format.utils';
import {DocumentNode} from 'graphql';

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

function transformVariables(level: number): FolderIndexResultVariables {
	return {level};
}

export const FolderIndexQuery: {
	query: DocumentNode;
	transformData: (d?: FolderIndexResult, variables?: FolderIndexResultVariables) => Index | undefined;
	transformVariables: (level: number) => FolderIndexResultVariables;
} = {query: GET_FOLDERINDEX, transformData, transformVariables};


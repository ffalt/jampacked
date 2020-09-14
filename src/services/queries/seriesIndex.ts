import gql from 'graphql-tag';
import {Index} from '../types';
import {JamObjectType} from '../jam';
import {SeriesIndexResult} from './types/SeriesIndexResult';
import {DocumentNode} from 'graphql';

const GET_SERIESINDEX = gql`
    query SeriesIndexResult {
        seriesIndex {
            groups {
                name
                items {
                    id
                    name
                    albumsCount
                }
            }
        }
    }
`;

function transformData(data?: SeriesIndexResult): Index | undefined {
	if (!data) {
		return;
	}
	const index: Index = [];
	data.seriesIndex.groups.forEach(group => {
		group.items.forEach(entry => {
			index.push({
				id: entry.id,
				objType: JamObjectType.series,
				desc: `Episodes: ${entry.albumsCount}`,
				title: entry.name,
				letter: group.name
			});
		});
	});
	return index;
}


function transformVariables(): void {
	return;
}

export const SeriesIndexQuery: {
	query: DocumentNode;
	transformData: (d?: SeriesIndexResult, variables?: void) => Index | undefined;
	transformVariables: () => void;
} = {query: GET_SERIESINDEX, transformData, transformVariables};


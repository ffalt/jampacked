import React, { useCallback, useEffect } from 'react';
import { FoldersRoute, FoldersRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { useLazyFolderIndexQuery } from '../services/queries/folderIndex';
import { JamRouteLinks } from '../navigators/Routes';
import { ListType } from '../services/jam';

export const FolderIndexScreen: React.FC<FoldersRouteProps<FoldersRoute.INDEX>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyFolderIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex(1);
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(1, true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
	}

	return (
		<IndexList
			index={index}
			title="Folders"
			called={called}
			refreshing={loading}
			onRefresh={reload}
			goRight={JamRouteLinks.folderlist(ListType.faved)}
		/>
	);
};

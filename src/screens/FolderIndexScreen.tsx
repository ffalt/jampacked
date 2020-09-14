import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {ErrorView} from '../components/ErrorView';
import {useLazyFolderIndexQuery} from '../services/queries/folderIndex.hook';

export const FolderIndexScreen: React.FC<HomeRouteProps<HomeRoute.FOLDERS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyFolderIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex(1);
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(1, true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<IndexList
			index={index}
			title="Folders"
			titleIcon="folder"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};

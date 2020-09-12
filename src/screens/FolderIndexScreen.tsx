import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyFolderIndexQuery} from '../services/queries/folderIndex';
import {ErrorView} from '../components/ErrorView';

export const FolderIndexScreen: React.FC<HomeStackProps<HomeRoute.FOLDERS>> = () => {
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
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};

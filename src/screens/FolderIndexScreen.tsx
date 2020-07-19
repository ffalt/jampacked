import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyFolderIndexQuery} from '../services/queries/folderIndex';
import {snackError} from '../services/snack';

export const FolderIndexScreen: React.FC<HomeStackProps<HomeRoute.FOLDERS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyFolderIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex(1);
		}
	}, [getIndex, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getIndex(1);
	}, [getIndex]);

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

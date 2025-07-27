import React, { useCallback, useState } from 'react';
import { SearchQuick } from './SearchQuick';
import { Search } from './Search';
import { StyleSheet, View } from 'react-native';
import { JamObjectType } from '../services/jam';

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export const SearchResults: React.FC<{ search?: string }> = ({ search }) => {
	const [objectType, setObjectType] = useState<JamObjectType | undefined>();

	const setObjectTypeSearch = useCallback((ot?: JamObjectType): void => {
		setObjectType(ot);
	}, []);

	const backToAll = (): void => {
		setObjectType(undefined);
	};

	const searchContent = objectType ?
		(<Search query={search} objType={objectType} backToAll={backToAll} />) :
		(<SearchQuick query={search} setObjType={setObjectTypeSearch} />);

	return (
		<View style={styles.container}>
			{searchContent}
		</View>
	);
};

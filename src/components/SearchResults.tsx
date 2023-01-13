import React, {useCallback, useState} from 'react';
import {SearchQuick} from './SearchQuick';
import {Search} from './Search';
import {StyleSheet, View} from 'react-native';
import {JamObjectType} from '../services/jam';

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export const SearchResults: React.FC<{ search?: string}> = ({search}) => {
	const [objType, setObjType] = useState<JamObjectType | undefined>();

	const setObjectTypeSearch = useCallback((ot?: JamObjectType): void => {
		setObjType(ot);
	}, []);

	const backToAll = (): void => {
		setObjType(undefined);
	};

	const searchContent = !objType
		? (<SearchQuick query={search} setObjType={setObjectTypeSearch}/>)
		: (<Search query={search} objType={objType} backToAll={backToAll}/>);

	return (
		<View style={styles.container}>
			{searchContent}
		</View>
	);
};

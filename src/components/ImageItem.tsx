import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useTheme } from '../style/theming';
import { NavigationService } from '../navigators/navigation';
import { BaseEntry } from '../services/types';
import { useAuth } from '../services/auth';

const styles = StyleSheet.create({
	image: { flex: 1 }
});

export const ImageItem: React.FC<{ item: BaseEntry; size: number }> = React.memo(({ item, size }) => {
	const theme = useTheme();
	const auth = useAuth();

	const handleClick = useCallback((): void => {
		const { id, title, objType } = item;
		NavigationService.navigateObj(objType, id, title);
	}, [item]);

	const source = React.useMemo(() => auth.imgSource(item?.id, 300), [item, auth]);

	if (!item || !item.id || !source || !source.uri) {
		return (<></>);
	}
	return (
		<TouchableOpacity
			onPress={handleClick}
			style={{
				height: size,
				width: size,
				backgroundColor: theme.background
			}}
		>
			<FastImage
				style={styles.image}
				source={source}
				resizeMode={FastImage.resizeMode.contain}
			/>
		</TouchableOpacity>
	);
});

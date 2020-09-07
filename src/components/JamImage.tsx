import React from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';
import {useAuth} from '../services/auth';

export const JamImage: React.FC<{ id: string, size: number, requestSize?: number, style?: StyleProp<ImageStyle> }> = React.memo(({id, requestSize, size, style}) => {
	const auth = useAuth();
	const source = React.useMemo(() => auth.imgSource(id, requestSize || 80), [auth, id, requestSize]);

	if (!source || !source.uri) {
		return (<></>);
	}
	return (
		<FastImage
			style={[{height: size, width: size}, style]}
			source={source}
			resizeMode={FastImage.resizeMode.contain}
		/>
	);
});

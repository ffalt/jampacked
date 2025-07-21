import React, { useEffect, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatDuration } from '../utils/duration.utils';

export const DurationText: React.FC<{ duration?: number; ms?: boolean; style?: StyleProp<TextStyle> }> = ({ style, duration, ms }) => {
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		setValue(formatDuration(ms ? (duration || 0) * 1000 : duration));
	}, [duration, ms]);

	return (
		<ThemedText style={style}>{value}</ThemedText>
	);
};

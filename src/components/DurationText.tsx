import React, {useEffect, useState} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {ThemedText} from './ThemedText';
import {formatDuration} from '../utils/duration.utils';

export const DurationText: React.FC<{ duration?: number, style?: StyleProp<TextStyle> }> = ({style, duration}) => {
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		setValue(formatDuration(duration));
	}, [duration]);

	return (
		<ThemedText style={style}>{value}</ThemedText>
	);
};

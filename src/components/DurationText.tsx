import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {ThemedText} from './ThemedText';
import {formatDuration} from '../utils/duration.utils';

export const DurationText: React.FC<{ duration?: number, style?: StyleProp<TextStyle> }> = ({style, duration}) => {
	return (
		<ThemedText style={style}>{formatDuration(duration)}</ThemedText>
	);
};

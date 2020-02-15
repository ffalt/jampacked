import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import ThemedText from './ThemedText';
import {formatDuration} from '../utils/duration.utils';

export default class DurationText extends React.PureComponent<{ duration?: number, style?: StyleProp<TextStyle> }> {
	render(): React.ReactElement {
		const {style, duration} = this.props;
		const text = formatDuration(duration);
		return (
			<ThemedText style={style}>{text}</ThemedText>
		);
	}
}

import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import ThemedText from './ThemedText';
import {formatDuration} from '../utils/duration.utils';

export default class DurationText extends React.PureComponent<{ duration?: number, style?: StyleProp<TextStyle> }> {
	render(): React.ReactElement {
		return (
			<ThemedText style={this.props.style}>{formatDuration(this.props.duration)}</ThemedText>
		);
	}
}

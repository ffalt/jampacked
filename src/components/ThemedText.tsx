import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {ITheme, withTheme} from '../style/theming';

class ThemedText extends React.PureComponent<{ theme: ITheme; numberOfLines?: number; style?: StyleProp<TextStyle> }> {
	render(): React.ReactElement {
		return (
			<Text {...this.props} style={[{color: this.props.theme.textColor}, this.props.style]}>{this.props.children}</Text>
		);
	}
}

export default withTheme(ThemedText);

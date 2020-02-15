import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {ITheme, withTheme} from '../style/theming';

class ThemedText extends React.PureComponent<{ theme: ITheme; numberOfLines?: number; style?: StyleProp<TextStyle> }> {
	render(): React.ReactElement {
		const {children, style, theme, numberOfLines} = this.props;
		return (
			<Text numberOfLines={numberOfLines} style={[{color: theme.textColor}, style]}>{children}</Text>
		);
	}
}

export default withTheme(ThemedText);

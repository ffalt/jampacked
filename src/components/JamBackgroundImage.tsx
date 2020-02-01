import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import jam from '../services/jamapi';
import {ITheme, withTheme} from '../style/theming';

const styles = StyleSheet.create({
	linearGradient: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});

class FastImageBackground extends React.PureComponent<{ id: string, style?: any, imageStyle?: any, theme: ITheme }> {
	render(): JSX.Element {
		const {id, children, style, imageStyle, ...props} = this.props;
		const imgStyle = [
			StyleSheet.absoluteFill,
			{
				width: style?.width,
				height: style?.height
			},
			imageStyle
		];
		const headers = jam.auth.auth?.token ? {Authorization: `Bearer ${jam.auth.auth.token}`} : undefined;
		const source = {
			uri: jam.image.url(id, 300, undefined, !headers),
			headers,
			priority: FastImage.priority.normal
		};
		return (
			<View style={style}>
				<FastImage {...props} style={imgStyle} source={source}>
					<LinearGradient
						colors={this.props.theme.overlayGradient}
						start={{x: 0, y: 0}}
						end={{x: 0, y: 1}}
						style={styles.linearGradient}
					/>
				</FastImage>
				{children}
			</View>
		);
	}
}

export default withTheme(FastImageBackground);

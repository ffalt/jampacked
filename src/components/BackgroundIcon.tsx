import {ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ITheme, withTheme} from '../style/theming';
import {FontelloIcon} from './FontelloIcon';

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain'
	},
	gradient: {
		width: '100%',
		height: '100%'
	}
});

interface BackgroundIconProps {
	name: string,
	style?: StyleProp<ViewStyle>;
	theme: ITheme;
}

class BackgroundIcon extends React.PureComponent<BackgroundIconProps> {
	state: {
		iconSource: ImageSourcePropType;
	} = {
		iconSource: 0
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { name?: string }): void {
		const newProps = this.props;
		if (prevProps.name !== newProps.name) {
			this.load();
		}
	}

	render(): React.ReactElement {
		const {children, theme, style} = this.props;
		const {iconSource} = this.state;
		return (
			<ImageBackground
				style={[style]}
				imageStyle={styles.image}
				source={iconSource}
			>
				<LinearGradient
					colors={theme.overlayGradient}
					start={{x: 0, y: 0}}
					end={{x: 0, y: 1}}
					style={styles.gradient}
				>
					{children}
				</LinearGradient>
			</ImageBackground>
		);
	}

	private async load(): Promise<void> {
		const {theme, name} = this.props;
		const iconSource = await FontelloIcon.getImageSource(name, 50, theme.muted);
		this.setState({iconSource});
	}
}

export default withTheme(BackgroundIcon);

import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import {Jam} from '../services/jam';
import dataService from '../services/data';
import ThemedIcon from './ThemedIcon';

const styles = StyleSheet.create({
	button: {
		marginLeft: staticTheme.margin
	},
	buttonIcon: {
		fontSize: 26
	}
});

class FavIcon extends React.PureComponent<{ id?: string; objType: string; theme: ITheme, style?: StyleProp<ViewStyle> }> {
	state: {
		jamState?: Jam.State;
	} = {
		jamState: undefined
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { id?: string }): void {
		const newProps = this.props;
		if (prevProps.id !== newProps.id) {
			this.load();
		}
	}

	private load(): void {
		this.setState({jamState: undefined});
		const {id} = this.props;
		if (!id) {
			return;
		}
		this.loadState(id)
			.catch(e => console.error(e));
	}

	private async loadState(id: string): Promise<void> {
		const {objType} = this.props;
		const jamState = await dataService.jam.base.state(objType, {id});
		this.setState({jamState});
	}

	private toggleFav = (): void => {
		const {jamState} = this.state;
		const {id, objType} = this.props;
		if (jamState && id) {
			this.setState({jamState: undefined});
			dataService.toggleFav(objType, id, jamState)
				.then(result => {
					this.setState({jamState: result});
				})
				.catch(e => console.error(e));
		}
	};

	render(): React.ReactElement {
		const {theme, style} = this.props;
		const {jamState} = this.state;
		if (jamState) {
			const iconName = jamState.faved !== undefined ? 'heart-full' : 'heart-empty';
			return (
				<TouchableOpacity style={[styles.button, style]} onPress={this.toggleFav}>
					<ThemedIcon name={iconName} style={styles.buttonIcon}/>
				</TouchableOpacity>
			);
		}
		return (
			<View style={[styles.button, style]}>
				<ThemedIcon name="heart-empty" style={[styles.buttonIcon, {color: theme.muted}]}/>
			</View>
		);
	}
}

export default withTheme(FavIcon);

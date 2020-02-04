import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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

class FavIcon extends React.PureComponent<{ id?: string; objType: string; theme: ITheme }> {
	state: {
		jamState?: Jam.State;
	} = {
		jamState: undefined
	};

	componentDidMount(): void {
		const {id} = this.props;
		this.load(id);
	}

	componentDidUpdate(prevProps: { id?: string }): void {
		if (prevProps.id !== this.props.id) {
			this.load(this.props.id);
		}
	}

	private load(id?: string): void {
		this.setState({jamState: undefined});
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
		const {theme} = this.props;
		const {jamState} = this.state;
		if (jamState) {
			const iconName = jamState.faved !== undefined ? 'heart-full' : 'heart-empty';
			return (
				<TouchableOpacity style={styles.button} onPress={this.toggleFav}>
					<ThemedIcon name={iconName} style={styles.buttonIcon}/>
				</TouchableOpacity>
			);
		}
		return (
			<View style={styles.button}>
				<ThemedIcon name="heart-empty" style={[styles.buttonIcon, {color: theme.muted}]}/>
			</View>
		);
	}
}

export default withTheme(FavIcon);

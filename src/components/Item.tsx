import React, {PureComponent} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import ThemedText from './ThemedText';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import JamImage from './JamImage';
import dataService, {BaseEntry} from '../services/data';
import NavigationService from '../services/navigation';
import SwipeableListItem from './SwipeItem';
import ThemedIcon from './ThemedIcon';
import {Jam} from '../services/jam';

const styles = StyleSheet.create({
	item: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	itemFooter: {
		fontSize: staticTheme.fontSizeSmall
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	buttonText: {
		fontSize: staticTheme.fontSizeHuge
	}
});

class Item extends PureComponent<{ item: BaseEntry, theme: ITheme }> {
	state: {
		loading: boolean;
		jamState?: Jam.State;
	} = {
		loading: false,
		jamState: undefined
	};

	private loadState = (): void => {
		const {item} = this.props;
		this.setState({loading: true});
		dataService.jam.base.state(item.objType, {id: item.id}).then(jamState => {
			this.setState({loading: false, jamState});
		}).catch(e => console.error(e));
	};

	private click = (): void => {
		NavigationService.navigateLink(this.props.item.link);
	};

	private left = (): JSX.Element => {
		const {loading, jamState} = this.state;
		if (!loading && jamState) {
			const iconName = jamState.faved ? 'heart-full' : 'heart-empty';
			return (<ThemedIcon name={iconName} style={styles.buttonText}/>);
		}
		if (!loading) {
			setTimeout(() => {
				this.loadState();
			});
		}
		return (<ActivityIndicator size="large"/>);
	};

	private leftPress = (): void => {
		const {item} = this.props;
		this.setState({loading: true});
		dataService.jam.base.fav(item.objType, {id: item.id}).then(jamState => {
			this.setState({loading: false, jamState});
			Snackbar.show({
				text: jamState.faved ? 'Added to Favorites' : 'Removed from Favorites',
				duration: Snackbar.LENGTH_SHORT
			});
		}).catch(e => console.error(e));
	};

	render(): JSX.Element {
		const {item, theme} = this.props;
		return (
			<SwipeableListItem
				height={64}
				left={this.left}
				leftWidth={64}
				rightWidth={0}
				onPressLeft={this.leftPress}
			>
				<TouchableOpacity onPress={this.click} style={[styles.item, {backgroundColor: theme.background}]}>
					<JamImage id={item.id} size={46}/>
					<View style={styles.itemContent}>
						<ThemedText style={styles.itemText} numberOfLines={2}>{item.title}</ThemedText>
						<ThemedText style={styles.itemFooter} numberOfLines={1}>{item.desc}</ThemedText>
					</View>
				</TouchableOpacity>
			</SwipeableListItem>
		);
	}
}

export default withTheme(Item);

import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import React, {PureComponent} from 'react';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import dataService from '../services/data';
import ThemedText from './ThemedText';

interface LyricsProps {
	id?: string | null;
	theme: ITheme;
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	lyrics: {
		fontSize: staticTheme.fontSize,
		borderLeftWidth: 2,
		borderRightWidth: 2,
		marginHorizontal: staticTheme.marginLarge,
		marginVertical: staticTheme.margin,
		paddingHorizontal: staticTheme.padding
	}
});

class Lyrics extends PureComponent<LyricsProps> {
	state: { lyrics: string } = {
		lyrics: ''
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(oldProps: LyricsProps): void {
		const newProps = this.props;
		if (oldProps.id !== newProps.id) {
			if (!newProps.id) {
				this.setState({lyrics: '[No track]'});
				return;
			}
			this.load();
		}
	}

	load(): void {
		const {id} = this.props;
		if (id) {
			dataService.lyrics(id).then(lyrics => {
				if (lyrics && lyrics.lyrics) {
					this.setState({lyrics: lyrics.lyrics});
				} else {
					this.setState({lyrics: '[No lyrics found]'});
				}
			}).catch(e => {
				console.error(e);
			});
		}
	}

	private renderLyrics(): JSX.Element {
		const {lyrics} = this.state;
		const {theme} = this.props;
		if (!lyrics) {
			return (<ActivityIndicator size="large"/>);
		}
		return (
			<ThemedText style={[styles.lyrics, {borderColor: theme.separator}]}>{this.state.lyrics}</ThemedText>
		);
	}

	render(): React.ReactElement {
		return (
			<ScrollView style={styles.container}>
				{this.renderLyrics()}
			</ScrollView>
		);
	}
}

export default withTheme(Lyrics);

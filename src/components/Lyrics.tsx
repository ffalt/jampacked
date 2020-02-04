import {ITheme, staticTheme, withTheme} from '../style/theming';
import {ScrollView, StyleSheet} from 'react-native';
import React, {PureComponent} from 'react';
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
		padding: staticTheme.paddingLarge * 2
	}
});

class Lyrics extends PureComponent<LyricsProps> {
	state: { lyrics: string } = {
		lyrics: ''
	};

	componentDidUpdate(oldProps: LyricsProps): void {
		const newProps = this.props;
		if (oldProps.id !== newProps.id) {
			if (!newProps.id) {
				this.setState({lyrics: ''});
				return;
			}

			this.load(newProps.id)
				.catch(e => {
					console.error(e);
				});
		}
	}

	async load(id: string): Promise<void> {
		const lyrics = await dataService.lyrics(id);
		if (lyrics && lyrics.lyrics) {
			this.setState({lyrics: lyrics.lyrics});
		} else {
			this.setState({lyrics: '[No lyrics found]'});
		}
	}

	render(): React.ReactElement {
		const {theme} = this.props;
		return (
			<ScrollView style={[styles.container, {backgroundColor: theme.itemBackground}]}>
				<ThemedText style={styles.lyrics}>{this.state.lyrics}</ThemedText>
			</ScrollView>
		);
	}
}

export default withTheme(Lyrics);

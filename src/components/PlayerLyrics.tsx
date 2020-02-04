import {ScrollView, StyleSheet} from 'react-native';
import React, {PureComponent} from 'react';
import {useCurrentTrackID} from '../services/player';
import ThemedText from './ThemedText';
import {staticTheme} from '../style/theming';
import dataService from '../services/data';

interface LyricsProps {
	id?: string | null;
}

const styles = StyleSheet.create({
	card: {
		alignItems: 'center'
	},
	cover: {
		flex: 1,
		width: '100%',
		padding: 0
	},
	title: {
		marginTop: 10,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	artist: {
		textAlign: 'center'
	},
	lyrics: {
		fontSize: staticTheme.fontSize,
		padding: staticTheme.paddingLarge
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
		return (
			<ScrollView>
				<ThemedText style={styles.lyrics}>{this.state.lyrics}</ThemedText>
			</ScrollView>
		);
	}
}

const PlayerLyrics: React.FC = () => {
	const currentTrackID = useCurrentTrackID();
	return (
		<Lyrics id={currentTrackID}/>
	);
};

export default PlayerLyrics;

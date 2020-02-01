import {ScrollView, StyleSheet} from 'react-native';
import React, {PureComponent} from 'react';
import {useCurrentTrackID} from '../services/player';
import jam from '../services/jamapi';
import ThemedText from './ThemedText';
import {staticTheme} from '../style/theming';

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
			jam.track.lyrics({id: newProps.id})
				.then(lyrics => {
					if (lyrics && lyrics.lyrics) {
						this.setState({lyrics: lyrics.lyrics});
					} else {
						this.setState({lyrics: '[No lyrics found]'});
					}
				})
				.catch(e => {
					console.error(e);
				});
		}
	}

	render(): JSX.Element {
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

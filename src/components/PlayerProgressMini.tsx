import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressComponent} from '../services/player-api';
import {ITheme} from '../style/theming';

const styles = StyleSheet.create({
	miniProgress: {
		height: 1
	}
});

export class MiniProgressBar extends ProgressComponent<{ theme: ITheme }> {
	render(): React.ReactElement {
		const width = `${this.getProgress() * 100}%`;
		return (
			<View style={[styles.miniProgress, {backgroundColor: this.props.theme.separator}]}>
				<View style={[styles.miniProgress, {width, backgroundColor: this.props.theme.progress}]}/>
			</View>
		);
	}
}

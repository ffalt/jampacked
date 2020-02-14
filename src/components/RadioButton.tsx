import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from './ThemedText';
import {ITheme, withTheme} from '../style/theming';

export interface RadioButtonEntry {
	key: string;
	label: string;
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 42
	},
	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7
	}
});

class RadioButtons extends React.PureComponent<{
	options: Array<RadioButtonEntry>;
	value?: string;
	onChange: (value: string) => void;
	theme: ITheme;
}> {
	renderItem(item: RadioButtonEntry): React.ReactElement {
		const {value, onChange, theme} = this.props;
		const select = (): void => {
			if (onChange) {
				onChange(item.key);
			}
		};
		return (
			<TouchableOpacity key={item.key} style={styles.buttonContainer} onPress={select}>
				<ThemedText>{item.label}</ThemedText>
				<View style={[styles.circle, {borderColor: theme.textColor}]}>
					{value === item.key && <View style={[styles.checkedCircle, {backgroundColor: theme.navigation.colors.primary}]}/>}
				</View>
			</TouchableOpacity>
		);
	}

	render(): React.ReactElement {
		const {options} = this.props;
		return (
			<View>
				{options.map(item => this.renderItem(item))}
			</View>
		);
	}
}

export default withTheme(RadioButtons);

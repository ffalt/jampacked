import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	separator: {
		height: 1
	}
});

const Separator: React.FC = () => {
	const theme = useTheme();
	return (<View style={[styles.separator, {backgroundColor: theme.separator}]}/>);
};

export default Separator;

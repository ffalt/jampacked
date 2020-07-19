import React from 'react';
import {View} from 'react-native';
import {PlayerStrip} from '../components/PlayerStrip';
import {BottomTabBar} from '@react-navigation/bottom-tabs';

export const JamTabBar: React.FC<any> = (props: any) => (
	<View>
		<PlayerStrip/>
		<BottomTabBar {...props} showLabel={false}/>
	</View>
);

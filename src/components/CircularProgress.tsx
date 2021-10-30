import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import Animated from 'react-native-reanimated';

interface CircularProgressProps {
	progress: number;
	size: number;
	strokeWidth: number;
	indeterminate: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const {PI} = Math;

export const CircularProgress: React.FC<CircularProgressProps> = React.memo((
	{progress = 0, size, strokeWidth}) => {
	const [state, setState] = useState<{
		strokeDasharray: string;
		strokeDashoffset: Animated.Node<number> | number;
		r: number,
		cx: number,
		cy: number
	}>({
		strokeDasharray: '',
		strokeDashoffset: 0,
		r: 0,
		cx: 0,
		cy: 0
	});

	useEffect(() => {
		const {interpolate, multiply} = Animated;
		const r = (size - strokeWidth) / 2;
		const cx = size / 2;
		const cy = size / 2;
		const circumference = r * 2 * PI;
		const a = interpolate(1 - progress, [0, 1], [0, PI * 2]);
		const strokeDashoffset = multiply(a, r);
		const strokeDasharray = `${circumference}, ${circumference}`;
		setState({cx, cy, strokeDashoffset, r, strokeDasharray});
	}, [progress, size, strokeWidth]);


	return (
		<Svg width={size} height={size} style={styles.container}>
			<Defs>
				<LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
					<Stop offset="0" stopColor="#f7cd46"/>
					<Stop offset="1" stopColor="#ef9837"/>
				</LinearGradient>
			</Defs>
			<Circle
				stroke="rgba(255, 255, 255, 0.2)"
				fill="none"
				{...{strokeWidth, cx: state.cx, cy: state.cy, r: state.r}}
			/>
			<AnimatedCircle stroke="url(#grad)" fill="none" {...state}/>
		</Svg>
	);
});

const styles = StyleSheet.create({
	container: {
		transform: [{rotateZ: '270deg'}]
	}
});

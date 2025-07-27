import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { AtoZLetter } from './AtoZLetter';
import { useTheme } from '../style/theming';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const styles = StyleSheet.create({
	outerContainer: {
		position: 'absolute',
		// top: staticTheme.statusBarOffset - 1,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	letters: {
		paddingHorizontal: 10,
		paddingVertical: 20
	},
	letterBubble: {
		position: 'absolute',
		left: -64
	},
	letterBubbleContainer: {
		justifyContent: 'center',
		padding: 10,
		width: 50,
		height: 50,
		backgroundColor: '#e9e9e9',
		borderRadius: 10
	},
	letterBubbleText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		color: 'black'
	},
	letterBubbleArrow: {
		position: 'absolute',
		right: -14,
		top: 12,
		width: 0,
		height: 0,
		borderTopColor: 'transparent',
		borderTopWidth: 13,
		borderLeftWidth: 26,
		borderLeftColor: '#e9e9e9',
		borderBottomWidth: 13,
		borderBottomColor: 'transparent'
	}
});

interface AtoZPickerProps {
	onTouchStart?: () => void;
	onTouchEnd?: () => void;
	onTouchLetter?: (letter: string) => void;
	activeLetter?: string;
	letters: Array<string>;
}

export const AtoZPickerBubble: React.FC<{ yPosition: number; letter: string }> = ({ yPosition, letter }) =>
	(
		<View style={[styles.letterBubble, { top: yPosition }]}>
			<View style={styles.letterBubbleContainer}>
				<Text style={styles.letterBubbleText}>{letter}</Text>
			</View>
			<View style={styles.letterBubbleArrow} />
		</View>
	);

export const AtoZPicker: React.FC<AtoZPickerProps> = (
	{
		letters, activeLetter, onTouchStart, onTouchEnd, onTouchLetter
	}) => {
	const theme = useTheme();
	const containerReference = useRef<View | null>(null);
	const [containerState, setContainerState] = useState<{ absContainerTop: number; containerHeight: number }>({ absContainerTop: 0, containerHeight: 0 });
	const [current, setCurrent] = useState<{ letter: string; yPosition: number }>();

	const check = useCallback((y: number) => {
		if (letters.length === 0) {
			return;
		}
		const h = containerState.containerHeight - (styles.letters.paddingVertical * 2);
		const top = y - containerState.absContainerTop - styles.letters.paddingVertical * 1.5;
		const index = Math.round((top / h) * letters.length);
		const letter = letters[index];
		if (letter !== undefined) {
			const yPosition = index * (h / letters.length) + (top / h);
			setCurrent({ letter, yPosition });
			if (onTouchLetter) {
				onTouchLetter(letter);
			}
		}
	}, [containerState, letters, onTouchLetter]);

	const start = useCallback((y: number) => {
		if (onTouchStart) {
			onTouchStart();
		}
		check(y);
	}, [check, onTouchStart]);

	const move = useCallback((y: number) => {
		check(y);
	}, [check]);

	const stop = useCallback(() => {
		setTimeout(() => {
			setCurrent(undefined);
		}, 150);
		if (onTouchEnd) {
			requestAnimationFrame(() => {
				onTouchEnd();
			});
		}
	}, [onTouchEnd]);

	const panResponder = useMemo(() => PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: (_event, gestureState) => {
			start(gestureState.y0);
		},
		onPanResponderMove: (_event, gestureState) => {
			move(gestureState.moveY);
		},
		onPanResponderTerminate: () => {
			stop();
		},
		onPanResponderRelease: () => {
			stop();
		}
	}), [start, move, stop]);

	const onLayout = (): void => {
		if (!containerReference.current) {
			return;
		}
		containerReference.current.measure((_x1, _y1, _width, height, _px, py) => {
			setContainerState({ absContainerTop: py, containerHeight: height });
		});
	};
	const statusBarHeight = getStatusBarHeight();
	if (letters.length === 0) {
		return (<></>);
	}
	const letterPicks = letters.map(letter => <AtoZLetter letter={letter} key={letter} active={activeLetter === letter} />);
	return (
		<View style={[styles.outerContainer, { backgroundColor: theme.overlay, top: statusBarHeight }]}>
			<View
				ref={containerReference}
				{...panResponder.panHandlers}
				onLayout={onLayout}
				style={styles.letters}
			>
				{current && <AtoZPickerBubble yPosition={current.yPosition} letter={current.letter} />}
				{letterPicks}
			</View>
		</View>
	);
};

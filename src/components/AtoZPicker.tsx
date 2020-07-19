import React from 'react';
import {PanResponder, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {AtoZLetter} from './AtoZLetter';
import {ITheme, withTheme} from '../style/theming';

const styles = StyleSheet.create({
	outerContainer: {
		position: 'absolute',
		top: 24,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	letters: {
		paddingHorizontal: 10
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

interface SectionItem {
	letter: string;
}

interface AtoZPickerProps<T> {
	data: ReadonlyArray<T> | null | undefined;
	onTouchStart?: () => void;
	onTouchEnd?: () => void;
	onTouchLetter?: (letter: string) => void;
	theme: ITheme;
}

class AtoZPicker<T extends SectionItem> extends React.PureComponent<AtoZPickerProps<T>> {
	panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: (e, gestureState) => {
			const {onTouchStart} = this.props;
			if (onTouchStart) {
				onTouchStart();
			}
			this.tapTimeout = setTimeout(() => {
				this.check(gestureState.y0);
			}, 250);
		},
		onPanResponderMove: (evt, gestureState) => {
			if (this.tapTimeout) {
				clearTimeout(this.tapTimeout);
			}
			this.check(gestureState.moveY);
		},
		onPanResponderTerminate: this.onPanResponderEnd.bind(this),
		onPanResponderRelease: this.onPanResponderEnd.bind(this)
	});
	tapTimeout?: any;
	absContainerTop?: number;
	containerHeight: number = 1;
	containerRef: React.RefObject<View> = React.createRef();
	state: {
		letters: Array<string>;
		// letter?: string | null;
		yPosition: number;
		currentLetter: string | null;
	} = {
		letters: [],
		// letter: null,
		yPosition: 0,
		currentLetter: null
	};

	componentDidMount(): void {
		this.build();
	}

	componentDidUpdate(prevProps: AtoZPickerProps<T>): void {
		const newProps = this.props;
		if (prevProps.data !== newProps.data) {
			this.build();
		}
	}

	private build(): void {
		const {data} = this.props;
		const letters: Array<string> = [];
		(data || []).forEach(item => {
			if (!letters.includes(item.letter)) {
				letters.push(item.letter);
			}
		});
		if (this.state.letters.length + letters.length > 0) {
			this.setState({letters});
		}
	}

	private check(y: number): void {
		const {letters} = this.state;
		const letter = this.findTouchedLetter(y);
		if (letter !== undefined) {
			let top = y - (this.absContainerTop || 0);
			top = (Math.round((top / this.containerHeight) * letters.length) - 1) * (this.containerHeight / letters.length);
			this.onTouchLetter(letter);
			this.setState({currentLetter: letter, yPosition: top});
		}
	}

	private onTouchLetter(letter?: string): void {
		const {onTouchLetter} = this.props;
		if (letter && onTouchLetter) {
			onTouchLetter(letter);
		}
	}

	private onPanResponderEnd(): void {
		const {onTouchEnd} = this.props;
		setTimeout(() => {
			this.setState({currentLetter: null});
		}, 150);
		if (onTouchEnd) {
			requestAnimationFrame(() => {
				onTouchEnd();
			});
		}
	}

	private findTouchedLetter(y: number): string | undefined {
		const top = y - (this.absContainerTop || 0);
		const {letters} = this.state;
		if (top >= 1 && top <= this.containerHeight) {
			return letters[Math.round((top / this.containerHeight) * letters.length)];
		}
	}

	private onLayout = (): void => {
		if (!this.containerRef.current) {
			return;
		}
		this.containerRef.current.measure((x1, y1, width, height, px, py) => {
			this.absContainerTop = py;
			this.containerHeight = height;
		});
	};

	private renderLetterBubble(): JSX.Element {
		const {currentLetter, yPosition} = this.state;
		return (
			<View style={[styles.letterBubble, {top: yPosition}]}>
				<View style={styles.letterBubbleContainer}>
					<Text style={styles.letterBubbleText}>{currentLetter}</Text>
				</View>
				<View style={styles.letterBubbleArrow}/>
			</View>
		);
	}

	private nopPress = (): void => {
		// nop
	};

	render(): React.ReactElement {
		const {letters, currentLetter} = this.state;
		if (letters.length === 0) {
			return <></>;
		}
		const {theme} = this.props;
		const letterPicks = letters.map(letter => <AtoZLetter letter={letter} key={letter}/>);
		return (
			<TouchableWithoutFeedback onPress={this.nopPress}>
				<View style={[styles.outerContainer, {backgroundColor: theme.overlay}]}>
					<View
						ref={this.containerRef}
						{...this.panResponder.panHandlers}
						onLayout={this.onLayout}
						style={styles.letters}
					>
						{!!currentLetter && this.renderLetterBubble()}
						{letterPicks}
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export default withTheme(AtoZPicker);

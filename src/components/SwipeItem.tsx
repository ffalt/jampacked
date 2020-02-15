import React, {ReactNode} from 'react';
import {Animated, GestureResponderEvent, PanResponder, PanResponderGestureState, StyleSheet, TouchableOpacity, View} from 'react-native';


const SWIPE = {
	ACTION: {
		CLOSELEFT: -2,
		CLOSERIGHT: 2,
		OPENLEFT: 1,
		OPENRIGHT: -1
	},
	DIRECTION: {
		LEFT: -1,
		RIGHT: 1
	},
	STATE: {
		CLOSED: 0,
		LEFTOPEN: -1,
		RIGHTOPEN: 1
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		position: 'absolute',
		flexDirection: 'row'
	},
	buttons: {
		flexDirection: 'row'
	},
	buttonExpander: {
		flex: 1
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});

type SwipeableListItemProps = {
	children?: ReactNode | Array<ReactNode>;
	left?: () => ReactNode | Array<ReactNode>;
	right?: () => ReactNode | Array<ReactNode>;
	leftWidth: number;
	rightWidth: number;
	height: number;
	onOpen?: (caller: SwipeableListItem) => void,
	onClose?: (caller: SwipeableListItem) => void,
	onPress?: (caller: SwipeableListItem) => void,
	onPressLeft?: (caller: SwipeableListItem) => void,
	onPressRight?: (caller: SwipeableListItem) => void
};

export default class SwipeableListItem extends React.PureComponent<SwipeableListItemProps> {
	state: {
		swipeValueLeft: Animated.Value,
		swipeValueRight: Animated.Value,
		swipeState: number,
		swipeDirection: null | number,
		swipeInitialValue: null | number,
	} = {
		swipeValueLeft: new Animated.Value(0),
		swipeValueRight: new Animated.Value(0),
		swipeState: SWIPE.STATE.CLOSED,
		swipeDirection: null,
		swipeInitialValue: null
	};
	panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: (event, gestureState) => this.handleMoveShouldSetPanResponder(event, gestureState),
		onPanResponderGrant: (event, gestureState) => this.handlePanResponderGrant(event, gestureState),
		onPanResponderMove: (event, gestureState) => this.handlePanResponderMove(event, gestureState),
		onPanResponderEnd: (event, gestureState) => this.handlePanResponderEnd(event, gestureState)
	});
	settings = {
		swipeThreshold: 4,
		swipeOpenThresholdPercentage: 20,
		swipeCloseThresholdPercentage: 20,
		friction: 9,
		tension: 40
	};

	handleMoveShouldSetPanResponder = (event: GestureResponderEvent, gestureState: PanResponderGestureState): boolean => {
		const {dx, dy} = gestureState;
		if (Math.abs(dy) > Math.abs(dx)) {
			return false;
		}
		if (Math.abs(dx) < this.settings.swipeThreshold) {
			return false;
		}
		const swipeDirection = Math.sign(dx);
		this.setState({swipeDirection});
		return true;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handlePanResponderGrant = (event: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
	};

	swipeValueValue(value: Animated.Value): number {
		// TODO: fix hacky private variable access
		// eslint-disable-next-line no-underscore-dangle
		return (value as any)._value || 0;
	}

	handlePanResponderMove = (event: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
		const {dx} = gestureState;
		const {leftWidth, rightWidth} = this.props;
		const {
			swipeValueLeft,
			swipeValueRight,
			swipeDirection,
			swipeState
		} = this.state;
		let {swipeInitialValue} = this.state;
		const swipeAction = swipeDirection !== null ? swipeDirection + swipeState : swipeState;
		let swipeValue;
		let maxDx = 0;
		let newDx;
		switch (swipeAction) {
			case SWIPE.ACTION.CLOSELEFT:
				swipeInitialValue = swipeInitialValue || this.swipeValueValue(swipeValueLeft);
				swipeValue = swipeValueLeft;
				maxDx = leftWidth;
				newDx = swipeInitialValue + dx;
				break;
			case SWIPE.ACTION.CLOSERIGHT:
				swipeInitialValue = swipeInitialValue || this.swipeValueValue(swipeValueRight);
				swipeValue = swipeValueRight;
				maxDx = rightWidth;
				newDx = swipeInitialValue - dx;
				break;
			case SWIPE.ACTION.OPENLEFT:
				swipeInitialValue = swipeInitialValue || this.swipeValueValue(swipeValueLeft);
				swipeValue = swipeValueLeft;
				maxDx = leftWidth;
				newDx = swipeInitialValue + dx;
				break;
			case SWIPE.ACTION.OPENRIGHT:
				swipeInitialValue = swipeInitialValue || this.swipeValueValue(swipeValueRight);
				swipeValue = swipeValueRight;
				maxDx = rightWidth;
				newDx = swipeInitialValue - dx;
				break;
			default:
				return;
		}
		if (newDx < 0) {
			newDx = 0;
		}
		if (newDx > maxDx) {
			newDx = maxDx;
		}
		swipeValue.setValue(newDx);
		this.setState({swipeInitialValue});
	};

	handlePanResponderEnd = (event: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
		const {dx} = gestureState;
		const absDx = Math.abs(dx);
		const {leftWidth, rightWidth} = this.props;
		const {swipeDirection, swipeState} = this.state;
		const {swipeOpenThresholdPercentage, swipeCloseThresholdPercentage} = this.settings;
		const swipeAction = swipeDirection !== null ? swipeDirection + swipeState : swipeState;
		let swipeOpenThreshold;
		let swipeCloseThreshold;
		switch (swipeAction) {
			case SWIPE.ACTION.CLOSELEFT:
				swipeCloseThreshold = (swipeCloseThresholdPercentage / 100) * leftWidth;
				if (swipeCloseThreshold && absDx > swipeCloseThreshold) {
					this.closeLeft();
				} else {
					this.openLeft();
				}
				break;
			case SWIPE.ACTION.CLOSERIGHT:
				swipeCloseThreshold = (swipeCloseThresholdPercentage / 100) * rightWidth;
				if (swipeCloseThreshold && absDx > swipeCloseThreshold) {
					this.closeRight();
				} else {
					this.openRight();
				}
				break;
			case SWIPE.ACTION.OPENLEFT:
				swipeOpenThreshold = (swipeOpenThresholdPercentage / 100) * leftWidth;
				if (swipeOpenThreshold && absDx > swipeOpenThreshold) {
					this.openLeft();
				} else {
					this.closeLeft();
				}
				break;
			case SWIPE.ACTION.OPENRIGHT:
				swipeOpenThreshold = (swipeOpenThresholdPercentage / 100) * rightWidth;
				if (swipeOpenThreshold && absDx > swipeOpenThreshold) {
					this.openRight();
				} else {
					this.closeRight();
				}
				break;
			default:
		}
	};

	open = (swipeValue: Animated.Value, toValue: number, swipeState: number): void => {
		const {onOpen} = this.props;
		const {friction, tension} = this.settings;
		if (onOpen) {
			onOpen(this);
		}
		Animated.spring(
			swipeValue,
			{
				toValue,
				friction, // default: 7
				tension // default: 40
			},
		).start();
		this.setState({
			swipeState,
			swipeInitialValue: null
		});
	};

	openLeft = (): void => {
		const {leftWidth} = this.props;
		const {swipeValueLeft} = this.state;
		this.open(swipeValueLeft, leftWidth, SWIPE.STATE.LEFTOPEN);
	};

	openRight = (): void => {
		const {rightWidth} = this.props;
		const {swipeValueRight} = this.state;
		this.open(swipeValueRight, rightWidth, SWIPE.STATE.RIGHTOPEN);
	};

	close = (swipeValue?: Animated.Value): void => {
		const {onClose} = this.props;
		const {friction, tension} = this.settings;
		const {swipeValueLeft, swipeValueRight, swipeState} = this.state;
		let swipeVal = swipeValue;
		if (!swipeVal) {
			if (swipeState === SWIPE.STATE.LEFTOPEN) {
				swipeVal = swipeValueLeft;
			} else if (swipeState === SWIPE.STATE.RIGHTOPEN) {
				swipeVal = swipeValueRight;
			}
		}
		if (onClose) {
			onClose(this);
		}
		if (swipeVal) {
			Animated.spring(
				swipeVal,
				{
					toValue: 0,
					friction, // default: 7
					tension // default: 40
				},
			).start();
		}
		this.setState({
			swipeState: SWIPE.STATE.CLOSED,
			swipeInitialValue: null
		});
	};

	closeLeft = (): void => {
		const {swipeValueLeft} = this.state;
		this.close(swipeValueLeft);
	};

	closeRight = (): void => {
		const {swipeValueRight} = this.state;
		this.close(swipeValueRight);
	};

	pressRight = (): void => {
		const {onPressRight} = this.props;
		if (onPressRight) {
			onPressRight(this);
		}
		this.closeRight();
	};

	pressLeft = (): void => {
		const {onPressLeft} = this.props;
		if (onPressLeft) {
			onPressLeft(this);
		}
		this.closeLeft();
	};

	private renderRight = (): JSX.Element | null => {
		const {right, height, rightWidth} = this.props;
		if (!right) {
			return null;
		}
		return (
			<TouchableOpacity style={[styles.button, {height, width: rightWidth}]} onPress={this.pressRight}>
				{right()}
			</TouchableOpacity>
		);
	};

	private renderLeft = (): JSX.Element | null => {
		const {left, height, leftWidth} = this.props;
		if (!left) {
			return null;
		}
		return (
			<TouchableOpacity style={[styles.button, {height, width: leftWidth}]} onPress={this.pressLeft}>
				{left()}
			</TouchableOpacity>
		);
	};

	private renderButtons = (): JSX.Element | undefined => {
		const {swipeState} = this.state;
		if (swipeState === SWIPE.STATE.CLOSED) {
			return;
		}
		return (
			<View style={styles.buttons}>
				{this.renderLeft()}
				<View style={styles.buttonExpander}/>
				{this.renderRight()}
			</View>
		);
	};

	render(): React.ReactElement {
		const {children, height} = this.props;
		const {swipeValueLeft, swipeValueRight} = this.state;
		return (
			<View style={{height}}>
				{this.renderButtons()}
				<Animated.View
					{...this.panResponder.panHandlers}
					style={[styles.container, {height, left: swipeValueLeft, right: swipeValueRight}]}
				>
					{children}
				</Animated.View>
			</View>
		);
	}
}

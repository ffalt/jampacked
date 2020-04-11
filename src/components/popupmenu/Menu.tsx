import React, {ReactNode} from 'react';
import {Animated, Dimensions, Easing, LayoutChangeEvent, Modal, Platform, StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
	shadowMenuContainer: {
		position: 'absolute',
		backgroundColor: 'white',
		borderRadius: 4,
		opacity: 0,

		/* Shadow */
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: {width: 0, height: 2},
				shadowOpacity: 0.14,
				shadowRadius: 2
			},
			android: {
				elevation: 8
			}
		})
	},
	menuContainer: {
		overflow: 'hidden'
	}
});

enum STATES {
	MEASURING = 'MEASURING',
	CALCULATING = 'CALCULATING',
	SHOWN = 'SHOWN',
	HIDDEN = 'HIDDEN',
	ANIMATING = 'ANIMATING'
}

const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

export enum Position {
	TOP_LEFT = 'TOP_LEFT',
	TOP_RIGHT = 'TOP_RIGHT',
	TOP_CENTER = 'TOP_CENTER',
	BOTTOM_LEFT = 'BOTTOM_LEFT',
	BOTTOM_RIGHT = 'BOTTOM_RIGHT',
	BOTTOM_CENTER = 'BOTTOM_CENTER'
}

interface Offset {
	left: number;
	top: number;
}

const normalizeOffset = (extraOffset: number): Offset => {
	const reducer = ({left, top}: Offset, [prop, value]: any): Offset => {
		if (prop === 'left') {
			return {left: left + value, top};
		}
		if (prop === 'right') {
			return {left: left - value, top};
		}
		if (prop === 'top') {
			return {left, top: top + value};
		}
		if (prop === 'bottom') {
			return {left, top: top - value};
		}
		return {left, top};
	};

	return Object.entries(extraOffset).reduce(reducer, {left: 0, top: 0});
};

const getSummarizedOffset = (offsetList: Array<Offset>): Offset => {
	const reducer = (acc: Offset, {left, top}: Offset): Offset => ({left: acc.left + left, top: acc.top + top});
	return offsetList.reduce(reducer, {left: 0, top: 0});
};

interface ComponentOffset {
	left: number,
	width: number,
	height: number,
	top: number
}

const getMenuOffset = (stickTo: Position, component: ComponentOffset, menu: ComponentOffset): Offset => {
	switch (stickTo) {
		case Position.TOP_LEFT:
			return {left: component.left, top: component.top};
		case Position.TOP_RIGHT:
			return {left: component.left + (component.width - menu.width), top: component.top};
		case Position.TOP_CENTER:
			return {left: component.left + Math.round((component.width - menu.width) / 2), top: component.top};
		case Position.BOTTOM_LEFT:
			return {left: component.left, top: component.top + component.height};
		case Position.BOTTOM_RIGHT:
			return {left: component.left + (component.width - menu.width), top: component.top + component.height};
		case Position.BOTTOM_CENTER:
			return {left: component.left + Math.round((component.width - menu.width) / 2), top: component.top + component.height};
		default:
	}
	return {left: component.left, top: component.top};
};

export type ComputeFunc = (left: number, top: number, width: number, height: number) => number;

const getComputedOffset = (left: number, top: number, width: number, height: number, func?: ComputeFunc): Offset | null => {
	if (func) {
		const extraOffset = func(left, top, width, height);
		return normalizeOffset(extraOffset);
	}
	return null;
};

export class Menu extends React.Component<{
	children?: ReactNode | Array<ReactNode>;
	style?: StyleProp<ViewStyle>;
	onHidden?: () => void;
}> {
	state: {
		menuState: string,
		stickTo: Position,
		component: ComponentOffset,
		menu: ComponentOffset,
		offsets: {
			staticOffset: Offset,
			computedOffset: Offset
		},
		animation: {
			menuSize: Animated.ValueXY,
			opacity: Animated.Value
		}
	} = {
		menuState: STATES.HIDDEN,
		stickTo: Position.TOP_LEFT,
		component: {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		},
		menu: {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		},
		offsets: {
			staticOffset: {
				left: 0,
				top: 0
			},
			computedOffset: {
				left: 0,
				top: 0
			}
		},
		animation: {
			menuSize: new Animated.ValueXY({x: 0, y: 0}),
			opacity: new Animated.Value(0)
		}
	};

	/* Measure new menu width and height */
	onMenuLayout = (event: LayoutChangeEvent): void => {
		const {width, height} = event.nativeEvent.layout;
		const {menuState, menu} = this.state;
		if (menuState === STATES.MEASURING) {
			this.setState({
				menuState: STATES.CALCULATING,
				menu: {...menu, width, height}
			});
		}
	};

	show = (componentRef: any, stickTo: Position, extraOffset?: number, computeOffset?: ComputeFunc): void => {
		if (componentRef) {
			componentRef.measureInWindow((x: number, y: number, width: number, height: number) => {
				const top = Math.max(SCREEN_INDENT, y);
				const left = Math.max(SCREEN_INDENT, x);

				const computedOffset = getComputedOffset(left, top, width, height, computeOffset);
				const oldOffsets = {...this.state.offsets};
				const newState = {
					menuState: STATES.MEASURING,
					component: {left, top, width, height},
					offsets: {
						...oldOffsets,
						...(extraOffset ? {staticOffset: extraOffset} : {}),
						...(computedOffset ? {computedOffset} : {})
					},
					...(stickTo ? {stickTo} : {})
				};
				this.setState(newState);
			});
		}
	};

	hide = (): void => {
		const {animation} = this.state;
		const {onHidden} = this.props;
		Animated.timing(this.state.animation.opacity, {
			toValue: 0,
			duration: ANIMATION_DURATION,
			easing: EASING,
			useNativeDriver: false
		}).start(() => {
			/* Reset state */
			this.setState(
				{
					menuState: STATES.HIDDEN,
					animation: {
						...animation,
						menuSize: new Animated.ValueXY({x: 0, y: 0}),
						opacity: new Animated.Value(0)
					}
				},
				() => {
					/* Invoke onHidden callback if defined */
					if (Platform.OS !== 'ios' && onHidden) {
						onHidden();
					}
				},
			);
		});
	};

	render(): React.ReactElement {
		const dimensions = Dimensions.get('screen');
		const {menu, component, animation} = this.state;
		const menuSize = {
			width: animation.menuSize.x,
			height: animation.menuSize.y
		};

		/* Adjust position of menu */
		const transforms = [];

		/* Flip by X axis if menu hits right screen border */
		if (menu.left > dimensions.width - menu.width - SCREEN_INDENT) {
			transforms.push({
				translateX: Animated.multiply(animation.menuSize.x, -1)
			});

			menu.left = Math.min(dimensions.width - SCREEN_INDENT, menu.left + component.width);
		}

		/* Flip by Y axis if menu hits bottom screen border */
		if (menu.top > dimensions.height - menu.height - SCREEN_INDENT) {
			transforms.push({
				translateY: Animated.multiply(animation.menuSize.y, -1)
			});

			menu.top = Math.min(dimensions.height - SCREEN_INDENT, menu.top + component.height);
		}

		const shadowMenuContainerStyle = {
			opacity: animation.opacity,
			transform: transforms,
			left: menu.left,
			top: menu.top
		};

		const {onHidden} = this.props;
		const {menuState} = this.state;
		const animationStarted = menuState === STATES.ANIMATING;
		const modalVisible = ((menuState === STATES.MEASURING)
			|| (menuState === STATES.CALCULATING)
			|| (menuState === STATES.SHOWN)) || animationStarted;

		const {style, children} = this.props;

		const onDismiss = (): void => {
			if (onHidden) {
				onHidden();
			}
		};

		return (
			<View collapsable={false}>
				<Modal
					visible={modalVisible}
					onRequestClose={this.hide}
					supportedOrientations={[
						'portrait',
						'portrait-upside-down',
						'landscape',
						'landscape-left',
						'landscape-right'
					]}
					transparent
					onDismiss={onDismiss}
				>
					<TouchableWithoutFeedback onPress={this.hide}>
						<View style={StyleSheet.absoluteFill}>
							<Animated.View
								{...(!animationStarted ? {onLayout: this.onMenuLayout} : {})}
								style={[styles.shadowMenuContainer, shadowMenuContainerStyle, style]}
							>
								<Animated.View style={[styles.menuContainer, animationStarted && menuSize]}>
									{children}
								</Animated.View>
							</Animated.View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		);
	}

	componentDidUpdate(): void {
		const {menuState, menu} = this.state;

		// if (menuState === STATES.ANIMATING) {
		// } else
		if (menuState === STATES.CALCULATING) {
			const {stickTo, component, offsets} = this.state;

			const baseOffset = getMenuOffset(stickTo, component, menu);
			const allOffsets = [baseOffset, offsets.staticOffset, offsets.computedOffset];
			const finalOffset = getSummarizedOffset(allOffsets);
			this.setState({
				menuState: STATES.SHOWN,
				menu: {
					...menu,
					left: finalOffset.left,
					top: finalOffset.top
				}
			});
		} else if (menuState === STATES.SHOWN) {
			const {animation} = this.state;
			this.setState(
				{
					menuState: STATES.ANIMATING
				},
				() => {
					Animated.parallel([
						Animated.timing(animation.menuSize, {
							toValue: {x: menu.width, y: menu.height},
							duration: ANIMATION_DURATION,
							easing: EASING,
							useNativeDriver: false
						}),
						Animated.timing(animation.opacity, {
							toValue: 1,
							duration: ANIMATION_DURATION,
							easing: EASING,
							useNativeDriver: false
						})
					]).start();
				}
			);
		}
	}
}

export default Menu;

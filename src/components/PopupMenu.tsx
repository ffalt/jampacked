import React, {RefObject} from 'react';
import Menu, {MenuItem, Position} from 'react-native-enhanced-popup-menu';
import {ITheme, withTheme} from '../style/theming';

export interface PopupMenuAction {
	title: string;
	click: () => void;
}

class PopupMenu extends React.PureComponent<{
	ref: RefObject<PopupMenu>;
	actions: Array<PopupMenuAction>;
	theme: ITheme;
}> {
	private menuRef?: Menu;
	private setMenuRef = (ref: Menu): void => {
		this.menuRef = ref;
	};

	hideMenu(): void {
		if (this.menuRef) {
			this.menuRef.hide();
		}
	}

	showMenu(ref: React.RefObject<any>): void {
		if (this.menuRef) {
			console.log('ssss', ref.current);
			this.menuRef.show(ref.current, Position.BOTTOM_CENTER);
		}
	}

	renderItems(): Array<JSX.Element> {
		const {actions} = this.props;
		return (actions || []).map(action => {
			const onPress = (): void => {
				this.hideMenu();
				action.click();
			};
			return (<MenuItem key={action.title} onPress={onPress}>{action.title}</MenuItem>);
		});
	}

	render(): React.ReactElement {
		const {theme} = this.props;
		// const {data, refreshing} = this.state;
		return (
			<Menu
				ref={this.setMenuRef}
				style={{backgroundColor: theme.control}}
			>
				{this.renderItems()}
			</Menu>
		);
	}
}

export type PopupMenuRef = RefObject<PopupMenu>;

export default withTheme(PopupMenu);
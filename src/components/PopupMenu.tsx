import React, {MutableRefObject} from 'react';
import {Menu, MenuItem, Position} from './popupmenu/index';
import {ITheme, withTheme} from '../style/theming';

export type PopupMenuRef = React.RefObject<any>;

export interface PopupMenuAction {
	title: string;
	click: () => void;
}

class PopupMenu extends React.PureComponent<{
	ref: MutableRefObject<PopupMenu | undefined>;
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

	showMenu(ref: PopupMenuRef): void {
		if (this.menuRef) {
			this.menuRef.show(ref.current, Position.AUTO_CENTER);
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

export const usePopupMenuRef = (): MutableRefObject<PopupMenu | undefined> => React.useRef<PopupMenu | undefined>();

export default withTheme(PopupMenu);

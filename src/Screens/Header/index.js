import React, { Component } from 'react';
import './style.css';
import { Menu, Dropdown, Icon } from 'antd';

class Header extends Component {
	render() {
		const { user } = this.props;

		const menu = (
			<Menu style={{ zIndex: 9999 }}>
				<Menu.Item key="0">
					<span onClick={this.props.logout}>
						<Icon type="logout" /> Logout
					</span>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="1" disabled>
					SomeThing（disabled）
				</Menu.Item>
			</Menu>
		);

		return (
			<div className="header">
				<span className="brand" onClick={() => this.props.showPage('home')}>
					PanaCloud
				</span>
				{user ? (
					<Dropdown overlay={menu} className="header-dd">
						<span>
							<Icon type="user" style={{ fontSize: '18px' }} /> {user.name}
						</span>
					</Dropdown>
				) : (
					<Icon
						type="login"
						onClick={this.props.logout}
						className="header-dd"
						style={{ fontSize: '18px' }}
					/>
				)}
			</div>
		);
	}
}

export default Header;

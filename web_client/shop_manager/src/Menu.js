import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { ProductEditor } from 'products/Products';
import { uuid } from 'index';
import styles from 'products/Products.module.css';
import { ProductsList } from 'products/Products';
import { CategoriesList } from 'products/Categories';
import { OrdersList } from 'orders/Orders';
import menuStyle from 'Menu.module.css';
import { ShopInfo } from 'shops/Shop';
import { ShopCreate } from 'shops/Shop';
import { MainDialog } from 'index';

const cont = document.getElementById('float_container');

export class Menu extends React.Component {
	render() {
		return (
			<div className={ menuStyle.cont }>
				<ul>
					<li onClick={()=>this.loadProducts()}><h1>Products</h1></li>
					<li onClick={()=>this.loadCategories()}><h1>Categories</h1></li>
					<li onClick={()=>this.loadOrders()}><h1>Orders</h1></li>
					<li onClick={()=>this.loadSettings()}><h1>Settings</h1></li>
					<li onClick={()=>this.logout()}><h1>Logout</h1></li>
				</ul>
			</div>
		);
	}
	loadOrders() {
		ReactDOM.render(
			<OrdersList />,
			cont
		);
	}
	loadCategories() {
		ReactDOM.render(
			<CategoriesList />,
			cont
		);
	}
	loadProducts() {
		ReactDOM.render(
			<ProductsList />,
			cont
		);
	}
	loadSettings() {
		console.log('load Settings');
		ReactDOM.render(
			<ShopCreate />,
			cont
		);
	}
	logout() {
		document.getElementById('side_menu').innerHTML = '';
		localStorage.setItem('tmpToken', null);
		ReactDOM.render(
			<MainDialog/>,
			cont
		);
	}
}
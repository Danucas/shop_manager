import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { CategoriesList, CategoryEditor } from 'products/Categories';
import { YesNoDialog } from 'products/Decision';
import { uuid } from 'index';
import styles from './Orders.module.css';
import contStyle from 'products/Products.module.css';

const root = document.getElementById('root');
const cont = document.getElementById('float_container');

export class OrdersList extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = {};
		}
	}
	render() {
		document.title = 'Orders';
		const orders = this.state.orders;
		let renderOrder;
		if (orders) {
			console.log(orders);
			renderOrder = orders.map((order) => {
				let len = `${order.id.slice(0, 8)} - ${Object.keys(order.description).length} item`;
				return (
					<li className={styles.order_card} key={ uuid() }
						onClick={(evn) => this.edit(order.id)}>
						<div className={styles.description}>
							<div className={ styles.items }>
								<h5># { len }</h5>
							</div>
							<h4>{ order.username }yeah</h4>
							<h2>{ order.date.split(' ')[0] }</h2>
							
						</div>
						<div className={ styles.total_cont }>
							<h3>$ { order.total }</h3>
							<h2></h2>
						</div>
					</li>
				);
			});
		}
		return (
			<div className={ contStyle.products_list }>
				<h1 className={ contStyle.title } >Orders List</h1>
				<ul>{ renderOrder }</ul>
				<button className={ contStyle.add_btn } onClick={()=>this.addOrder()}>+</button>
			</div>
			
		);
	}
	componentDidMount() {
		fetch(`http://localhost:8080/api/shop/orders`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				}
			}
		)
		.then(res => res.json()).catch((err)=>console.log(err))
		.then(json => {
			console.log(json);
			if (json && json.length > 0) {
				this.setState({orders: json});
			}
		});
	}
	addOrder() {
		let state;
		if (this.state.selected) {
			for (const prod of this.state.products) {
				if (prod.id === this.state.selected) {
					state = prod;
				}
			}
		}
		// console.log('adding product');
		ReactDOM.render(
			<OrderEditor state={ state }/>,
			cont
		)
	}
	edit(pid) {
		// console.log(evn.target.parentNode);
		this.state.selected = pid;
		this.addOrder();
	}
	close() {
		unmountComponentAtNode(cont);
	}
}


export class OrderEditor extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = { total: 0, shop: {} };
		}
	}
	render() {
		const products = this.state.products;
		let rendProd;
		const shop = this.state.shop;
		if (products && products.length > 0) {
			rendProd = products.map((product) => {
				return (
					<div className={ styles.product_card }>
						<div className={ styles.counter }
							onClick={() => this.add({product})}>
							{ product.id in shop ? (
								<h1>{ shop[product.id] }</h1>
							)  : (
								<h1>+</h1>
							)}
						</div>
						<div className={ styles.description }>
							<h1>{ product.title }</h1>
							<h1>$ { product.price }</h1>
						</div>
						<div className={ styles.image }>
							<img  src={ product.image } alt=""></img>
						</div>
					</div>
				);
			});
		}
		return (
			<div className={ [contStyle.editor, styles.editor].join(' ') }>
				<button className={ styles.clear } onClick={ () => this.clear() }>clear</button>
				<h1 className={ styles.title }>Place Order</h1>
				<ul className={ styles.products }>
					{rendProd}
				</ul>

				<div className={ styles.total }>
					<h1 onClick={ () => this.next() }>Total $ { this.state.total }</h1>
					<h2></h2>
				</div>
			</div>
		);
	}
	add(prod) {
		const product = prod.product;
		const state = this.state;
		if (product.id in state.shop) {
			state.shop[product.id] = state.shop[product.id] + 1;
			this.state.total += Number(product.price);
		} else {
			state.shop[product.id] = 1;
			this.state.total += Number(product.price);
		}
		this.setState(state);
		
	}
	clear() {
		const state = this.state;
		state.shop = {};
		state.total = 0;
		this.setState(state);
	}
	next() {
		if (this.state.total > 0) {
			console.log(this.state.shop, this.state.total);
			const state = {
				shop: this.state.shop,
				total: this.state.total
			};

			fetch(`http://localhost:8080/api/shop/orders`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': localStorage.getItem('tmpToken')
					},
					body: JSON.stringify(
						state
					)
				}
			)
			.then(res => {
				if (res.status === 401) {
					console.log('Unauthorized');
				} else {
					return res.json()
				}
				
			}).catch((err)=>console.log(err))
			.then(json => {
				console.log(json);
				if (json && json.length > 0) {
					this.setState({products: json});
				}
			});
		}
	}
	componentDidMount() {
		fetch(`http://localhost:8080/api/shop/products`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				}
			}
		)
		.then(res => res.json()).catch((err)=>console.log(err))
		.then(json => {
			console.log(json);
			if (json && json.length > 0) {
				this.setState({products: json});
			}
		});
	}
}
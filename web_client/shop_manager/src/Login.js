import React from 'react';
import { ProductsList} from 'products/Products';
import { Menu } from 'Menu.js'
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import contStyle from 'products/Products.module.css';
import shops from 'shops/Shops.module.css';
import { MainDialog } from '.';

const cont = document.getElementById('float_container');

export class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let full;
		if (this.state.username && this.state.passwd) {
			full = true;
		}
		return (
			<div className={ contStyle.editor }>
					<h1 className={ shops.title }>Hi! happy to see you today!</h1>
					{this.props.error ? (
						<p className={ [shops.description, shops.error].join(' ') }>{ this.props.error }</p>
					) : (
						<p className={ shops.description }>please use your credentials to access your shop</p>
					)}
					<div className={ contStyle.fields }>
						<div className={contStyle.input_container}>
							<h1><i></i>e-mail</h1>
							<input name="username" defaultValue={ this.state.email }
								onChange={ (evn) => this.handleChange(evn)}></input>
						</div>
						<div className={contStyle.input_container}>
							<h1><i></i>password</h1>
							<input name="passwd" type="password" defaultValue={ this.state.passwd }
								onChange={ (evn)=> this.handleChange(evn)}></input>
						</div>
					</div>
					{ full ? (
						<button className={ [contStyle.unblocked, shops.finish].join(' ') } onClick={ () => this.login() }>finish</button>
					) : (
						<button className={ [contStyle.blocked, shops.finish].join(' ') }>finish</button>
					)}
				</div>
		);
	}
	handleChange(evn) {
		const state = this.state;
		state[evn.target.name] = evn.target.value;
		console.log('Input changed');
		this.setState(state);
	}
	login() {
		fetch(`http://localhost:8080/api/auth/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				},
				body: JSON.stringify(
					this.state
				)
			}
		).then(res => res.json())
		.then(json => {
			console.log(json);
			if (json && json.token) {
				localStorage.setItem('tmpToken', json.token);
				ReactDOM.render(
					<ProductsList/>,
					cont
				);
			} else {
				localStorage.setItem('tmpToken', null);
				ReactDOM.render(
					<Login error="Your email or password is wrong"/>,
					cont
				);
			}
		});
	}
}
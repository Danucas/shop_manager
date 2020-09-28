import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { CategoriesList, CategoryEditor } from 'products/Categories';
import { YesNoDialog } from 'products/Decision';
import { uuid } from 'index';
import shops from './Shops.module.css';
import contStyle from 'products/Products.module.css';
import codes from 'code';
import { ProductsList } from 'products/Products';
import dialog from 'dialog.module.css';

const cont = document.getElementById('float_container');

export class ShopInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		return (
			<div>
				<div className={contStyle.input_container}>
					<h1><i></i>shop name</h1>
					<input name="name"
						onChange={this.handleChange} defaultValue={this.state.title}></input>
				</div>
				<div className={contStyle.input_container}>
					<h1><i></i>Whatsapp or  telephone</h1>
					<input name="phone"
						onChange={this.handleChange} defaultValue={this.state.phone}></input>
				</div>
				<div className={contStyle.input_container}>
					<h1><i></i>e-mail</h1>
					<input name="mail"
						onChange={this.handleChange} defaultValue={this.state.title}></input>
				</div>
			</div>
		);
	}
	componentDidMount() {
		fetch(`http://localhost:8080/api/shop/info`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				}
			}
		)
		.then(res => res.json())
		.then(json => {
			let res = json;
			if (res) {
				this.setState(json);
			}
		});
	}
	handleChange(evn) {
		console.log(this.state);
		const state = this.state;
		if (evn.target.name === 'name') {
			state.title = evn.target.value;
		} else if (evn.target.name === 'phone') {
			state.phone = evn.target.value;
		} else if (evn.target === 'mail') {
			state.username = evn.target.value;
		}
		this.setState(state);
	}
}


export class ShopCreate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		return (
			<div className={ dialog.create_store }>
				<img src={ require('../launch.png') }></img>
				<h1>Let's go!</h1>
				<p>you just need to create your store</p>
				<button onClick={ () => this.create()}>create store</button>
			</div>
		);
	}
	create() {
		console.log(codes);
		let full;
		if (this.state.country &&
			this.state.title &&
			this.state.link &&
			this.state.phone) {
			full = true;
		}
		console.log(full, this.state);
		ReactDOM.render(
			(
				<div className={ [contStyle.editor, shops.editor].join(' ') }>
					<h1 className={ shops.title }>Provide the following information to save your store</h1>
					<p className={ shops.description }>On the next step you will setup your account and password credentials</p>
					<div className={ [contStyle.fields, shops.fields].join(' ') }>
						<div className={contStyle.input_container}>
							<h1><i></i>country</h1>
							<input name="country" 
								onChange={this.handleChange} defaultValue={this.state.country}></input>
						</div>
						<div className={contStyle.input_container}>
							<h1><i></i>shop name</h1>
							<input name="title" 
								onChange={this.handleChange} defaultValue={this.state.title}></input>
						</div>
						<div className={contStyle.input_container}>
							<h1><i></i>shop link</h1>
							<input name="link" 
								onChange={this.handleChange} defaultValue={this.state.link}></input>
						</div>
						<div className={contStyle.input_container}>
							<h1><i></i>Whatsapp or  telephone</h1>
							<input name="phone" 
								onFocus={()=> this.phone() }
								onChange={this.handleChange} defaultValue={this.state.phone}></input>
						</div>
					</div>
					{ full ? (
						<button className={ [shops.continue, contStyle.unblocked].join(' ') }
								onClick={ () => this.sign() }>continue</button>	
					) : (
						<button className={ [shops.continue, contStyle.blocked].join(' ') }>continue</button>
					)}
				</div>
			),
			cont
		);
	}
	handleChange(evn) {
		const state = this.state;
		state[evn.target.name] = evn.target.value;
		console.log('Input changed');
		this.setState(state);
		if (evn.target.type === 'checkbox') {
			state.checked = evn.target.checked;
		}
		if (this.state.stage) {
			this.sign();
		} else {
			this.create();
		}
	}
	sign() {
		console.log('Sign in');
		const state = this.state;
		state.stage = 'sign';
		this.setState(state);
		let full;
		if (this.state.username && this.state.passwd && this.state.checked) {
			full = true;
		}
		ReactDOM.render(
			(
				<div className={ contStyle.editor }>
					<h1 className={ shops.title }>We will make sure to make your account secure</h1>
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
						<div className={ shops.terms }>
							<input type="checkbox" onChange={(evn) => this.handleChange(evn)}></input>
							<h1>I agree to <b>Terms of Service and Privacy Policy</b></h1>
						</div>
						
					</div>
					{ full ? (
						<button className={ [contStyle.unblocked, shops.finish].join(' ') } onClick={ () => this.save() }>finish</button>
					) : (
						<button className={ [contStyle.blocked, shops.finish].join(' ') }>finish</button>
					)}
				</div>
			),
			cont
		);
	}
	phone() {
		console.log('Open phone form');
	}
	save() {
		const state = Object.assign({}, this.state);;
		delete state['username'];
		delete state['passwd'];
		console.log('Saving');
		const compState = this.state;
		fetch(`http://localhost:8080/api/shop/`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				},
				body: JSON.stringify(
					state
				)
			}
		).then(res => res.json())
		.then(json => {
			console.log(json);
			if (json) {
				fetch(`http://localhost:8080/api/auth/merged`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.getItem('tmpToken')
						},
						body: JSON.stringify(
							compState
						)
					}
				).then(res => res.json())
				.then(json => {
					console.log(json);
					if (json) {
						ReactDOM.render(
							<ProductsList/>,
							cont
						);
					}
				});	
			}
		});
	}
}
import React from 'react';
import { ProductsList} from 'products/Products';
import { Menu } from 'Menu.js'
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import './start.css';
import dialog from 'dialog.module.css';
import { Login } from './Login';

const root = document.getElementById('root');
const cont = document.getElementById('float_container');
const menu = document.getElementById('side_menu');

/**
 * create_UUID - utility to create the temporal shop owner
 * @returns {UUID String} uuid
 */
export function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
		dt = Math.floor(dt/16);
		// eslint-disable-next-line
        return (c==='x' ? r :(r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
/**
 * MainDialog - ask the user to create a new store or to access it's account
 */
export class MainDialog extends React.Component {
	render() {
		document.title = 'Shop Manager';
		return (
			<div className={ dialog.welcome }>
				<img  src={ require('welcome.png')} alt=""></img>
				<h1>What do you want to do?</h1>
				<button className={ dialog.create } onClick={()=> this.create()}>create my store</button>
				<button className={ dialog.access } onClick={()=> this.access()}>access my account</button>
			</div>
		);
	}
	create() {
		console.log('create');
		unmountComponentAtNode(root);
		fetch(
			'http://localhost:8080/api/auth/tmp_user',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: uuid(),
					password: uuid()
				})
			}
		).then(res => res.json())
		.then(json => {
			const tmptoken = json.token;
			console.log(tmptoken);
			if (tmptoken !== undefined) {
				localStorage.tmpToken = tmptoken;
				ReactDOM.render(
					<Menu/>,
					menu
				);
				ReactDOM.render(
					<ProductsList />,
					cont
				);
			}
		});
	}
	access() {
		console.log('access');
		unmountComponentAtNode(root);
		ReactDOM.render(
			<Login/>,
			cont
		);
		
	}
}

/**
 * StartDialog - introduction at the first time
 */
class StartDialog extends React.Component {
	render() {
		document.title = 'Shop Manager';
		return (
			<div className={ dialog.start }>
			<ul>
				<li>
					<img src={require('./screen.png')} alt=""/>
					<h1>Easily create your shop online</h1>
					<p>Add your products and start placing orders, in less than 3 minutes</p>
				</li>
			</ul>
			<button onClick={()=> this.continue()}>continue</button>
			</div>
		);
	}
	continue() {
		unmountComponentAtNode(root);
		ReactDOM.render(
			<MainDialog/>,
			cont
		);
	}
}

const tok = localStorage.getItem('token');
const tmpUser = localStorage.getItem('tmpToken');
fetch(`http://localhost:8080/api/auth/status`,
	{
		method: 'GET',
		headers: {
			'Authorization': tmpUser
		}
	}
).then(res => res.json())
.then(json => {
	console.log(json);
	if (json.type === 'error') {
		console.log(json.message);
		ReactDOM.render(
			<StartDialog/>,
			cont
		);
	} else {
		// if (json.)
		if (tok || tmpUser) {
			ReactDOM.render(
				<Menu/>,
				menu
			);
			ReactDOM.render(
				<ProductsList />,
				cont
			);
		}
	}
});

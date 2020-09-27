import React from 'react';
import { ProductsList} from 'products/Products';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import './start.css';

const root = document.getElementById('root');
const cont = document.getElementById('float_container');

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
class MainDialog extends React.Component {
	render() {
		return (
			<div>
				<h1>What do you want to do?</h1>
				<img alt=""></img>
				<button onClick={()=> this.create()}>create my store</button>
				<button onClick={()=> this.access()}>access my account</button>
			</div>
		);
	}
	create() {
		console.log('create');
		unmountComponentAtNode(root);
		ReactDOM.render(
			<ProductsList />,
			cont
		);
	}
	access() {
		console.log('access');
		unmountComponentAtNode(root);
	}
}

/**
 * StartDialog - introduction at the first time
 */
class StartDialog extends React.Component {
	render() {
		document.title = 'Shop Manager';
		return (
			<div className="start-dialog">
			<ul>
				<li>
					<img alt=""/>
					<h1>First</h1>
					<p>paragraph</p>
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
					<StartDialog/>,
					cont
				);
			}
		});
	} else {
		// if (json.)
		if (tok || tmpUser) {
			ReactDOM.render(
				<ProductsList />,
				cont
			);
		}
	}
});

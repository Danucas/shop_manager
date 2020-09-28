import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { ProductsList, ProductEditor } from './Products';
import { uuid } from 'index';
import styles from './Products.module.css';
import cats from './Categories.module.css';
import { YesNoDialog } from 'products/Decision';

const root = document.getElementById('float_container');
const cont = document.getElementById('float_container');

export class CategoriesList extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = {};
		}
	}
	componentDidMount() {
		fetch(`http://localhost:8080/api/shop/categories`,
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
			if (typeof res !== String && res.length > 0) {
				this.setState({categories: res});
			}
		});
	}
	close() {
		unmountComponentAtNode(cont);
		ReactDOM.render(
			<ProductsList/>,
			cont
		);
	}
	render() {
		document.title = 'Categories';
		const categories = this.state.categories;
		let rendCat;
		if (categories) {
			rendCat = categories.map(category => {
				return (
					<li className={cats.card} key={ uuid() } onClick={()=>this.edit(category.id)}>
						<h1 key={ uuid() }>{ category.title }</h1>
						<p key={ uuid() }>{ category.description }</p>
					</li>
				);
			});
		}
		return (
			<div className={ cats.categories }>
				<h1 className={ styles.title }>Categories List</h1>
				<ul>{ rendCat }</ul>
				<button className={ styles.add_btn } onClick={()=>this.addCategory()}>+</button>
			</div>
			
		);
	}
	close() {
		unmountComponentAtNode(root);
	}
	edit(id) {
		const categories = this.state.categories;
		let category;
		for (const cat of categories) {
			if (id === cat.id) {
				category = cat
			}
		}
		ReactDOM.render(
			<CategoryEditor state={ category } from="categories" parent={this.props.from}/>,
			cont
		);
	}
	addCategory() {
		ReactDOM.render(
			<CategoryEditor from="categories" parent={this.props.from}/>,
			cont
		);
	}
}

export class CategoryEditor extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = {};
		}
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(evn) {
		const state = this.state;
		state[evn.target.name] = evn.target.value;
		this.setState(state);
	}
	render() {
		document.title = 'Categories';
		let full;
		if (this.state.title && this.state.description) {
			full = true;
		}
		return (
			<div className={styles.editor}>
				<h1>Category</h1>
				<button className={styles.close_editor} onClick={()=>this.close()}>cancel</button>
				<div className={styles.input_container}>
					<h1><i></i>title</h1>
					<input name="title" placeholder="Title" defaultValue={ this.state.title }
						onChange={this.handleChange}></input>
				</div>
				<div className={styles.input_container}>
					<h1><i></i>description</h1>
					<input name="description" placeholder="Description" defaultValue={ this.state.description }
						onChange={this.handleChange}></input>
				</div>
				{full ? (
					<button className={[styles.next, styles.unblocked].join(' ')} onClick={()=>this.save()}>save</button>
				) : (
					<button className={[styles.next, styles.blocked].join(' ')}>save</button>
				)}
				{this.state.id ? (
					<button className={ styles.delete_btn } onClick={()=> this.askDelete()}>delete</button>
				) : (
					<br></br>
				)}
			</div>
		);
	}
	close() {
		unmountComponentAtNode(root);
		if (this.props.from === 'categories') {
			ReactDOM.render(
				<CategoriesList />,
				cont
			);
		} else {
			const state = this.props.caller_state;
			ReactDOM.render(
				<ProductEditor state={state}/>,
				cont
			);
		}
	}
	save() {
		const state = this.props.caller_state;
		if (this.props.from !== 'categories') {
			console.log(state, this.state.title);
			if (state && this.state.title) {
				state.category = this.state.title;
			}
		}
		let method = 'POST';
		if (this.state.id) {
			method = 'PATCH';
		}
		fetch(
			`http://localhost:8080/api/shop/categories`,
			{
				method: method,
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
			if (this.props.from !== 'categories') {
				state.category = json.id;
				ReactDOM.render(
					<ProductEditor state={state}/>,
					cont
				);
			} else {
				ReactDOM.render(
					<CategoriesList />,
					cont
				);
			}
		});
	}
	askDelete() {
		ReactDOM.render(
			<YesNoDialog
				message={ "Are you sure about deleting this category?" } 
				func={()=>this.delete() } />,
				document.getElementById('dialog')
		);
	}
	delete() {
		console.log(this.state);
		fetch(`http://localhost:8080/api/shop/categories`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('tmpToken')
				},
				body: JSON.stringify(
					{
						id: this.state.id
					}
				)
			}
		).then(res => res.json())
		.then(json => {
			console.log(json);
			ReactDOM.render(
				<CategoriesList />,
				cont
			);
		});
	}
}
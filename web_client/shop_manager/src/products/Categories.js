import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { ProductEditor } from './Products';
import { uuid } from 'index';

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
	render() {
		const categories = this.state.categories;
		let rendCat;
		if (categories) {
			rendCat = categories.map(category => {
				return (
					<h1 key={ uuid() }>{ category.title }</h1>
				);
			});
		}
		return (
			
			<div>
				<h1>Categories List</h1>
				<ul>{ rendCat }</ul>
				<button onClick={()=>this.addCategory()}>add new category</button>
			</div>
			
		);
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
			if (json.length > 0) {
				this.setState({categories: json});
			}
		});
	}
	close() {
		unmountComponentAtNode(root);
	}
	addCategory() {
		ReactDOM.render(
			<CategoryEditor from="categories" parent={this.props.from}/>
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
		return (
			<div>
				<button onClick={()=>this.close()}>cancel</button>
				<input name="title" placeholder="Title"
						onChange={this.handleChange}></input>
				<input name="description" placeholder="Description"
						onChange={this.handleChange}></input>
				<button onClick={()=>this.save()}>save category</button>
			</div>
		);
	}
	close() {
		if (this.props.from === 'categories') {
			ReactDOM.render(
				<CategoriesList from={this.props.parent}/>,
				cont
			);
		} else {
			const state = this.props.caller_state;
			ReactDOM.render(
				<ProductEditor state={state}/>,
				cont
			);
		}
		unmountComponentAtNode(root);
	}
	save() {
		if (this.props.from !== 'categories') {
			console.log('Adding category value');
			const state = this.props.caller_state;
			console.log(state, this.state.title);
			if (state && this.state.title) {
				state.category = this.state.title;
			}
			// Now the category has to be saved
			// Fetch category create -> receive the new category_id to be setted in state
			fetch(
				`http://localhost:8080/api/shop/categories`,
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
				state.category_id = json.id;
				ReactDOM.render(
					<ProductEditor state={state}/>,
					cont
				);
			});
		} else {
			console.log('Save category');
			this.close();
		}
	}
}
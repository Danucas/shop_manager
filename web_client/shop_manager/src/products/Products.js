import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { CategoriesList, CategoryEditor } from 'products/Categories';
import { uuid } from 'index';
// console.log(CategoriesList, CategoryEditor);

const root = document.getElementById('root');
const cont = document.getElementById('float_container');
// console.log(root);


export class ProductsList extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = {};
		}
	}
	render() {
		const products = this.state.products;
		let renderProd;
		if (products) {
			renderProd = products.map((product) => {
				return (
					<div key={ uuid() }>
						<h1 key={ uuid() }>{ product.title }</h1>
						<img src={ product.image } alt="" key={ uuid() }/>
					</div>
				);
			});
		}
		return (
			<div>
				<h1>Products List</h1>
				<ul>{ renderProd }</ul>
				<button onClick={()=>this.addProduct()}>add new product</button>
			</div>
			
		);
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
		.then(res => res.json())
		.then(json => {
			if (json.length > 0) {
				this.setState({products: json});
			}
		});
	}
	addProduct() {
		console.log('adding product');
		ReactDOM.render(
			<ProductEditor state={ {} }/>,
			cont
		)
	}
	close() {
		unmountComponentAtNode(cont);
	}
}

export class ProductEditor extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.state) {
			this.state = this.props.state;
		} else {
			this.state = {};
		}
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		console.log(this.state);
		const categories = this.state.categories;
		let rendCat;
		if (categories) {
			rendCat = categories.map(category => {
				return (
					<option key={ uuid() } value={ category.id }>{ category.title }</option>
				);
			});
		}
		return (
			<div>
				<button onClick={()=>this.close()}>close</button>
				<input  placeholder="title" name="title"
						onChange={ this.handleChange } defaultValue={ this.state.title }></input>
				<input  placeholder="description" name="description"
						onChange={this.handleChange} defaultValue={this.state.description}></input>
				<input  placeholder="price" name="price"
						onChange={this.handleChange} defaultValue={this.state.price}></input>
				<select  placeholder="category" name="category"
						onFocus={(evn)=> this.checkCategories(evn)}
						onChange={this.handleChange} defaultValue={this.state.category}>
						{ rendCat }
						</select>
				<button onClick={()=>this.next()}>next</button>
			</div>
		);
	}
	handleChange(evn) {
		const state = this.state;
		if (evn.target.name === 'image') {
			state[evn.target.name] = evn.target.files[0];
		} else {
			state[evn.target.name] = evn.target.value;
		}
		this.setState(state);
	}
	close() {
		unmountComponentAtNode(cont);
		ReactDOM.render(
			<ProductsList/>,
			cont
		);
	}
	firstDialog() {
		ReactDOM.render(
			<ProductEditor state={ this.state }/>,
			cont
		);
	}
	checkCategories(evn) {
		const state = this.state;
		if (evn.target.value) {
			console.log('Ya tiene un valor');
		} else {
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
				} else {
					ReactDOM.render(
						<CategoryEditor from="product" caller_state={ state }/>,
						cont
					);
				}
			});
		}
	}
	next() {
		if (this.state.category) {
			ReactDOM.render(
				(
					<div>
						<button onClick={()=>this.firstDialog()}>back</button>
						<img src={this.state.image} alt=""></img>
						<input name="image" type="file" accept="image/png, image/jpeg"
								onChange={this.handleChange}></input>
						<button onClick={()=>this.finish()}>finish</button>
					</div>
				),
				cont
			);
		} else {
			ReactDOM.render(
				<CategoryEditor caller_state={this.state}/>,
				cont
			);
		}
		
	}
	toBase64 = (file) => new Promise((resolve, reject) =>{
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = ()=> resolve(reader.result);
		reader.onerror = error => reject(error);
	})
	async finish() {
		console.log(localStorage.getItem('tmpToken'));
		const state = this.state;
		state.image = await this.toBase64(this.state.image);
		console.log('Saving Product:', state);
		if (state.image &&
			state.category_id &&
			state.category &&
			state.title &&
			state.description &&
			state.price) {
			fetch(
				`http://localhost:8080/api/shop/products`,
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
			).then(res => res.json())
			.then(json => {
				console.log(json);
			});
		} else {
			console.log('Provide all the fields');
		}
	}
}

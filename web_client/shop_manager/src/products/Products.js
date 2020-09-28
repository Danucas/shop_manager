import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { CategoriesList, CategoryEditor } from 'products/Categories';
import { YesNoDialog } from 'products/Decision';
import { uuid } from 'index';
import styles from 'products/Products.module.css';
import { ShopInfo } from 'shops/Shop';
import { ShopCreate } from 'shops/Shop';


const root = document.getElementById('root');
const cont = document.getElementById('float_container');


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
		document.title = 'Products';
		const products = this.state.products;
		let renderProd;
		if (products) {
			renderProd = products.map((product) => {
				return (
					<li className={styles.product_card} key={ uuid() }
						onClick={(evn) => this.edit(product.id)}>
						<img src={ product.image } alt="" key={ uuid() }/>
						<div className={styles.description}>
							<h2>{ product.title }</h2>
							<h3>{ product.category_str }</h3>
							<h4>$ { product.price }</h4>
						</div>
					</li>
				);
			});
		}
		return (
			<div className={ styles.products_list }>
				<h1 className={ styles.title } >Products List</h1>
				<ul>{ renderProd }</ul>
				<button className={ styles.add_btn } onClick={()=>this.addProduct()}>+</button>
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
		.then(res => res.json()).catch((err)=>console.log(err))
		.then(json => {
			console.log(json);
			if (json && json.length > 0) {
				this.setState({products: json});
			}
		});
	}
	addProduct() {
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
			<ProductEditor state={ state }/>,
			cont
		)
	}
	edit(pid) {
		// console.log(evn.target.parentNode);
		this.state.selected = pid;
		this.addProduct();
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
		// console.log(this.state);
		document.title = 'Products';
		const categories = this.state.categories;
		let rendCat;
		let category = 'create';
		// console.log(categories);
		if (categories && categories.length > 0) {
			if (this.state.category) {
				category = this.state.category;
			} else {
				category = categories[0].id;
			}
			console.log(categories.length, category);
			rendCat = categories.map(category => {
				return (
					<option key={ uuid() } value={ category.id }>{ category.title }</option>
				);
			});
		}
		let next;
		let nClasses = [
			styles.blocked,
			styles.next
		];
		if (this.state.category &&
			this.state.title &&
			this.state.description &&
			this.state.price){
				nClasses[0] = styles.unblocked;
				next = this.next;
			}
		return (
			<div className={styles.editor}>
				<h1>Product</h1>
				<button className={styles.close_editor} onClick={()=>this.close()}>close</button>
				<div className={ styles.fields }>
					<div className={styles.input_container}>
						<h1><i></i>title</h1>
							<input name="title"
								onChange={ this.handleChange } defaultValue={ this.state.title }></input>
					</div>
					<div className={styles.input_container}>
						<h1><i></i>description</h1>
						<input name="description"
							onChange={this.handleChange} defaultValue={this.state.description}></input>
					</div>
					<div className={styles.input_container}>
						<h1><i></i>price</h1>
						<input name="price" type="number"
							onChange={this.handleChange} defaultValue={this.state.price}></input>
					</div>
					<div className={styles.input_container}>
						<h1><i></i>category</h1>
						<select name="category"
							onChange={this.handleChange}
							onFocus={()=> this.checkCategories()}
							value={category}>
							{ rendCat }
							{rendCat &&
								<option value="create">create new category</option>
							}
						</select>
					</div>
				</div>
				{next ? (
					<button className={nClasses.join(' ')} onClick={()=> this.next()}>next</button>
				) : (
					<button className={nClasses.join(' ')}>next</button>
				)}
				{this.state.id ? (
					<button className={ styles.delete_btn } onClick={()=> this.askDelete()}>delete</button>
				) : (
					<br></br>
				)}
				
			</div>
		);
	}
	async handleChange(evn) {
		// console.log('Handle Change');
		const state = this.state;
		if (evn.target.name === 'image' && evn.target.files.length > 0) {
			state[evn.target.name] = await this.toBase64(evn.target.files[0]);
			this.next();
			return;
		} else {
			state[evn.target.name] = evn.target.value;
		}
		if (evn.target.name === 'category') {
			if (evn.target.value === 'create') {
				console.log('Create new category');
				ReactDOM.render(
					<CategoryEditor caller_state={this.state}/>,
					cont
				);
			} else {
				state.category = evn.target.value;
			}
		}
		this.setState(state);
	}
	componentDidUpdate() {
		const state = this.state;
		// console.log('updating');
		if (this.state.category) {
			console.log('category', this.state.category);
			document.querySelector('[name="category"]').value = this.state.category;
		} else if(this.state.categories) {
			console.log('categories');
			state.category = this.state.categories[0].id;
			this.setState(state);
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
			if (res && res.length > 0) {
				this.setState({categories: res});
			}
		});
	}
	askDelete() {
		ReactDOM.render(
			<YesNoDialog
				message={ "Are you sure about deleting this product?" } 
				func={()=>this.delete() } />,
				document.getElementById('dialog')
		);
	}
	delete() {
		fetch(`http://localhost:8080/api/shop/products`,
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
				<ProductsList />,
				cont
			);
		});
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
	checkCategories() {
		const state = this.state;
		if (!state.categories) {
			ReactDOM.render(
				<CategoryEditor from="product" caller_state={ state }/>,
				cont
			);
		}
	}
	upload() {
		document.querySelector('[name="image"]').click();
	}
	next() {
		if (this.state.category) {
			ReactDOM.render(
				(
					<div className={styles.image}>
						<button className={styles.close_editor} onClick={()=>this.firstDialog()}>back</button>
						<img src={this.state.image} alt=""></img>
						<label onClick={()=> this.upload()}>
							{this.state.image ? (
									"change image"
								) : (
									"add image"
								)}</label>
						<input name="image" title="" type="file" accept="image/png, image/jpeg"
								onChange={this.handleChange}></input>
						{this.state.image ? (
							<button className={[styles.next, styles.unblocked].join(' ')} onClick={()=>this.finish()}>finish</button>
						) : (
							<button className={[styles.next, styles.blocked].join(' ')}>finish</button>
						)}
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
		// console.log(localStorage.getItem('tmpToken'));
		const state = this.state;
		console.log('Saving Product:', state);
		if (state.image &&
			state.category &&
			state.title &&
			state.description &&
			state.price) {
			let method = 'POST';
			if (state.id) {
				method = 'PATCH';
			}
			fetch(
				`http://localhost:8080/api/shop/products`,
				{
					method: method,
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
				if (json && json.id) {
					ReactDOM.render(
						<ProductsList />,
						cont
					);
				} else if (json && json.shop){
					ReactDOM.render(
						<ShopCreate />,
						cont
					);
				}
			});
		} else {
			console.log('Provide all the fields');
		}
	}
}

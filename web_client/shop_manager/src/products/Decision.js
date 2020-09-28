import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import styles from 'products/Decision.module.css'

const dialog = document.getElementById('dialog');


export class YesNoDialog extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		dialog.style.visibility = 'visible';
		return (
			<div className={ styles.cont }>
				<h1 className={ styles.message }>{ this.props.message }</h1>
				<button className={ styles.no } onClick={()=>this.no()}>cancel</button>
				<button className={ styles.yes } onClick={()=>this.yes()}>yes</button>
			</div>
		);
	}
	yes() {
		this.props.func();
		dialog.style.visibility = 'hidden';
		unmountComponentAtNode(dialog);
	}
	no() {
		dialog.style.visibility = 'hidden';
		unmountComponentAtNode(dialog);
	}
}
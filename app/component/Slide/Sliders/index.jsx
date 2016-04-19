/**
 * Sliders
 */
import React, { Component, PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.css'

const propTypes = {
	link: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired
}

const defaultProps = {
	link: "javascript:;"
}

class Sliders extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		var aStyles = {
			width: document.documentElement.clientWidth + "px"
		}
		var picStyles = {
			backgroundImage: "url(" + this.props.src + ")"
		}
		return (
			<a href={this.props.link} styleName="slide-a" style={aStyles}>
				<div styleName="slide-li" style={picStyles}></div>
			</a>
		)
	}
}

Sliders.propTypes = propTypes
Sliders.defaultProps = defaultProps

export default CSSModules(Sliders, styles);
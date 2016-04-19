/**
 * Slide
 */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.css'

import Sliders from './Sliders'

class Slide extends Component {
	constructor(props) {
		super(props)
	}

	state = {
		baseWidth: document.documentElement.clientWidth,
		startX: "",
		curX: "",
		moveX: "",
		time: 0,
		distance: 0,
		swiper: 30,
		index: 0,
		length: this.props.opts.length,
		continuous: true
	}

	touchStart (e) {
		this.setState({
			time: 0,
			startX: e.touches[0].pageX
		})
	}

	touchMove (e) {
		e.preventDefault()
		var _curX = e.touches[0].pageX
		var _moveX = _curX - this.state.startX
		var _distance = -(this.state.index * this.state.baseWidth - _moveX)

		this.setState({
			curX: _curX,
			moveX: _moveX,
			time: 0,
			distance: _distance
		})
	}

	touchEnd (e) {
		if(Math.abs(this.state.moveX) <= this.state.swiper) {
			this.slideFun('', '.3')
		} else {
			if(this.state.moveX > this.state.swiper) {
				this.slideFun('prev', '.3')
			} else if(Math.abs(this.state.moveX) > this.state.swiper) {
				this.slideFun('next', '.3')
			}
		}

		this.setState({
			moveX: 0
		})
	}

	slideFun (go, time) {
		var _index = this.state.index
		if(typeof go === "number") {
			_index = go
		} else if(go == "next") {
			_index ++
		} else if(go == "prev") {
			_index --
		}

		// 是否循环滚动
		if(this.state.continuous) {
			if(_index > this.state.length) {
				this.scrollFun(_index, time)
				//返回第一个
				_index = 1
				setTimeout(() => {
					this.scrollFun(_index, 0)
					this.setState({
						index: _index
					})
				}, 300);
			} else if(_index < 1) {
				this.scrollFun(_index, time)
				//返回最后一个
				_index = this.state.length
				setTimeout(() => {
					this.scrollFun(_index, 0)
					this.setState({
						index: _index
					})
				}, 300)
			} else {
				this.scrollFun(_index, time)
				this.setState({
					index: _index
				})
			}
		} else {
			if(_index >= this.state.length) {
				_index = 0;
			} else if(_index < 0) {
				_index = this.state.length - 1;
			}
			this.scrollFun(_index, time)
			this.setState({
				index: _index
			})
		}
	}

	scrollFun (index, time) {
		this.setState({
			time: time,
			distance: -(index * this.state.baseWidth)
		})
	}

	componentDidMount() {
		if(this.state.continuous) {
			var newIndex = this.state.index + 1
			this.setState({
				index: newIndex,
				distance: -(newIndex * this.state.baseWidth)
			})
		}
	}

	render() {
		var opts = this.props.opts
		var slideStyle = {
			width: (document.documentElement.clientWidth * (opts.length + 2)) + "px",
			WebkitTransform: 'translate3d(' + this.state.distance + "px,0,0)",
			transform: 'translate3d(' + this.state.distance + "px,0,0)",
			WebkitTranstion: "all " + this.state.time + "s",
			transition: "all " + this.state.time + "s"
		}
		var sliders = opts.map((item, i) => {
			return (
				<Sliders link={item.link} src={item.src} key={i} />
			)
		})
		return (
			<div styleName="slide-wrap">
				<div styleName="slide-ul" style={slideStyle} onTouchStart={e=>this.touchStart(e)} onTouchMove={e=>this.touchMove(e)} onTouchEnd={e=>this.touchEnd(e)}>
					{this.state.continuous ? <Sliders link={opts[opts.length-1].link} src={opts[opts.length-1].src} picWidth={this.state.baseWidth} /> : ""}
					{sliders} 
					{this.state.continuous ? <Sliders link={opts[0].link} src={opts[0].src} picWidth={this.state.baseWidth} /> : ""}
				</div>
			</div>
		);
	}
}

export default CSSModules(Slide, styles);
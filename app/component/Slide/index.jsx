/**
 * Slide
 */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.css'

import Sliders from './Sliders'
import Dots from './Dots'

var SlideInter;

class Slide extends Component {
	constructor(props) {
		super(props)
		this.autoSlideFun = this.autoSlideFun.bind(this)
	}

	state = {
		baseWidth: document.documentElement.clientWidth, //宽度
		startX: "",
		curX: "",
		moveX: "",
		time: 0,
		distance: 0, //移动距离
		swiper: 30, //滑动滚动触发距离
		index: 0,
		length: this.props.opts.length,
		continuous: true, //是否循环滚动
		autoSlide: true,
		slideSpeed: 2000
	}

	touchStart (e) {
		this.setState({
			time: 0,
			startX: e.touches[0].pageX
		})
	}

	touchMove (e) {
		e.preventDefault()
		if(this.state.autoSlide) {
			this.stopSlideFun();
		}
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
			this.slideFun('', '.5')
		} else {
			if(this.state.moveX > this.state.swiper) {
				this.slideFun('prev', '.5')
			} else if(Math.abs(this.state.moveX) > this.state.swiper) {
				this.slideFun('next', '.5')
			}
		}

		this.setState({
			moveX: 0
		})
	}

	/**
	 * index控制
	 * @param  {num} go   指定index数值
	 * @param  {num} time transition时间
	 */
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
					this.autoSlideFun()
					this.setState({
						index: _index
					})
				}, 500);
			} else if(_index < 1) {
				this.scrollFun(_index, time)
				//返回最后一个
				_index = this.state.length
				setTimeout(() => {
					this.scrollFun(_index, 0)
					this.autoSlideFun()
					this.setState({
						index: _index
					})
				}, 500)
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

	/**
	 * 滚动函数
	 * @param  {num} index 指定滚动的index
	 * @param  {num} time  transition的时间
	 */
	scrollFun (index, time) {
		this.setState({
			time: time,
			distance: -(index * this.state.baseWidth)
		})
	}

	autoSlideFun() {
		if(this.state.autoSlide) {
			this.stopSlideFun()
			SlideInter = setInterval(() => {
				this.slideFun('next', '.5')
			}, this.state.slideSpeed)
		}
	}

	stopSlideFun() {
		clearInterval(SlideInter)
	}

	componentDidMount() {
		// 循环滚动 index+1
		if(this.state.continuous) {
			var newIndex = this.state.index + 1
			this.setState({
				index: newIndex,
				distance: -(newIndex * this.state.baseWidth)
			})
		}
		this.autoSlideFun();
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

		var dots = opts.map((item, i) => {
			return (
				<Dots key={i} active={(this.state.continuous ? (this.state.index-1) : this.state.index) == i ? 'active' : ''} />
			)
		}) 

		return (
			<div styleName="slide-wrap">
				<div styleName="slide-ul" style={slideStyle} onTouchStart={e=>this.touchStart(e)} onTouchMove={e=>this.touchMove(e)} onTouchEnd={e=>this.touchEnd(e)} onTransitionEnd={()=>this.autoSlideFun()}>
					{this.state.continuous ? <Sliders link={opts[opts.length-1].link} src={opts[opts.length-1].src} picWidth={this.state.baseWidth} /> : ""}
					{sliders} 
					{this.state.continuous ? <Sliders link={opts[0].link} src={opts[0].src} picWidth={this.state.baseWidth} /> : ""}
				</div>
				<div styleName="dots-wrap">
					{dots}
				</div>
			</div>
		);
	}
}

export default CSSModules(Slide, styles);
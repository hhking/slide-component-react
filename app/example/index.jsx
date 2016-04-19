/**
 * slide example
 */

import React, { Component } from 'react'

import Slide from '../component/Slide'

import banner1 from './banner1.png'
import banner2 from './banner2.png'
import banner3 from './banner3.png'

const opts = [{
	link: 'javascript:;',
	src: banner1
},{
	src: banner2
},{
	link: '#',
	src: banner3
}]

class Home extends Component {
	render() {
		return (
			<Slide opts={opts} />
		)
	}
}

export default Home;
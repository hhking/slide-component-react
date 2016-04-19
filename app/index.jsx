import React, { Component } from 'react'
import { render } from 'react-dom'
import styles from './public.css'

import Home from './example'

var container = document.getElementById('app');

render(<Home />, container);
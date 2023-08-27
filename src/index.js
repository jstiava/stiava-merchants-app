import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// Clashing stylesheets
import './styles/master.css'
import './styles/testing.css'
import './styles/animated.css'
import './styles/content.css'
import './styles/header.css'

ReactDOM.render(<App />, document.getElementById('root'));

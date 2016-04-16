import '../common/css/chatapp.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../common/store/configureStore';
import DevTools from '../common/containers/DevTools';
import routes from '../common/routes';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
import ConnectedIntlProvider from '../common/containers/ConnectedIntlProvider';

addLocaleData(en);
addLocaleData(de);
addLocaleData(it);

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const rootElement = document.getElementById('react');


// All modern browsers, except `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// For that we need to patch in on runtime.
if (!global.Intl){
  	require.ensure(['intl'], require => {
    	require('intl').default
    	start()
  	}, 'IntlBundle');
	
}else {
	start();
}
function start () {
	ReactDOM.render(
	  	<Provider store={ store }>
			<ConnectedIntlProvider >
			    <div className="chat-app">
			      	<Router children={ routes } history={ browserHistory } />
			  		{ process.env.NODE_ENV !== 'production' && <DevTools /> }
				</div>
			</ConnectedIntlProvider>
	  	</Provider>,
	  	rootElement
	);
}

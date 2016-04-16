import { Route, IndexRoute } from 'react-router';
import React from 'react';

import ChatContainer from './containers/ChatContainer';
import App from './containers/App';

/*
IndexRoute - default UI to render when the path is '/'
*/

const Routes = (
    <Route path="/" component={ App }>
        <IndexRoute component={ ChatContainer } />
        <Route path="/chat" component={ ChatContainer }>
        </Route>
    </Route>
);

export default Routes;

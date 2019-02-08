import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import Main from './Main';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<Router>
  <Route render={() => <Main />} />
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

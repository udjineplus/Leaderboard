import React from 'react';
import ReactDOM from 'react-dom';
import Leaderboard from './component/leaderboard/Leaderboard';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<Leaderboard />, document.getElementById('root'));
registerServiceWorker();

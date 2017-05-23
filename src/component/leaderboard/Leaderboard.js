import React, { Component } from 'react';
import axios from 'axios';
import {ScrollBox, FastTrack} from 'react-scroll-box';

import menuBtnImg from './assets/img/menu-button.png';
import avatarImg from './assets/img/avatar.png';
import bronzeImg from './assets/img/bronze.png';
import silverImg from './assets/img/silver.png';
import goldImg from './assets/img/gold.png';

import './assets/css/Leaderboard.css';
import './assets/css/Scroll.css';

const SERVER_BASE_URL = 'http://localhost:5599';
const PERIOD_TODAY = 'TODAY';
const PERIOD_THIS_WEEK = 'THIS_WEEK';
const PERIOD_ALL_TIME = 'ALL_TIME';

const LIST_GAME = [
    { key : 'ALL_GAMES', value : 'ALL GAMES' },
    { key : 'EGGZ', value : 'EGGZ'},
    { key : 'JIGSAW', value : 'JIGSAW'},
    { key : 'SPIDER', value : 'SPIDER'},
    { key : 'EGGZ11', value : 'EGGZ11'},

    { key : 'EGGZ1', value : 'EGGZ1'},
    { key : 'JIGSAW1', value : 'JIGSAW1'},
    { key : 'SPIDER1', value : 'SPIDER1'},
    { key : 'EGGZ122', value : 'EGGZ12'},

    { key : 'EGGZ2', value : 'EGGZ2'},
    { key : 'JIGSAW2', value : 'JIGSAW2'},
    { key : 'SPIDER2', value : 'SPIDER2'},
    { key : 'EGGZ2', value : 'EGGZ2'},

    { key : 'EGGZ3', value : 'EGGZ3'},
    { key : 'JIGSAW3', value : 'JIGSAW3'},
    { key : 'SPIDER3', value : 'SPIDER3'},
    { key : 'EGGZ3', value : 'EGGZ3'},

    { key : 'EGGZ4', value : 'EGGZ4'},
    { key : 'JIGSAW4', value : 'JIGSAW4'},
    { key : 'SPIDER4', value : 'SPIDER4'},
    { key : 'EGGZ4', value : 'EGGZ4'},
];



/**
 * Таблица результатов
 */
class Leaderboard extends Component {

    constructor(props) {
        super(props);
        this.state = {isMenuOpen: false, isLoading: false, errors: null, leaderboard: [], period : PERIOD_TODAY, game : LIST_GAME[0].key };
    }

    componentWillMount() {
        this.fetchLeaderboard({ period: PERIOD_TODAY, game : LIST_GAME[0].key });
    }

    /**
     * Загружает leaderboard с сервера
     * @param search параметр выборки данных
     */
    fetchLeaderboard(search) {
        this.setState({isLoading: true});

        let period = search.period || this.state.period;
        let game = search.game || this.state.game;

        //
        let cached = this.getCachedData(period, game);
        if(cached) {
            this.setState({isLoading: false, leaderboard : cached});
            return;
        }

        axios.get(`${SERVER_BASE_URL}/leaderboard/${period}/${game}/`)
            .then(function (response) {
                this.setState({isLoading: false, leaderboard : response.data});
                this.cachingData(period, game, response.data);
            }.bind(this))
            .catch(function (error) {
                this.setState({isLoading: false});
                this.setState({errors: error});
            }.bind(this));
    }


    /* Caching */
    keygen(period, game) {
        return `${period}@${game}`;
    }

    cachingData(period, game, value) {
        sessionStorage.setItem(this.keygen(period, game), JSON.stringify(value));
    }

    getCachedData(period, game) {
        let c = sessionStorage.getItem(this.keygen(period, game));
        if(c) {
            return JSON.parse(c);
        }
        return null;
    }

    /**
     * Обработчик клика на периоде
     * @param e событие
     * @param period период
     */
    onChangePeriodHandler(e, period) {
        e.preventDefault();
        let p = { period : period };
        this.setState(p);
        this.fetchLeaderboard(p);
    }

    /**
     * Обработчик клика на игре
     * @param e событие
     * @param game игра
     */
    onGameClickHandler(e, game) {
        e.preventDefault();
        let g = { game : game };
        this.setState(g);
        this.fetchLeaderboard(g);
    }

    /**
     * Обработчик клика на бургере
     * @param e событие
     */
    onMenuClickHandler(e) {
        e.preventDefault();
        this.setState({isMenuOpen: !this.state.isMenuOpen});
    }

    render() {
        return (
            <div className="Leaderboard">
                    <div className="leaderboard_nav">
                        <div className="leaderboard_nav_title">LEADERBOARD</div>
                        <div className="menu-button">
                            <a onClick={this.onMenuClickHandler.bind(this)}><img src={menuBtnImg} alt="menu button" /></a>
                        </div>
                        <div className={'menu ' + ((this.state.isMenuOpen)? 'menu-open' : '') }>
                            <div className="scrollbar-macosx menu-wrapper">
                                <ScrollBox style={{height: '100%'}} fastTrack={FastTrack.PAGING}>
                                    <ul>
                                        {  /* Список игр */
                                            LIST_GAME.map(
                                                function (game, i) {
                                                    return (<li className={(game.key === this.state.game) ? 'menu-item active' : 'menu-item'} key={i} >
                                                        <a onClick={(e) => {this.onGameClickHandler(e, game.key)}}>{game.value}</a>
                                                    </li>);
                                                }.bind(this))
                                        }
                                </ul>
                                </ScrollBox>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard_nav_tabs">
                        <ul className="leaderboard_nav_tabs__items" >
                            <li className={(PERIOD_TODAY === this.state.period) ? 'active' : ''}>
                                <a onClick={(e) => {this.onChangePeriodHandler(e, PERIOD_TODAY)}}><nobr>TODAY</nobr></a>
                            </li>
                            <li className={(PERIOD_THIS_WEEK === this.state.period) ? 'active' : ''}>
                                <a onClick={(e) => {this.onChangePeriodHandler(e, PERIOD_THIS_WEEK)}}><nobr>THIS WEEK</nobr></a>
                            </li>
                            <li className={(PERIOD_ALL_TIME === this.state.period) ? 'active' : ''}>
                                <a onClick={(e) => {this.onChangePeriodHandler(e, PERIOD_ALL_TIME)}}><nobr>ALL TIME</nobr></a>
                            </li>
                        </ul>
                    </div>
                    <div className="scrollbar-macosx leader-wrapper" >
                        { this.state.errors && <div>Server not available</div> }
                        { this.state.isLoading && !this.state.errors && <div>Loading...</div> }
                        { !this.state.isLoading && !this.state.errors &&
                            <ScrollBox style={{height: '100%'}} fastTrack={FastTrack.PAGING}>
                                {/*  Генерация списка лидеров */}
                                {this.state.leaderboard && this.state.leaderboard.map(function(leader, i) {
                                    return (
                                            <div key={leader.id} className="item">
                                                <div className="number">{leader.id}</div>
                                                <div className="avatar">
                                                    <img src={avatarImg} height="73" width="73" alt="avatar" />
                                                </div>
                                                <div className="username">{leader.username}</div>
                                                <div className="score score-best">{leader.score}</div>
                                                <div className="star">
                                                    {  i === 0 && <img src={goldImg} className="star" alt="star gold" /> }
                                                    {  i === 1 && <img src={silverImg} className="star" alt="star silver" /> }
                                                    {  i === 2 && <img src={bronzeImg} className="star" alt="star bronze" /> }
                                                </div>
                                            </div>
                                           )
                                })}
                            </ScrollBox>
                        }
                    </div>
            </div>
        );
    }
}

export default Leaderboard;

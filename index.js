// import './wdyr';
import {AppRegistry} from 'react-native';
import {initPlayer} from './src/services/player-api';
import {App} from './App';
import {name as appName} from './app.json';
import playbackService from './src/services/playback';
import TrackPlayer from 'react-native-track-player';

// eslint-disable-next-line no-undef
console.reportErrorsAsExceptions = false;

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => playbackService);

// eslint-disable-next-line no-undef
initPlayer().catch(console.error);

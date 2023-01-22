// import './wdyr';
import {AppRegistry} from 'react-native';
import {initPlayer, TrackPlayer} from './src/services/player-api';
import {App} from './App';
import {name as appName} from './app.json';
import playbackService from "./src/services/playback";

// eslint-disable-next-line no-console
console.reportErrorsAsExceptions = false;

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
initPlayer().catch(e => {
	console.error(e);
});

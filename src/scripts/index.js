import plugins from './plugins';
import config from './config';
import Game from './Game';
import GameData from './game/data/GameData';
import LocalStorage from './game/data/LocalStorage';
import CookieManager from './game/CookieManager';
import SpaceCatsScreenManager from './game/screen/SpaceCatsScreenManager';
import GameScreen from './game/screen/GameScreen';

import SoundManager from './soundManager/SoundManager'
import SoundManagerCordova from './soundManager/SoundManagerCordova'
import imageManifest from './manifests/manifest-image'
import audioManifest from './manifests/manifest-audio'
import FbManager from './fb/FbManager'

window.STORAGE = new LocalStorage();

window.GAME_ID = 572860816402905
    // window.TOKEN = 'EAAYsfZAxiFmMBAGRGBwsQbhqBRq04GhaWGc4KOC2YRFEDzf8yA0cW0h8CxlZAkx6mnUK3bIJI9FDYkUASGTgAycujNZBqRZCI2AzpmiQfpFgpW61PNhqNfZCdIgkEl93de3LXyn00ZAtAPShcEVAjf9wZAhZCSMKE8R809ND4LcQ7gZDZD'

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.COINS_POOL = [];

window.CLASSES = {}

window.PAWN = {
    width: 50,
    height: 50
}
// window.console.log = function() {}
window.console.warn = function() {}
window.console.groupCollapsed = function(teste)
    {
        return teste
    } //('hided warnings')

console.log(audioManifest);
let audioToLoad = [] //['assets/audio/dream1.mp3', 'assets/audio/dream2.mp3']
window.SOUND_MANAGER = new SoundManager();



window.getCatSound = function()
{
    let rnd = Math.ceil(Math.random() * 10)
    if (rnd >= 10)
    {
        return 'cat_' + rnd
    }
    else
    {
        return 'cat_0' + rnd
    }
}

window.getCoinSound = function()
{
    return 'coins_0' + Math.ceil(Math.random() * 4)
}

window.MAX_NUMBER = 1000000;

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);


startLoader();

// window.getPossibleCat = function(id = -1){
//     if(id <= 0){
//         id = Math.floor(CAT_LIST.length * Math.random());
//     }
//     return CAT_LIST[id];
// }

// window.FbManager = new FbManager();


function startLoader()
{

    for (var i = 0; i < imageManifest.length; i++)
    {
        PIXI.loader.add(imageManifest[i].id, imageManifest[i].url)
    }
    for (var i = 0; i < audioManifest.length; i++)
    {

        let url = audioManifest[i].url.substr(0, audioManifest[i].url.length - 4);

        if (iOS)
        {
            url += '.mp3'
        }
        else
        {
            url += '.ogg'
        }

        PIXI.loader.add(audioManifest[i].id, url)
    }
    PIXI.loader
        .add('./assets/fonts/stylesheet.css')
        .load(configGame);

    // console.log('try to connect');
    FbManager.connect().then(() =>
        {
            FbManager.trackLoader(PIXI.loader);

        })
        .catch(e =>
        {

            console.log('CONNECT111?');
            console.log(e);

        })
}


function configGame(evt)
{
    SOUND_MANAGER.load(audioManifest);
    FbManager.start()
        // console.log(CAT_LIST);
    window.GAME_DATA = new GameData();
    let sotrageData = STORAGE.getObject('space-cats-game-data')
    if (!sotrageData)
    {
        STORAGE.storeObject('space-cats-game-data', GAME_DATA.getObjectData());
    }
    else
    {
        GAME_DATA.loadData(sotrageData);
    }
    window.RESOURCES = evt.resources;
    window.game = new Game(config);
    window.screenManager = new SpaceCatsScreenManager();
    game.screenManager = screenManager;
    // screenManager.timeScale = 0;
    //create screen manager
    //add screens
    let gameScreen = new GameScreen('GameScreen');
    game.stage.addChild(screenManager);
    screenManager.addScreen(gameScreen);
    screenManager.forceChange('GameScreen');
    game.start();


    window.addEventListener("focus", myFocusFunction, true);
    window.addEventListener("blur", myBlurFunction, true);

}


function myFocusFunction()
{
    TweenLite.killTweensOf(screenManager);
    TweenLite.to(screenManager, 0.5,
    {
        timeScale: 1
    })
    if (GAME_DATA.mute)
    {
        return
    }
    SOUND_MANAGER.unmute();
}

function myBlurFunction()
{
    TweenLite.killTweensOf(screenManager);
    TweenLite.to(screenManager, 0.5,
    {
        timeScale: 0
    })

    SOUND_MANAGER.mute();
}
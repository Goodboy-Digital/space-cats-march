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

window.STORAGE = new LocalStorage();

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.CLASSES = {}

window.PAWN = {
    width: 50,
    height: 50
}
window.console.warn = function() {}
window.console.groupCollapsed = function(teste)
    {
        return teste
    } //('hided warnings')

let audioToLoad = [] //['assets/audio/dream1.mp3', 'assets/audio/dream2.mp3']
window.SOUND_MANAGER = new SoundManager();
SOUND_MANAGER.load(audioToLoad);

window.MAX_NUMBER = 1000000;
startLoader();

// window.getPossibleCat = function(id = -1){
//     if(id <= 0){
//         id = Math.floor(CAT_LIST.length * Math.random());
//     }
//     return CAT_LIST[id];
// }
function startLoader()
{
    for (var i = 0; i < imageManifest.length; i++)
    {
        PIXI.loader.add(imageManifest[i].id, imageManifest[i].url)
    }
    PIXI.loader
        .add('./assets/fonts/stylesheet.css')
        .load(configGame);
}

function configGame(evt)
{
    let cats = ['cat_orange_', 'cat_pink_', 'cat_turquoise_', 'cat_yellow_']
    window.CAT_LIST = [];
    let tot = 19;
    for (var j = 0; j < cats.length; j++)
    {
        let temp = [];
        for (var i = 0; i < tot; i++)
        {
            let id = '0000' + i;
            if (i > 9)
            {
                id = '000' + i;
            }
            temp.push(PIXI.Texture.from(cats[j] + id));
        }
        CAT_LIST.push(temp);
    }
    console.log(CAT_LIST);
    window.GAME_DATA = new GameData();
    let sotrageData = STORAGE.getObject('space-cats-game-data')
    if(!sotrageData){
        STORAGE.storeObject('space-cats-game-data', GAME_DATA.getObjectData());
    }else{
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
import * as PIXI from 'pixi.js';
import ScreenManager from '../../screenManager/ScreenManager';
import TopMenu from './topMenu/TopMenu'
import StartPopUp from './popup/StartPopUp'
import GameOverPopUp from './popup/GameOverPopUp'
import OnboardingPopUp from './popup/OnboardingPopUp'
import ShopPopUp from './popup/ShopPopUp'
import AskVideoPopUp from './popup/AskVideoPopUp'
import config from '../../config';
export default class SpaceCatsScreenManager extends ScreenManager
{
    constructor()
    {
        super();
        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(0, 0, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        this.backgroundContainer.addChild(tiled)
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        // goodboy.height = config.height;
        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = config.width;
        bigBlur.height = config.height;
        bigBlur.alpha = 0.2

        let vignette = new PIXI.Sprite(PIXI.Texture.from('vignette'));
        this.backgroundContainer.addChild(vignette)
        vignette.width = config.width;
        vignette.height = config.height;

        let goodboy = new PIXI.Sprite(PIXI.Texture.from('goodboy'));
        this.backgroundContainer.addChild(goodboy)
        goodboy.anchor.set(0.5)
        goodboy.scale.set(config.width / goodboy.width * 0.12)
        goodboy.x = config.width / 2;
        goodboy.y = goodboy.height;
        // bigBlur.blendMode = PIXI.BLEND_MODES.ADD
        this.timeScale = 1;



        this.startPopUp = new StartPopUp('init', this);
        this.startPopUp.onConfirm.add(() =>
        {
            this.showPopUp('onboarding')
            // this.toGame()
        });

        this.startPopUp.onCatsRedirect.add(() =>
        {
            this.showPopUp('gameover')
        });

        this.askVideoPopUp = new AskVideoPopUp('video', this);
        this.askVideoPopUp.onConfirm.add(() =>
        {
            // this.toStart()
            this.loadVideo()
        });

        this.askVideoPopUp.onClose.add(() =>
        {
            // this.toStart()
            this.toGame()
        });

        this.gameOverPopUp = new GameOverPopUp('gameover', this);
        this.gameOverPopUp.onConfirm.add(() =>
        {
            this.toVideo()
                // this.toGame()
        });

        this.gameOverPopUp.onShopRedirect.add(() =>
        {
            this.showPopUp('shop')
        });

        this.onboardingPopUp = new OnboardingPopUp('onboarding', this);
        this.onboardingPopUp.onConfirm.add(() =>
        {
            this.toGame()
                // this.toGame()
        });

        this.shopPopUp = new ShopPopUp('shop', this);
        this.shopPopUp.onHide.add(() =>
        {
            this.gameOverPopUp.updateCurrency();
            //this.showPopUp('gameover')
            // this.toGame()
                // this.toGame()
        });


        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);
        this.popUpList = [];
        this.popUpList.push(this.startPopUp);
        this.popUpList.push(this.gameOverPopUp);
        this.popUpList.push(this.onboardingPopUp);
        this.popUpList.push(this.shopPopUp);
        this.popUpList.push(this.askVideoPopUp);


        this.currentPopUp = null;
        this.prevPopUp = null;


        this.videoContainer = new PIXI.Container();
        let vdBg = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height);
        this.videoContainer.addChild(vdBg)

        let videoLabel = new PIXI.Text('Reward video playing here\n\nThats how we make money\n\n$$$',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0x0000,
            align: 'center',
            fontWeight: '800'
        });

        this.videoContainer.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;
        videoLabel.x = config.width / 2;
        videoLabel.y = config.height / 2;

        this.videoContainer.interactive = true;
        this.videoContainer.buttonMode = true;
        this.afterVideoCallback = this.toGameWithBonus;
        // this.videoContainer.on('mouseup', this.afterVideoCallback.bind(this)).on('touchend', this.afterVideoCallback.bind(this));
        this.addChild(this.videoContainer);

        this.videoContainer.visible = false;
        this.showPopUp('gameover')
        // this.toGame();
        // this.showPopUp('init')
        // this.showPopUp('shop')

    }
    showPopUp(label, param = null)
    {
        if (this.currentPopUp && this.currentPopUp.label != label)
        {
            // this.currentPopUp.hide();
            this.prevPopUp = this.currentPopUp;
        }
        for (var i = 0; i < this.popUpList.length; i++)
        {
            if (this.popUpList[i].label == label)
            {
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
            }
        }
    }
    change(screenLabel, param)
    {
        super.change(screenLabel, param);
    }
    update(delta)
    {
        super.update(delta * this.timeScale);

        if (this.currentPopUp)
        {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent)
        {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
            console.log('REMOVE');
        }
    }

    closeVideo(){
        this.videoContainer.visible = false;
    }
    loadVideo(callback, callbackParams)
    {
        this.videoContainer.off('mouseup', this.afterVideoCallback, callbackParams).off('touchend', this.afterVideoCallback, callbackParams);
        if (callback)
        {
            this.afterVideoCallback = callback;
        }
        else
        {
            this.afterVideoCallback = this.toGameWithBonus.bind(this);
        }

        this.videoContainer.on('mouseup', this.afterVideoCallback, callbackParams).on('touchend', this.afterVideoCallback, callbackParams);
        // console.log(callback);
        this.videoContainer.visible = true;
    }
    toVideo()
    {
        this.showPopUp('video')
    }
    toGameWithBonus()
    {
        this.videoContainer.visible = false;
        if (this.currentScreen.label == 'GameScreen')
        {
            this.currentScreen.resetGame(true);
        }
    }
    toGame()
    {
        if (this.currentScreen.label == 'GameScreen')
        {
            this.currentScreen.resetGame();
        }
    }
    toLoad()
    {}
    toStart()
    {
        this.showPopUp('init')
    }

    shake(force = 1, steps = 4, time = 0.25)
    {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed,
            {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed,
        {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}
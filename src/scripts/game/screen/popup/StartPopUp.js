import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import StandardPop from './StandardPop';
export default class StartPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        this.onCatsRedirect = new Signals();
        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
            // this.playButton.pivot.x = this.playButton.width / 2
            // this.playButton.pivot.y = this.playButton.height / 2
            // this.playButton.scale.set((this.size / this.playButton.width));
        this.playButton.alpha = 1;

        this.popUp.alpha = 0;

        // this.playButton.y = this.height * 0.5 + this.playButton.height


        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = config.width / 2
        this.logoMask.y = config.height / 2 - 50
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
            // this.screenManager.addChild(this.logoMask);
            // this.screenManager.screensContainer.mask = this.logoMask;

        this.logo = new PIXI.Sprite.from('lettering');
        this.logo.anchor.set(0.5);
        this.logo.x = 0
        this.logo.y = -50
        this.logo.scale.set(this.width / this.logo.width * 0.65)
        this.container.addChild(this.logo);


        this.glass = new PIXI.Sprite.from('glass');
        this.glass.anchor.set(0.5);
        this.glass.x = config.width / 2
        this.glass.y = config.height / 2
        this.glass.scale.set(this.logoStartScale)
            // this.screenManager.screensContainer.addChild(this.glass)

        // this.container.addChild(this.playButton)

        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
        this.playButtonScale = this.logoMask.height / this.playButton.height * 0.5
        this.playButton.scale.set(this.playButtonScale);
        this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - this.playButton.height / 3
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.container.addChild(this.playButton)
        this.playButton.scale.set(0);



        this.resetButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.resetButton.anchor.set(0.5)
        this.resetButtonScale = this.logoMask.height / this.resetButton.height * 0.1
        this.resetButton.scale.set(this.resetButtonScale);
        this.resetButton.x = -config.width / 2 + this.resetButton.width;
        this.resetButton.y = -config.height / 2 + this.resetButton.height;
        // this.resetButton.y = -300
        this.resetButton.alpha = 0;
        this.resetButton.interactive = true;
        this.resetButton.buttonMode = true;
        this.resetButton.on('mouseup', this.reset.bind(this)).on('touchend', this.reset.bind(this));
        this.container.addChild(this.resetButton)

        this.toCats = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.toCats.anchor.set(0.5)
        this.toCatsScale = this.logoMask.height / this.toCats.height * 0.25
        this.toCats.scale.set(this.toCatsScale);
        this.toCats.x = config.width / 2 - this.toCats.width;
        this.toCats.y = -config.height / 2 + this.toCats.height;
        // this.toCats.y = -300
        this.toCats.interactive = true;
        this.toCats.buttonMode = true;
        this.toCats.on('mouseup', this.addManyCats.bind(this)).on('touchend', this.addManyCats.bind(this));
        this.container.addChild(this.toCats)
    }

    addManyCats(){
        GAME_DATA.addCats([100,100,100,100])
        GAME_DATA.updateCatsAllowed(999999);
    }
    redirectCats(){
        this.onCatsRedirect.dispatch()
    }
    showCats()
    {

        this.hide(false, this.redirectCats.bind(this));
        // this.onCatsRedirect.dispatch()
    }
    reset()
    {
        STORAGE.reset();
        location.reload();
        // STORAGE.storeObject('game-data', GAME_DATA.getObjectData());
        // GAME_DATA.loadData(sotrageData);
    }
    hide(dispatch, callback)
    {
        // TweenLite.to(this.glass.scale, 1, {x:3,y:3});
        // TweenLite.to(this.glass, 0.5, {delay:0.5, alpha:0});
        TweenLite.to(this.logoMask.scale, 1,
        {
            x: 3,
            y: 3,
            onComplete: () =>
            {

                this.screenManager.mask = null;
                if (this.logoMask.parent)
                    this.logoMask.parent.removeChild(this.logoMask)

                // if(this.glass.parent)
                // this.glass.parent.removeChild(this.glass)
            }
        })
        super.hide(dispatch, callback);
    }

    show()
    {
        // return
        if (this.screenManager.screensContainer.mask)
        {
            this.screenManager.screensContainer.mask = null;
        }
        // TweenLite.to(this.glass, 0.5, {alpha:1});

        this.screenManager.screensContainer.mask = this.logoMask;
        this.screenManager.screensContainer.addChild(this.logoMask)
            // this.screenManager.screensContainer.addChild(this.glass)

        this.logoMask.scale.set(5)

        //    this.glass.scale.set(5)

        //    TweenLite.to(this.glass.scale, 0.75, {x:this.logoStartScale,y:this.logoStartScale,onComplete:()=>{
        // }})

        TweenLite.to(this.playButton.scale, 0.75,
        {
            delay: 0.5,
            x: this.playButtonScale,
            y: this.playButtonScale,
            ease: Elastic.easeOut
        })
        TweenLite.to(this.logoMask.scale, 0.75,
        {
            x: this.logoStartScale,
            y: this.logoStartScale,
            onComplete: () =>
            {}
        })
        super.show();
    }
}
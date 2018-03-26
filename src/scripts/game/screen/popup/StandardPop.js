import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
export default class StandardPop extends PIXI.Container
{
    constructor(label, screenManager)
    {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();

        this.w = config.width * 0.5;
        this.h = config.width * 0.5;

        this.popUp = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.w, this.h) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.popUp.pivot.x = this.popUp.width / 2
        this.popUp.pivot.y = this.popUp.height / 2
            // this.popUp.scale.set((this.size / this.popUp.width));
        this.popUp.alpha = 1;
        this.popUp.rotation = Math.PI / 4;
        this.popUp.tint = 0xFFFFFF;
        this.popUp.blendMode = PIXI.BLEND_MODES.ADD;
        this.container.addChild(this.popUp)
        this.container.x = config.width / 2;
        this.container.y = config.height / 2;
        this.addChild(this.container)

    }
    update(delta){

    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);

        this.container.scale.set(0, 2)
        TweenLite.to(this.container.scale, 1,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })
    }
    afterHide(){

    }
    hide(dispatch = true, callback = null)
    {
        console.log(callback);
        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if(dispatch){
        		  this.onHide.dispatch(this);
                }
                if(callback){
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}
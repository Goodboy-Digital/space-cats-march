import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import StandardPop from './StandardPop';
export default class AskVideoPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        	let videoLabel = new PIXI.Text('Do you want watch a video\nand start with a bonus?',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '24px',
                fill: 0x0000,
                align: 'center',
                fontWeight: '800'
            });


        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
        this.playButton.scale.set(0.25)
        // this.playButtonScale = this.logoMask.height / this.playButton.height * 0.35
        // this.playButton.scale.set(this.playButtonScale);
        // this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - 20
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.container.addChild(this.playButton)

         this.cancelButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.cancelButton.anchor.set(0.5)
        this.cancelButton.scale.set(0.25)
        // this.cancelButtonScale = this.logoMask.height / this.cancelButton.height * 0.35
        // this.cancelButton.scale.set(this.cancelButtonScale);
        // this.cancelButton.y = config.height - this.container.y - this.cancelButton.height / 2 - 20
        this.cancelButton.interactive = true;
        this.cancelButton.buttonMode = true;
        this.cancelButton.on('mouseup', this.close.bind(this)).on('touchend', this.close.bind(this));
        this.container.addChild(this.cancelButton)


        this.container.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;

        videoLabel.y = - this.h / 3 + 50
        this.cancelButton.x =  -75
        this.cancelButton.y =  50
        this.playButton.x =  75
        this.playButton.y =  50

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
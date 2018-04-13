import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import UIButton from './uiElements/UIButton';
export default class AskVideoContainer extends UIList
{
    constructor()
    {
        super();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onCancel = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        // this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChild(this.prizeDark);

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('info_panel');
        this.infoContainer.addChild(shipInfoSprite);

        this.addChild(this.infoContainer)
        this.infoScale = config.height / this.infoContainer.height * 0.5
        this.infoContainer.scale.set(this.infoScale)
        this.infoContainer.pivot.x = shipInfoSprite.width / 2;
        this.infoContainer.pivot.y = shipInfoSprite.height / 2;

        this.infoContainer.x = config.width / 2;
        this.infoContainer.y = config.height / 2;

        this.titlePrizes = new PIXI.Sprite.from('video_rewards_title');
        this.titlePrizes.anchor.set(0.5, 1);
        this.titlePrizesScale = config.width / this.titlePrizes.width * 0.85
        this.titlePrizes.scale.set(this.titlePrizesScale)
        this.addChild(this.titlePrizes)
        this.titlePrizes.x = config.width / 2;
        this.titlePrizes.y = config.height / 2 - this.infoContainer.height * 0.5;

        this.chest = new PIXI.Sprite(PIXI.Texture.from('open_silver_chest'));
        this.chest.anchor.set(0.5);
        this.chestScale = shipInfoSprite.width / this.chest.width * 0.75
        this.chest.scale.set(this.chestScale);

        this.infoContainer.addChild(this.chest)
        this.chest.x = shipInfoSprite.width/2;
        this.chest.y = shipInfoSprite.height/2.5;

        this.confirmButton = new UIButton('icon_play_video')//PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        // this.confirmButton.anchor.set(0.5)
        this.playButtonScale = shipInfoSprite.height / this.confirmButton.height * 0.25;
        this.confirmButton.scale.set(this.playButtonScale)
        this.confirmButton.interactive = true;
        this.confirmButton.buttonMode = true;
        this.confirmButton.x = shipInfoSprite.width - this.confirmButton.width / 2- shipInfoSprite.width * 0.05;
        this.confirmButton.y = shipInfoSprite.height - this.confirmButton.height / 2- shipInfoSprite.width * 0.05;
        this.confirmButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.infoContainer.addChild(this.confirmButton)

        this.playButtonSin = 0;


        
        this.cancelButton = new UIButton('icon_close')
        // this.cancelButton.anchor.set(0.5)
        this.cancelButton.scale.set(shipInfoSprite.height / this.cancelButton.height * 0.15)
        this.cancelButton.interactive = true;
        this.cancelButton.buttonMode = true;
        this.cancelButton.x = this.cancelButton.width / 2+ shipInfoSprite.width * 0.05;
        this.cancelButton.y = shipInfoSprite.height - this.cancelButton.height / 2 - shipInfoSprite.width * 0.05;
        this.cancelButton.on('mouseup', this.cancel.bind(this)).on('touchend', this.cancel.bind(this));
        this.infoContainer.addChild(this.cancelButton)


        // this.descriptionLabel = new PIXI.Text('Watch a video\n and open a scret chest',
        // {
        //     fontFamily: 'blogger_sansregular',
        //     fontSize: '24px',
        //     fill: 0xFFFFFF,
        //     align: 'center',
        //     fontWeight: '800'
        // });
        // this.descriptionLabel.x = shipInfoSprite.width / 2 - this.descriptionLabel.width / 2;
        // this.descriptionLabel.y = 30
        // this.infoContainer.addChild(this.descriptionLabel)

    }
    confirm()
    {
        this.onConfirm.dispatch();
        this.hideCallback();
    }
    cancel()
    {
        this.onCancel.dispatch();
        this.hideCallback();
    }
    update(delta)
    {
        if (this.visible)
        {
            this.playButtonSin += 10 * delta
            this.playButtonSin %= Math.PI * 2;
            this.confirmButton.rotation = Math.sin(this.playButtonSin) * 0.1
            this.confirmButton.scale.set(this.playButtonScale + Math.cos(this.playButtonSin) * 0.01, this.playButtonScale + Math.sin(this.playButtonSin) * 0.01)

            this.chest.scale.set(this.chestScale + Math.cos(this.playButtonSin) * 0.01, this.chestScale + Math.sin(this.playButtonSin) * 0.01)


            // this.videoShine.rotation += delta * 1.5
            // this.videoShine.rotation %= Math.PI * 2;
        }
    }
    hideCallback()
    {
        this.onHide.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show()
    {
        this.infoContainer.scale.set(0)

        TweenLite.to(this.infoContainer.scale, 0.5,{x:this.infoScale, y:this.infoScale, ease:Back.easeOut})

        this.titlePrizes.scale.set(0);
        TweenLite.to(this.titlePrizes.scale, 1,
        {
            delay: 0.5,
            onStart:()=>{
                SOUND_MANAGER.play('pickup_star');
            },
            x: this.titlePrizesScale,
            y: this.titlePrizesScale,
            ease: Elastic.easeOut
        })


        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;
    }
}
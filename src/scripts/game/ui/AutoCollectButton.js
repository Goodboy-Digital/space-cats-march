import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class AutoCollectButton extends PIXI.Container
{
    constructor(catData, price)
    {
        super()
        this.enableAutoCollect = new Signals();

        this.container = new PIXI.Container();
        this.addChild(this.container);
        // this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 120, 40);
        this.backButton = new PIXI.Sprite.from('back_button');
        this.container.addChild(this.backButton);

        this.w = this.backButton.width;
        this.h = this.backButton.height;
        // this.background.alpha = 0
        // this.container.addChild(this.background)
        this.catData = catData;



        this.sprite = new PIXI.Sprite.from('engine_icon');
        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0, 0.5)
        this.sprite.scale.set(this.h / this.sprite.height * 0.5)
        this.sprite.x = 15;
        this.sprite.y = this.h / 2;
        this.interactive = true;
        this.buttonMode = true;

        this.spriteTrophy = new PIXI.Sprite.from('pickup_fish');
        this.container.addChild(this.spriteTrophy);
        this.spriteTrophy.anchor.set(1, 0.5)
        this.spriteTrophy.scale.set(this.h / this.spriteTrophy.height * 0.35)
        this.spriteTrophy.x = this.spriteTrophy.width / 2;
        this.spriteTrophy.y = this.h / 2;

        this.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        this.priceLabel = new PIXI.Text('100k',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xe5519b,
            align: 'center',
            fontWeight: '800'
        });
        this.container.addChild(this.priceLabel);
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
        this.reset()

        this.container.x = this.container.width / 2
        this.container.y = this.container.height / 2

    }
    updateData(catData)
    {
        this.catData = catData;
    }
    onClick()
    {
        if(this.enabled){
            return;
        }
        if (this.deactived)
        {
            this.shake();
        }
        else
        {
            this.backButton.tint = 0xFFFFFF;
            this.enableAutoCollect.dispatch(this);
        }
        // this.enable()
        // this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
    }
    deactive()
    {
        this.enabled = false;
        this.deactived = true;
        this.spriteTrophy.visible = true;
        this.sprite.x = 10;
        this.sprite.texture = new PIXI.Texture.from('deactive_engine');
        this.priceLabel.text = utils.formatPointsLabel(this.catData.autoCollectPrice / MAX_NUMBER);
        this.spriteTrophy.x = this.w - this.spriteTrophy.width / 2 + 5
        this.priceLabel.x = this.spriteTrophy.x - this.spriteTrophy.width - this.priceLabel.width - 5
        this.priceLabel.y = this.h / 2 - this.priceLabel.height / 2
        this.backButton.tint = 0xFFFFFF;
        this.priceLabel.style.fill = 0xe5519b;
    }
    reset()
    {
        this.enabled = false;
        this.deactived = false;
        this.spriteTrophy.visible = true;
        this.sprite.x = 10;
        this.sprite.texture = new PIXI.Texture.from('engine_icon');
        this.priceLabel.text = utils.formatPointsLabel(this.catData.autoCollectPrice / MAX_NUMBER);
        this.spriteTrophy.x = this.w - this.spriteTrophy.width / 2 + 5
        this.priceLabel.x = this.spriteTrophy.x - this.spriteTrophy.width - this.priceLabel.width - 5
        this.priceLabel.y = this.h / 2 - this.priceLabel.height / 2
        this.priceLabel.style.fill = 0xFFFFFF;
        this.backButton.tint = 0x6250e5;
    }
    enable()
    {
        this.enabled = true;
        this.deactived = false;
        this.sprite.texture = new PIXI.Texture.from('active_engine');
        this.spriteTrophy.visible = false;
        this.sprite.x = this.w / 2 - this.sprite.width / 2;
        this.priceLabel.text = '';
        this.backButton.tint = 0x6250e5;
        this.priceLabel.style.fill = 0xe5519b;
    }

    shake(force = 0.25, steps = 5, time = 0.4)
    {

        let timelinePosition = new TimelineLite();
        let positionForce = (force * -20);
        let spliterForce = (force * 20);
        let pos = [positionForce * 2, positionForce, positionForce * 2, positionForce, positionForce * 2, positionForce]
        let speed = time / pos.length;

        for (var i = pos.length; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this.container, speed,
            {
                rotation: i%2==0?0.1:-0.1,
                x: this.container.width / 2 + pos[i], //- positionForce / 2,
                // y: 0, //Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container, speed,
        {
            rotation:0,
            x: this.container.width / 2,
            // y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}
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
        // this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 120, 40);
        this.backButton = new PIXI.Sprite.from('back_button');
        this.addChild(this.backButton);

        this.w = this.backButton.width;
        this.h = this.backButton.height;
        // this.background.alpha = 0
        // this.addChild(this.background)
        this.catData = catData;


         
        this.sprite = new PIXI.Sprite.from('results_lock');
        this.addChild(this.sprite);
        this.sprite.anchor.set(0, 0.5)
        this.sprite.scale.set(this.h / this.sprite.height * 0.5)
        this.sprite.x = 15;
        this.sprite.y = this.h / 2;
        this.interactive = true;
        this.buttonMode = true;

        this.spriteTrophy = new PIXI.Sprite.from('pickup_fish');
        this.addChild(this.spriteTrophy);
        this.spriteTrophy.anchor.set(1, 0.5)
        this.spriteTrophy.scale.set(this.h / this.spriteTrophy.height * 0.5)
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
        this.addChild(this.priceLabel);
        this.reset()

    }
    updateData(catData)
    {
        this.catData = catData;
    }
    onClick()
    {
        this.enableAutoCollect.dispatch(this);
        this.enable()
            // this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
    }
    reset()
    {
        this.spriteTrophy.visible = true;
        this.sprite.x = 10;
        this.sprite.texture = new PIXI.Texture.from('results_lock');
        this.priceLabel.text = utils.formatPointsLabel(this.catData.autoCollectPrice / MAX_NUMBER);
        this.spriteTrophy.x = this.w - this.priceLabel.width/2 + 5
        this.priceLabel.x = this.spriteTrophy.x - this.spriteTrophy.width - this.priceLabel.width - 10
        this.priceLabel.y = this.h / 2 - this.priceLabel.height / 2
        this.backButton.tint = 0xFFFFFF;
    }
    enable()
    {
        this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
        this.spriteTrophy.visible = false;
        this.sprite.x = this.w / 2 - this.sprite.width / 2;
        this.priceLabel.text = '';
        this.backButton.tint = 0x6250e5;
    }
}
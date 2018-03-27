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
        this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 120, 40);
        this.w = this.background.width;
        this.h = this.background.height;
        this.background.alpha = 0
        this.addChild(this.background)
        this.catData = catData;
        this.sprite = new PIXI.Sprite.from('results_lock');
        this.addChild(this.sprite);
        this.sprite.anchor.set(0, 0.5)
        this.sprite.scale.set(this.h / this.sprite.height)
        this.sprite.x = 10;
        this.sprite.y = this.background.height / 2;
        this.interactive = true;
        this.buttonMode = true;

        this.spriteTrophy = new PIXI.Sprite.from('pickup_fish');
        this.addChild(this.spriteTrophy);
        this.spriteTrophy.anchor.set(0, 0.5)
        this.spriteTrophy.scale.set(this.h / this.spriteTrophy.height * 0.75)
        this.spriteTrophy.x = this.spriteTrophy.width / 2;
        this.spriteTrophy.y = this.background.height / 2;

        this.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        this.priceLabel = new PIXI.Text('100k',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '20px',
            fill: 0xFFFFFF,
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
        this.priceLabel.x = this.sprite.x + this.sprite.width + 5
        this.spriteTrophy.x = this.priceLabel.x + this.priceLabel.width + 5
        this.priceLabel.y = this.sprite.height / 2 - this.priceLabel.height / 2
    }
    enable()
    {
        this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
        this.spriteTrophy.visible = false;
        this.sprite.x = this.w / 2 - this.sprite.width / 2;
        this.priceLabel.text = '';
    }
}
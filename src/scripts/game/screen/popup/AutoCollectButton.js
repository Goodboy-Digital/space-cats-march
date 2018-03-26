import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
export default class AutoCollectButton extends PIXI.Container
{
    constructor(catID, price)
    {
        super()
        this.catID = catID;
        this.sprite = new PIXI.Sprite.from('results_lock');
        this.addChild(this.sprite);
        this.sprite.anchor.set(0.5)
        this.interactive = true;
        this.buttonMode = true;
        this.enableAutoCollect = new Signals();

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
        this.priceLabel.x = this.sprite.x + this.sprite.width / 2 + 10

    }
    onClick(){
    	this.enableAutoCollect.dispatch(this);
    	this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
    }
    reset(){
    	this.sprite.texture = new PIXI.Texture.from('results_lock');
    }
    enable(){
    	this.sprite.texture = new PIXI.Texture.from('results_newcat_star');
    }
}
import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class HudItensContainer extends PIXI.Container
{
    constructor()
    {
        super();

        this.onClickItem = new Signals();

        this.backButton = new PIXI.Sprite.from('game_button_base');
        this.addChild(this.backButton);
        this.backButton.anchor.set(0.5);

        this.sprite = new PIXI.Sprite.from('spaceship');
        this.sprite.anchor.set(0.5);
        this.backButton.addChild(this.sprite);

        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

    }
    setTexture(texture)
    {
        this.sprite.texture = new PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.65);
    }
    onClick(){
        this.onClickItem.dispatch(this);
    }
    hide()
    {
        // this.visible = false;
    }
    show()
    {
        // this.visible = true;
    }
}
import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
export default class UIBurron extends PIXI.Container
{
    constructor(texture)
    {
        super();

        this.back = new PIXI.Sprite(PIXI.Texture.from('button_off'));
        this.back.anchor.set(0.5)

        this.icon = new PIXI.Sprite(PIXI.Texture.from(texture));
        this.icon.anchor.set(0.5)

        this.addChild(this.back);
        this.addChild(this.icon);
    }
}
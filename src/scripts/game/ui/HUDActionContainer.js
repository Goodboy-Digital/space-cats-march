import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hudElements/CircleCounter';
export default class HUDActionContainer extends PIXI.Container {
    constructor(actionData) {
        super();
        this.actionData = actionData;
        this.onClickItem = new Signals();
        this.onFinishAction = new Signals();

        this.backButton = new PIXI.Sprite.from('game_button_base');
        // this.backButton.anchor.set(0.5);

        this.sprite = new PIXI.Sprite.from('spaceship');
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.backButton.width / 2;
        this.sprite.y = this.backButton.height / 2;
        this.backButton.addChild(this.sprite);

        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        this.tokenPrice = new PIXI.Sprite.from('token_price');
        this.tokenPrice.anchor.set(0.5);

        this.priceLabel = new PIXI.Text(this.actionData.cost, {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.tokenPrice.addChild(this.priceLabel)

        if (this.actionData) {
            this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
            this.setTexture(this.actionData.icon)
            this.counter = new CircleCounter(60, 58);
            this.counter.build(0xefd9f2, 0xFFFFFF)
            this.addChild(this.counter);
            this.counter.update(0)
            this.counter.x = 55
            this.counter.y = 55
            this.backButton.scale.set(110 / this.backButton.height)
        }

        this.tokenPrice.scale.set(110 / this.tokenPrice.height * 0.4)
        this.addChild(this.backButton);
        this.addChild(this.tokenPrice);
        this.updateData(this.actionData)
        this.timer = 0;
    }
    setTexture(texture) {
        this.sprite.texture = new PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.5);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.backButton.width / 2 - 10;
        this.sprite.y = this.backButton.height / 2 - 10;
        this.tokenPrice.x = this.backButton.width/2 + 10;
        this.tokenPrice.y = this.backButton.height/2 + 10;
    }
    enable() {
        this.disabled = false;
        this.backButton.tint = 0xFFFFFF
        this.tokenPrice.texture = PIXI.Texture.from('token_price');
    }
    disable() {
        this.disabled = true;
        this.backButton.tint = 0xAAAAAA
        this.tokenPrice.texture = PIXI.Texture.from('token_grey');
    }
    reset() {
        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.acting = false;
        this.backButton.tint = 0xFFFFFF
        if (this.actionData) {
            this.counter.update(0, true);
        }
    }
    updateData(actionData) {
        this.actionData = actionData;
        this.priceLabel.text = this.actionData.cost;
        this.priceLabel.pivot.x = this.priceLabel.width / 2;
        this.priceLabel.pivot.y = this.priceLabel.height / 2;
        if(this.actionData.cost <= GAME_DATA.sessionData.tokens){
            this.enable(); 
        }else{
            this.disable();             
        }
    }
    finishReset() {
        if (this.actionData) {
            this.counter.update(0, true);
            this.counter.scale.set(0.75);
            TweenLite.to(this.counter.scale, 0.5, {x:1,y:1, ease:Back.easeOut})
        }
    }
    onClick() {
        if (this.acting || this.disabled) {
            return;
        }
        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless_green');
        this.acting = true;
        this.onClickItem.dispatch(this.actionData);
        if (this.actionData) {
            this.timer = this.actionData.time;
            this.counter.update(0, true);
        }
    }
    updateCounter(value) {
        if (value >= 1) {
            this.finishAction();
        }else{
            this.counter.update(value)
        }
    }
    finishAction() {
        this.acting = false;
        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.finishReset();
        this.backButton.tint = 0xFFFFFF
        this.onFinishAction.dispatch(this.actionData);
    }
    update(delta) {
        if (!this.actionData) {
            return;
        }
        if (this.acting) {
            this.timer -= delta;
            this.backButton.tint = 0xAAAAAA
            this.updateCounter(1 - this.timer / this.actionData.time);
        }
    }
    hide() {
        // this.visible = false;
    }
    show() {
        // this.visible = true;
    }
}
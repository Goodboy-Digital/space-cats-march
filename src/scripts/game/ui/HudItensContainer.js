import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hudElements/CircleCounter';
export default class HUDItensContainer extends PIXI.Container {
    constructor(actionData) {
        super();
        this.actionData = actionData;
        this.onClickItem = new Signals();
        this.onFinishAction = new Signals();

        this.backButton = new PIXI.Sprite.from('game_button_base');
        this.backButton.anchor.set(0.5);



        this.sprite = new PIXI.Sprite.from('spaceship');
        this.sprite.anchor.set(0.5);
        this.backButton.addChild(this.sprite);

        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        if (this.actionData) {
            this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
            this.setTexture(this.actionData.icon)
            console.log(this.backButton.width / 2 + 10);
            this.counter = new CircleCounter(60, 50);
            this.counter.build(0xefd9f2, 0xFFFFFF)
            this.addChild(this.counter);
            this.counter.update(0)
            this.backButton.scale.set(100 / this.backButton.height)
        }

        this.addChild(this.backButton);
        this.timer = 0;
    }
    setTexture(texture) {
        this.sprite.texture = PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.5);
    }
    reset() {
        if (this.actionData) {
            this.counter.update(0, true);
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
        if (this.acting) {
            return;
        }
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
        this.finishReset();
        this.onFinishAction.dispatch(this.actionData);
    }
    update(delta) {
        if (!this.actionData) {
            return;
        }
        if (this.acting) {
            this.timer -= delta;
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
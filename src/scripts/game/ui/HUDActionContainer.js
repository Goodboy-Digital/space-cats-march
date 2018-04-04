import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CircleCounter from './hudElements/CircleCounter';
export default class HUDActionContainer extends PIXI.Container {
    constructor(actionData) {
        super();
        this.actionData = actionData;
        this.actionDataStatic = GAME_DATA.actionsDataStatic[this.actionData.id];
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

        this.coolDownLabel = new PIXI.Text('00:00', {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.backButton.addChild(this.coolDownLabel);

        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.setTexture(this.actionDataStatic.icon)
        this.counter = new CircleCounter(60, 58);
        this.counter.build(0xefd9f2, 0xFFFFFF)
        this.addChild(this.counter);
        this.counter.update(0)
        this.counter.x = 55
        this.counter.y = 55
        

        // this.tokenPrice.scale.set(110 / this.tokenPrice.height * 0.4)
        this.addChild(this.backButton);
        // this.addChild(this.tokenPrice);
        this.updateData(this.actionData)
        this.timer = 0;
        this.cooldown = 0;
    }
    setTexture(texture) {
        this.sprite.texture = new PIXI.Texture.from(texture);
        this.sprite.scale.set(this.backButton.height / this.sprite.height * 0.5);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.backButton.width / 2;
        this.sprite.y = this.backButton.height / 2;
        this.coolDownLabel.text = '00:00';
        this.coolDownLabel.pivot.x = this.coolDownLabel.width / 2;
        this.coolDownLabel.pivot.y = this.coolDownLabel.height / 2;
        this.coolDownLabel.x = this.backButton.width / 2;
        this.coolDownLabel.y = this.backButton.height / 2;
        this.coolDownLabel.alpha = 0;
        this.backButton.scale.set(110 / this.backButton.height)
    }
    enable() {
        this.disabled = false;
        this.backButton.tint = 0xFFFFFF
            // this.tokenPrice.texture = PIXI.Texture.from('token_price');
    }
    disable() {
        this.disabled = true;
        // this.ableToAct = false;
        this.backButton.tint = 0xAAAAAA
            // this.tokenPrice.texture = PIXI.Texture.from('token_grey');
    }
    reset() {
        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless');
        this.acting = false;
        this.backButton.tint = 0xFFFFFF
        this.coolDownLabel.text = '';
        this.sprite.tint = 0xFFFFFF;
        this.cooldown = 0;
        if (this.actionData) {
            this.counter.update(0, true);
        }
        // this.ableToAct = true;
    }
    updateData(actionData) {
        this.actionData = actionData;
        this.actionDataStatic = GAME_DATA.actionsDataStatic[this.actionData.id];
        this.ableToAct = true;
        // this.setTexture(this.actionDataStatic.icon)
    }
    finishReset() {
        if (this.actionData) {
            this.counter.update(0, true);
            this.counter.scale.set(0.75);
            TweenLite.to(this.counter.scale, 0.5, {
                x: 1,
                y: 1,
                ease: Back.easeOut
            })
            TweenLite.to(this.coolDownLabel, 0.5, {
                alpha: 1
            })
            this.sprite.tint = 0;
            this.cooldown = this.actionDataStatic.waitTime;
            this.ableToAct = false;
        }
    }
    onClick() {
        if (!this.ableToAct) {
            return;
        }
        this.coolDownLabel.alpha = 0;
        this.backButton.texture = PIXI.Texture.from('game_button_base_borderless_green');
        this.acting = true;
        this.ableToAct = false;
        this.onClickItem.dispatch(this.actionData);
        this.timer = this.actionDataStatic.time;
        this.counter.update(0, true);
    }
    updateCounter(value) {
        if (value >= 1) {
            this.finishAction();
        } else {
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
        if (this.acting) {
            this.timer -= delta;
            this.backButton.tint = 0xAAAAAA
            this.updateCounter(1 - this.timer / this.actionDataStatic.time);
        } else if (this.cooldown > 0) {
            let minutes = parseInt(this.cooldown / 60, 10)
            let seconds = parseInt(this.cooldown % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            this.coolDownLabel.text = minutes + ':' + seconds;

            this.cooldown -= delta;
            if (this.cooldown <= 0) {
                this.cooldown = 0;
                this.finishCooldown();
            }
        }
    }
    finishCooldown() {
        this.coolDownLabel.alpha = 0;
        this.coolDownLabel.text = '';
        this.ableToAct = true;
        this.sprite.tint = 0xFFFFFF;
    }
    hide() {
        // this.visible = false;
    }
    show() {
        // this.visible = true;
    }
}
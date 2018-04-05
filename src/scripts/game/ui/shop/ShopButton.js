import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
export default class ShopButton extends PIXI.Container {
    constructor(catData, price) {
        super()
        this.enableAutoCollect = new Signals();

        this.onClickItem = new Signals();

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



        this.sprite = new PIXI.Sprite.from(GAME_DATA.moneyData.softIcon);
        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0, 0.5)
        this.defaultSpriteScale = this.h / this.sprite.height * 0.5;
        this.sprite.scale.set(this.defaultSpriteScale)
        this.sprite.x = 15;
        this.sprite.y = this.h / 2;
        this.interactive = true;
        this.buttonMode = true;

        this.on('mouseup', this.onClick.bind(this)).on('touchend', this.onClick.bind(this));

        this.priceLabel = new PIXI.Text('100k', {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xe5519b,
            align: 'center',
            fontWeight: '800'
        });
        this.container.addChild(this.priceLabel);
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
        // this.reset()

        this.container.x = this.container.width / 2
        this.container.y = this.container.height / 2

    }
    // updateData(catData) {
    //     this.catData = catData;
    // }
    onClick() {
        if (this.deactived) {
            this.shake();
        } else {
            // this.backButton.tint = 0xFFFFFF;
            this.onClickItem.dispatch(this);
        }
        // this.enable()
        // this.sprite.texture = PIXI.Texture.from('results_newcat_star');
    }
    setType(type = 'soft') {
        this.type = type;
        if (type == 'soft') {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.moneyData.softIcon);
        } else if (type == 'hard') {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.trophyData.icon);
        } else {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.moneyData.videoIcon);
        }

        this.defaultSpriteScale = this.h / (this.sprite.height / this.sprite.scale.y) * 0.65;
        this.sprite.scale.set(this.defaultSpriteScale)

        if (type == 'video') {
            this.sprite.x = this.w / 2 - this.sprite.width / 2;
            this.priceLabel.visible = false;
        }

    }
    updateCoast(value) {
        this.priceLabel.text = value
        this.priceLabel.x = this.backButton.width / 2
        this.priceLabel.y = this.h / 2 - this.priceLabel.height / 2
    }
    deactiveMax() {
        this.enabled = false;
        this.deactived = true;
        this.backButton.tint = 0xFFFFFF;
        this.priceLabel.style.fill = 0xe5519b;
        this.priceLabel.text = 'MAX'
        this.priceLabel.x = this.backButton.width / 2 - this.priceLabel.width / 2;
        this.backButton.alpha = 1;
        this.sprite.visible = false;
    }
    deactive() {
        this.enabled = false;
        this.deactived = true;
        this.sprite.visible = true;
        this.backButton.tint = 0xFFFFFF;
        this.priceLabel.style.fill = 0xe5519b;
        this.backButton.alpha = 1;
    }
    enable() {
        this.enabled = true;
        this.deactived = false;
        this.sprite.visible = true;
        this.backButton.tint = 0x6250e5;
        this.backButton.alpha = 1;
        this.priceLabel.style.fill = 0xFFFFFF;
    }

    shake(force = 0.25, steps = 5, time = 0.4) {

        let timelinePosition = new TimelineLite();
        let positionForce = (force * -20);
        let spliterForce = (force * 20);
        let pos = [positionForce * 2, positionForce, positionForce * 2, positionForce, positionForce * 2, positionForce]
        let speed = time / pos.length;

        for (var i = pos.length; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.container, speed, {
                rotation: i % 2 == 0 ? 0.1 : -0.1,
                x: this.container.width / 2 + pos[i], //- positionForce / 2,
                // y: 0, //Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container, speed, {
            rotation: 0,
            x: this.container.width / 2,
            // y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}
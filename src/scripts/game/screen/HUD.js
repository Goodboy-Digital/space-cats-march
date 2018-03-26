import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class HUD extends PIXI.Container
{
    constructor(game)
    {
        super();
        console.log(game);
        this.game = game;
        this.marginTop = config.height * 0.01
        this.h = config.height * 0.12


        let hudBackground = new PIXI.Sprite.from('base-gradient');
        this.addChild(hudBackground)
        hudBackground.scale.set(this.h / hudBackground.height)
        hudBackground.anchor.y = 0.5
        hudBackground.scale.y *= -1
        hudBackground.tint = 0;
        hudBackground.width = config.width / hudBackground.scale.x * 1.5
        hudBackground.x = config.width / hudBackground.width / 2

        hudBackground = new PIXI.Sprite.from('base-gradient');
        this.addChild(hudBackground)
        hudBackground.scale.set(this.h / hudBackground.height)
        hudBackground.anchor.y = 0.5
        hudBackground.scale.y *= -1
        hudBackground.tint = 0;
        hudBackground.width = config.width / hudBackground.scale.x * 1.5
        hudBackground.x = config.width / hudBackground.width / 2

        hudBackground = new PIXI.Sprite.from('base-gradient');
        this.addChild(hudBackground)
        hudBackground.scale.set(this.h / hudBackground.height)
        hudBackground.anchor.y = 0.5
        hudBackground.scale.y *= -1
        hudBackground.tint = 0;
        hudBackground.width = config.width / hudBackground.scale.x * 1.5
        hudBackground.x = config.width / hudBackground.width / 2



        this.pointsLabel = new PIXI.Text(utils.formatPointsLabel(0),
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '30px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        this.addChild(this.pointsLabel);

        this.lifesLabel = new PIXI.Text(9,
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '30px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });

        this.lifesLabel.x = 100;

        this.addChild(this.lifesLabel);



        this.gameStart = false;


        this.powerBarContainer = new PIXI.Container();
        this.powerBarBackground = new PIXI.Sprite.from('powerbar_border');
        this.powerBarBarBg = new PIXI.Sprite.from('powerbar_bar');
        this.powerBarBar = new PIXI.Sprite.from('powerbar_bar');
        this.powerBarMask = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, this.powerBarBar.width, this.powerBarBar.height);

        this.powerBarContainer.addChild(this.powerBarBackground)
        this.powerBarContainer.addChild(this.powerBarBarBg)
        this.powerBarContainer.addChild(this.powerBarBar)
        this.powerBarContainer.addChild(this.powerBarMask)
        this.powerBarBarBg.tint = 0;
        this.powerBarBarBg.alpha = 0.5
        this.powerBarBarBg.x = this.powerBarBackground.width / 2 - this.powerBarBarBg.width / 2
        this.powerBarBarBg.y = this.powerBarBackground.height / 2 - this.powerBarBarBg.height / 2

        this.powerBarBar.x = this.powerBarBackground.width / 2 - this.powerBarBar.width / 2
        this.powerBarBar.y = this.powerBarBackground.height / 2 - this.powerBarBar.height / 2

        this.powerBarMask.x = this.powerBarBar.x
        this.powerBarMask.y = this.powerBarBar.y
        this.powerBarBar.mask = this.powerBarMask;
        this.addChild(this.powerBarContainer);
        this.powerBarMask.scale.x = 0;
        this.updatePowerBar(0);

        this.powerBarContainer.pivot.x = this.powerBarContainer.width / 2;
        // this.powerBarContainer.scale.set(this.powerBarContainer.height /this.h * 0.9)
        this.powerBarContainer.scale.set(config.width / this.powerBarContainer.width * 0.5)
        this.powerBarContainer.x = config.width / 2;
        this.powerBarContainer.y = this.marginTop


        this.catHead = new PIXI.Sprite.from('icon_lives');
        this.addChild(this.catHead);
        this.catHead.anchor.set(0.5);
        this.catHeadScale = this.powerBarContainer.height / this.catHead.width * 0.75;
        this.catHead.scale.set(this.catHeadScale)
        this.catHead.x = config.width - this.catHead.width - this.marginTop
        this.catHead.y = this.powerBarContainer.y + this.powerBarContainer.height / 2
        this.catRotationSin = 0;

        this.lifesLabel.scale.set(this.powerBarContainer.height / this.lifesLabel.height * 0.75)
        this.lifesLabel.x = this.catHead.x - this.lifesLabel.width - this.catHead.width / 1.25
        // this.lifesLabel.pivot.y = this.lifesLabel.height / 2;
        // this.lifesLabel.y = this.catHead.y
        this.lifesLabel.y = this.catHead.y - this.lifesLabel.height / 2
        // this.catHead.scale.set(0,2)

        this.pointsIcon = new PIXI.Sprite.from('icon_paw');
        this.addChild(this.pointsIcon);
        this.pointsIcon.anchor.set(0.5);
        this.pointsIconScale = this.powerBarContainer.height / this.pointsIcon.width * 0.75;
        this.pointsIcon.scale.set(this.pointsIconScale)
        this.pointsIcon.x = this.marginTop + this.pointsIcon.width / 2;
        this.pointsIcon.y = this.powerBarContainer.y + this.powerBarContainer.height / 2
        this.catRotationSin = 0;

        // this.pointsLabel.x = this.catHead.x - this.pointsLabel.width - this.catHead.width/2 - 20
        this.pointsLabel.scale.set(this.powerBarContainer.height / this.pointsLabel.height * 0.75)
        this.pointsLabel.x = this.pointsIcon.x + this.pointsIcon.width / 1.25
        // this.pointsLabel.pivot.y = this.pointsLabel.height / 2;
        this.pointsLabel.y = this.pointsIcon.y - this.pointsLabel.height / 2
        this.catHead.scale.set(0, 2)


        this.forceQuite = new PIXI.Sprite.from('pickup_bubble');
        this.addChild(this.forceQuite);
        this.forceQuite.anchor.set(0.5);
        this.forceQuiteScale = this.powerBarContainer.height / this.forceQuite.width * 2;
        this.forceQuite.scale.set(this.forceQuiteScale)
        this.forceQuite.x = config.width - this.forceQuite.width// + this.marginTop
        this.forceQuite.y = this.forceQuite.height
        
        this.onForceGameOver = new Signals();
        this.forceQuite.interactive = true;
        this.forceQuite.buttonMode = true;

        this.forceQuite.on('mouseup', this.gameOver.bind(this)).on('touchend', this.gameOver.bind(this));
        // this.catRotationSin = 0;
        // this.forceQuite.visible = false;

        this.hide(true);


    }
    gameOver(){
        this.onForceGameOver.dispatch();
    }
    updatePowerBar(value, type = 0, force)
    {
        TweenLite.killTweensOf(this.powerBarMask.scale)
        TweenLite.to(this.powerBarMask.scale, force?0:0.5,
        {
            x: value
        })
        if (type == 0)
        {
            this.powerBarBar.tint = 0xFFFFFF;
        }
        else if (type == 1)
        {
            this.powerBarBar.tint = 0x00FFFF;
        }
        else if (type == 2)
        {
            this.powerBarBar.tint = 0xFF00FF;
        }
    }
    hide(force)
    {

        TweenLite.to(this, force ? 0 : 0.5,
        {
            y: -200
        })
    }
    startGame()
    {
        this.catHead.rotation = 0;
        TweenLite.to(this, 0.5,
        {
            y: 0,
            ease: Elastic.easeOut
        })
        TweenLite.to(this.catHead.scale, 0.75,
        {
            x: this.catHeadScale,
            y: this.catHeadScale,
            ease: Elastic.easeOut,
            onComplete: () =>
            {
                this.gameStart = true;
            }
        });

    }
    update(delta)
    {
        if (!this.gameStart)
        {
            return;
        }
        return
        this.catRotationSin += delta * 10;
        this.catHead.rotation = Math.sin(this.catRotationSin) * 0.1

        this.catHead.scale.set(Math.cos(this.catRotationSin) * 0.05 + this.catHeadScale, Math.sin(this.catRotationSin) * 0.05 + this.catHeadScale)
    }
    updateHUD(points, lifes)
    {
        this.pointsLabel.text = utils.formatPointsLabel(points)
        this.lifesLabel.text = lifes
    }
}
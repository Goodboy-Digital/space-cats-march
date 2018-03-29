import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class SpaceShipContainer extends PIXI.Container
{
    constructor()
    {
        super();
        this.onOpenInfo = new Signals();
        this.onCloseInfo = new Signals();
        this.onConfirm = new Signals();
        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.spaceShipSin = 0;
        this.spaceShipBubble = new PIXI.Sprite.from('pickup_bubble');
        this.spaceShipBubble.anchor.set(0.5, 0.5);
        this.container.addChild(this.spaceShipBubble);
        this.spaceShipBubble.interactive = true;
        this.spaceShipBubble.buttonMode = true;
        this.spaceShipBubble.on('mouseup', this.openSpaceshipInfo.bind(this)).on('touchend', this.openSpaceshipInfo.bind(this));

        let trophyIcon = new PIXI.Sprite.from('spaceship');
        trophyIcon.anchor.set(0.5, 0.5);
        trophyIcon.scale.set(0.3)
        this.container.addChild(trophyIcon);

        this.availableTrohpy = new PIXI.Text('1.5T',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.availableTrohpy.pivot.x = this.availableTrohpy.width / 2;
        this.availableTrohpy.y = -15;

        this.containerScale = config.width / this.container.width * 0.25
        this.container.scale.set(this.containerScale)

        this.infoIcon = new PIXI.Sprite.from('info');
        this.infoIcon.anchor.set(0.5, 0.5);
        this.container.addChild(this.infoIcon);
        this.infoIcon.x = this.spaceShipBubble.width / 3.5;
        this.infoIcon.y = this.spaceShipBubble.height / 3.5;


        //INFO
        this.spaceShipInfoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('score_plinth');
        this.spaceShipInfoContainer.addChild(shipInfoSprite);

        let fishIcon = new PIXI.Sprite.from('pickup_fish');
        fishIcon.anchor.set(0.5, 0.5);
        fishIcon.x = fishIcon.width + 20
        fishIcon.y = shipInfoSprite.height / 2
        shipInfoSprite.addChild(fishIcon);


        let sellCatsInfo = new PIXI.Text('Do you want change your cats by fish?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        shipInfoSprite.addChild(sellCatsInfo);
        sellCatsInfo.x = shipInfoSprite.width / 2 - sellCatsInfo.width / 2
        sellCatsInfo.y = 20

        this.spaceShipInfoLabel = new PIXI.Text('x 582',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '64px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        this.spaceShipInfoLabel.x = fishIcon.x + fishIcon.width - 20
        this.spaceShipInfoLabel.y = fishIcon.y - this.spaceShipInfoLabel.height / 2
        shipInfoSprite.addChild(this.spaceShipInfoLabel);
        
        this.confirmSpaceship = new PIXI.Sprite.from('rocket_button_off');
        this.confirmSpaceship.anchor.set(0.5);
        this.confirmSpaceship.scale.set(0.75);

        this.confirmSpaceship.x = shipInfoSprite.width - this.confirmSpaceship.width / 2 - (shipInfoSprite.height - this.confirmSpaceship.height) / 2
        this.confirmSpaceship.y = shipInfoSprite.height / 2;
        shipInfoSprite.addChild(this.confirmSpaceship);

        shipInfoSprite.scale.set(shipInfoSprite.width / config.width * 0.75)
        this.spaceShipInfoContainer.x = -this.spaceShipInfoContainer.width
        this.container.addChild(this.spaceShipInfoContainer);

        this.spaceShipInfoContainer.visible = false;
        this.confirmSpaceship.interactive = true;
        this.confirmSpaceship.buttonMode = true;
        this.confirmSpaceship.on('mousedown', this.onSpaceshipClick.bind(this)).on('touchstart', this.onSpaceshipClick.bind(this));

    }
    onSpaceshipClick(){
        this.onConfirm.dispatch();
    }
    closeSpaceship()
    {
        this.onCloseInfo.dispatch();
        TweenLite.to(this.spaceShipInfoContainer, 0.25,
        {
            alpha: 0,
            onComplete: () =>
            {
                this.spaceInfoOpen = false;
                this.spaceShipInfoContainer.visible = false;
                this.container.interactive = true;
            }
        })

    }
    openSpaceshipInfo(){
        this.spaceShipInfoLabel.text = 'x' + utils.formatPointsLabel(GAME_DATA.getNumberTrophyToSend() / MAX_NUMBER);

        this.spaceShipInfoContainer.alpha = 0;
        this.spaceShipInfoContainer.visible = true;
        TweenLite.to(this.spaceShipInfoContainer, 0.5,
        {
            alpha: 1,
        })
        this.spaceInfoOpen = true;

        this.onOpenInfo.dispatch();
    }
    update(delta)
    {
        this.spaceShipSin += this.spaceInfoOpen ? 0.005 : 0.05
        this.spaceShipSin %= Math.PI * 2;
        this.infoIcon.rotation = -this.container.rotation;
        this.container.rotation = Math.sin(this.spaceShipSin) * 0.1 + 0.2
        this.container.scale.set(this.containerScale + Math.cos(this.spaceShipSin) * 0.01, this.containerScale + Math.sin(this.spaceShipSin) * 0.01)
        this.spaceShipInfoContainer.rotation = -this.container.rotation;
    }
}
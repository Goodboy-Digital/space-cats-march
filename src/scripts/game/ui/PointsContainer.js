import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class PointsContainer extends PIXI.Container
{
    constructor()
    {
        super();

        this.pointsContainer = new PIXI.Container();
        this.currentPointsSprite = new PIXI.Sprite.from('score_plinth');
        this.currentPointsSprite.scale.set(config.height / this.currentPointsSprite.height * 0.1)
        this.pointsContainer.addChild(this.currentPointsSprite);

        this.pointsLabelInfo = new PIXI.Text('YOUR SCORE',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.pointsLabelInfo.pivot.x = this.pointsLabelInfo.width / 2;
        this.pointsLabelInfo.pivot.y = this.pointsLabelInfo.height;
        this.pointsLabelInfo.y = -this.pointsLabelInfo.height;
        this.currentPointsSprite.addChild(this.pointsLabelInfo);


        this.currentPointsLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '124px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;
        this.currentPointsLabel.y = 10;
        this.currentPointsSprite.anchor.set(0.5);
        this.currentPointsSprite.addChild(this.currentPointsLabel);


        this.currentHighscoreSprite = new PIXI.Sprite.from('score_plinth');
        this.currentHighscoreSprite.scale.set(config.height / this.currentHighscoreSprite.height * 0.1)
        this.pointsContainer.addChild(this.currentHighscoreSprite);

        this.higscoreLabelInfo = new PIXI.Text('ALL TIME BEST',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabelInfo.pivot.x = this.higscoreLabelInfo.width / 2;
        this.higscoreLabelInfo.pivot.y = this.higscoreLabelInfo.height;
        this.higscoreLabelInfo.y = -this.higscoreLabelInfo.height;
        this.currentHighscoreSprite.addChild(this.higscoreLabelInfo);

        this.higscoreLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '124px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;
        this.higscoreLabel.y = 10;
        this.currentHighscoreSprite.anchor.set(0.5);
        this.currentHighscoreSprite.addChild(this.higscoreLabel);
        this.currentHighscoreSprite.y = this.currentPointsSprite.height + 10

        this.addChild(this.pointsContainer);
        // this.pointsContainer.x = config.width / 2
        // this.pointsContainer.y = config.height / 2 + this.currentPointsSprite.height + 10
    }
    updatePoints(current, high)
    {
    	// console.log(current, high);
        this.currentPointsLabel.text = current
        this.higscoreLabel.text = high

        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;

    }
}
import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
export default class InGameEffects
{
    constructor(game)
    {
        this.game = game;

    }


    addBombAreaBean(cat)
    {

        let angle = Math.PI / 4 //Math.atan2(cat.y - last.y, bomb.x - last.x) + Math.PI / 2;

        let graphicContainer = new PIXI.Container();
        graphicContainer.rotation = angle;
        let graphics = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, cat.width * 2, cat.width * 2);
        graphicContainer.addChild(graphics);
        cat.parent.addChild(graphicContainer);

        graphicContainer.position.set(cat.x, cat.y);
        graphics.pivot.x = graphics.width / 2;
        graphics.pivot.y = graphics.height / 2;
        graphics.scale.set(0, 0)
        graphics.alpha = 0.5;
        TweenLite.to(graphics.scale, 0.5,
        {
            x: 1,
            y: 1
        })
        TweenLite.to(graphicContainer, 0.75,
        {
            alpha: 0,
            onCompleteParams: [graphics],
            onComplete: function(toRemove)
            {
                if (toRemove && toRemove.parent)
                {
                    toRemove.parent.removeChild(toRemove);
                }
            }
        })

    }

    addBean(cat, last, delay = 0.25)
    {
        return
        let angle = -Math.atan2(cat.y - last.y, cat.x - last.x) + Math.PI / 2;

        let distance = utils.distance(cat.x, cat.y, last.x, last.y);
        let target = {
            x: 0,
            y: distance
        }
        let graphicContainer = new PIXI.Container();
        graphicContainer.rotation = angle;
        let graphics = new PIXI.Graphics().lineStyle(cat.width / 4, 0xFFFFFF).moveTo(0, 0).lineTo(0, target.y);
        graphicContainer.addChild(graphics);
        cat.parent.addChild(graphicContainer);
        graphics.alpha = 0.5;

        graphicContainer.position.set(cat.x, last.y);

        graphics.scale.set(2, 1)
        TweenLite.to(graphics.scale, 0.5,
        {
            delay: delay,
            x: 4,
            y: 0
        })
        TweenLite.to(graphics.scale, 0.25,
        {
            delay: 0.5 + delay,
            x: 0
        })
        TweenLite.to(graphicContainer, 0.75,
        {
            delay: delay,
            alpha: 0,
            onCompleteParams: [graphics],
            onComplete: function(toRemove)
            {
                if (toRemove && toRemove.parent)
                {
                    toRemove.parent.removeChild(toRemove);
                }
            }
        })

    }

    specialMode()
    {
    	let specContainer = new PIXI.Container();
		let graphics = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,config.width, config.height * 0.1)
		specContainer.addChild(graphics);
		graphics.alpha = 0.5;

		let tempLabel = new PIXI.Text('MEOWWWWW',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '64px',
            fill: 0x000000,
            align: 'center',
            fontWeight: '800'
        });
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.x = config.width / 2;
        tempLabel.y = specContainer.height / 2;
        specContainer.addChild(tempLabel);

		this.game.UIContainer.addChild(specContainer);
		specContainer.y = config.height / 2 - specContainer.height / 2;
        this.shake(tempLabel);
        TweenLite.to(specContainer, 0.5, {delay:1.2, alpha:0, y:specContainer.y - 50, onComplete:()=>{
        	if(specContainer && specContainer.parent){
        		specContainer.parent.removeChild(specContainer);
        	}
        }})
    }

    autocollectlMode()
    {
        let specContainer = new PIXI.Container();
        let graphics = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(0,0,config.width, config.height * 0.1)
        specContainer.addChild(graphics);
        graphics.alpha = 0.5;

        let tempLabel = new PIXI.Text('AUTO COLLECT',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.x = config.width / 2;
        tempLabel.y = specContainer.height / 2;
        specContainer.addChild(tempLabel);

        this.game.UIContainer.addChild(specContainer);
        specContainer.y = config.height / 2 - specContainer.height / 2;
        this.shake(tempLabel,0.5);
        TweenLite.to(specContainer, 0.5, {delay:1.2, alpha:0, y:specContainer.y - 50, onComplete:()=>{
            if(specContainer && specContainer.parent){
                specContainer.parent.removeChild(specContainer);
            }
        }})
    }

    shake(target, force = 3, steps = 12, time = 1)
    {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        let startPos = {x:target.x,y:target.y}
        for (var i = steps; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(target, speed,
            {
                x: startPos.x+Math.random() * positionForce - positionForce / 2,
                y: startPos.y+Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(target, speed,
        {
            x: startPos.x,
            y: startPos.y,
            ease: Elastic.easeOut
        }));
    }


    popLabel(pos, label, delay = 0, dir = 1, scale = 1, randonRotation = true)
    {
        let tempLabel = null;
        if (LABEL_POOL.length)
        {
            tempLabel = LABEL_POOL[0];
            tempLabel.text = label;
            LABEL_POOL.shift();
        }
        else
        {
            tempLabel = new PIXI.Text(label,
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '32px',
                fill: 0xFFFFFF,
                align: 'center',
                stroke: 0x9933CC,
                strokeThickness: 3,
                fontWeight: '800'
            });
        }
        this.game.UIContainer.addChild(tempLabel);
        tempLabel.x = pos.x;
        tempLabel.y = pos.y;
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.alpha = 0;
        tempLabel.scale.set(0);
        tempLabel.rotation = randonRotation ? Math.random() - 0.5 : 0;
        TweenLite.to(tempLabel.scale, 0.3,
        {
            x: scale,
            y: scale,
            ease: Back.easeOut
        })
        TweenLite.to(tempLabel, 1,
        {
            delay: delay,
            y: tempLabel.y - 50 * dir,
            rotation: 0,
            onStartParams: [tempLabel],
            onStart: function(temp)
            {
                temp.alpha = 1;
            }
        })
        TweenLite.to(tempLabel, 0.5,
        {
            delay: 0.5 + delay,
            alpha: 0,
            onCompleteParams: [tempLabel],
            onComplete: function(temp)
            {
                temp.parent.removeChild(temp);
                LABEL_POOL.push(temp);
            }
        })
    }
}
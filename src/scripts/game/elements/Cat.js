import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import Signals from 'signals';
export default class Cat extends PIXI.Container
{
    constructor(game)
    {
        super();
        this.game = game;
        let card = new PIXI.Container();

        this.w = PAWN.width * 2;


        // this.spriteDebug = new PIXI.Graphics().beginFill(0x0000ff).drawCircle(0, 0, this.w); //PIXI.Sprite.from('slot.png');

        this.spriteList = [];
        this.sin = 0;
        this.animationSpeed = 0.01;
        this.animationTimer = 0;
        this.currentSpriteID = 0;
        this.sprite = new PIXI.Sprite.from('cat_orange_00000');
        this.sprite.anchor.set(0.5, 0.5);
        this.container = new PIXI.Container();
        // this.container.addChild(this.spriteDebug);
        this.container.addChild(this.sprite);
        this.container.scale.set(PAWN.height / this.sprite.height * 4)

        this.addChild(this.container);

        this.sprite.alpha = 0;
        this.lane = 0;
        this.noScalable = false;
        this.onDie = new Signals();
        // this.reset();

        this.generalSpeed = 5;
    }
    reset(lane, catData)
    {
        this.timer = 0;
        this.animationSpeed = 0.005;
        this.lane = lane;
        this.catData = catData;
        this.catID = catData.catID;
        this.spriteList = CAT_LIST[catData.catID] //catData.animationList; //getPossibleCat();//CAT_LIST[this.lane]
        this.sprite.alpha = 1;
        this.sprite.texture = this.spriteList[this.currentSpriteID];
        this.sin = 0;
        this.onDie.removeAll();
        this.finishTimer = -1;
        this.noScalable = false;
        this.isFinished = false;
        this.dying = false;
        this.killed = false;
        this._scale = 1;
        // this.sprite.tint = 0xFFFF00;
        this.container.rotation = 0;
        this.sprite.scale.set(1);
        this.sprite.y = -this.sprite.height * 0.5 * this.sprite.anchor.y

        this.sprite.scale.set(0, 2)
        TweenLite.to(this.sprite.scale, 1,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });

        this.acceleration = {
            x: 20,
            y: 20
        }

        this.virtualVelocity = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.gravity = 0;

        this.angularSpeed = 0;
    }
    updateAnimation(delta)
    {
        this.animationTimer += delta * this._scale;
        if (this.animationTimer > this.animationSpeed)
        {
            this.animationTimer = 0;
            this.currentSpriteID++;
            this.currentSpriteID %= this.spriteList.length;
            this.sprite.texture = this.spriteList[this.currentSpriteID];
            this.sprite.rotation = Math.sin(this.sin) * 0.1 - 0.05;
            this.sin += 0.1;

            this.sprite.scale.set(Math.cos(this.sin * 3) * 0.05 + 0.95, Math.sin(this.sin * 3) * 0.05 + 0.95)
        }
    }
    update(delta)
    {
        if (this.killed)
        {
            return;
        }
        this.timer += delta;
        this.updateAnimation(delta);
        this.udpateVelocity();
        this.x += this.velocity.x * this._scale * delta;
        this.y += this.velocity.y * this._scale * delta;
        this.velocity.y += this.gravity * delta;
        this.container.rotation += this.angularSpeed * delta;
        if (this.y > config.height + 100 || this.y < 0)
        {
            this.killed = true;
        }
        if (this.finishTimer > 0)
        {
            this.finishTimer -= delta;
            if (this.finishTimer <= 0)
            {
                this.finish();
            }
        }
        if (!this.isFinished)
        {
            this.updateWaypoint();
        }
    }
    forceToWaypoint(wayp)
    {
        this.currentWaypointID = this.waypoints.length - wayp - 3
        if (this.currentWaypointID < 0)
        {
            this.currentWaypointID = 0
        }
        // console.log(    this.waypoints.length, wayp);
        this.currentWaypoint = this.waypoints[this.currentWaypointID];
        this.x = this.currentWaypoint.x
        this.y = this.currentWaypoint.y
    }
    speedScale(scale)
    {
        // return
        this._scale = scale;
    }
    updateWaypoint()
    {
        let dist = utils.distance(this.currentWaypoint.x, this.currentWaypoint.y, this.x, this.y);
        if (dist < 20)
        {
            this.nextWaypoints();
        }
    }
    nextWaypoints()
    {
        this.currentWaypointID++;
        if (this.currentWaypointID >= this.waypoints.length)
        {
            if (!this.game.isAutoCollectMode && !this.catData.isAuto)
            {
                this.finishTimer = 0.15;
            }
            else
            {
                this.onDie.dispatch(this, false);
                this.onDie.removeAll();
            }
            return;
        }
        this.currentWaypoint = this.waypoints[this.currentWaypointID];
        let angle = Math.atan2(this.currentWaypoint.y - this.y, this.currentWaypoint.x - this.x);
        this.virtualVelocity.x = Math.cos(angle) * this.totDist / this.generalSpeed
        this.virtualVelocity.y = Math.sin(angle) * this.totDist / this.generalSpeed
    }
    setWaypoints(waypoints)
    {
        // if(this.lane == 0)   {
        //     console.log(waypoints);
        // }
        this.waypoints = waypoints;
        this.currentWaypointID = 0;
        this.totDist = 0
        for (var i = 1; i < waypoints.length; i++)
        {
            this.totDist += utils.distance(waypoints[i].x, waypoints[i].y, waypoints[i - 1].x, waypoints[i - 1].y);
        }
        this.currentWaypoint = this.waypoints[this.currentWaypointID];
    }
    udpateVelocity()
    {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++)
        {
            if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]])
            {
                this.velocity[axis[i]] += this.acceleration[axis[i]];
                if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]])
                {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
            else if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]])
            {
                this.velocity[axis[i]] -= this.acceleration[axis[i]];
                if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]])
                {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity()
    {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
    }
    collectCat(dist)
    {
        this.isFinished = true;
        if (dist < PAWN.width * 0.2)
        {
            // this.sprite.tint = 0x00FF00
        }
        else if (dist < PAWN.width * 0.7)
        {
            // this.sprite.tint = 0xFF00FF
        }
        else
        {
            // this.sprite.tint = 0x00FFFF
        }
        this.noScalable = true;
        this.sprite.scale.set(1.5, 0.5);
        this.resetVelocity();
        this.finishTimer = -1;
        this.animationSpeed = 99999;
        // this.rotation = 0;
        this.container.rotation = 0;
        TweenLite.to(this.sprite.scale, 0.1,
        {
            x: 0.8,
            y: 1.2,
            onComplete: () =>
            {
                this.gravity = -350;
                this.velocity.x = 0;
                this.velocity.y = -Math.random() * 100 - 500;
                this.virtualVelocity.y = this.velocity.y;

            }
        });
    }
    finish()
    {
        // debugger
        // console.log(this.timer, this.lane);
        this.animationSpeed = 99999;
        this.isFinished = true;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
        this.destroy();

    }

    destroy(forced = false)
    {
        // console.log('DESTROY');
        this.animationSpeed = 99999;
        this.noScalable = true;
        this.dying = true;
        this.onDie.dispatch(this, forced);
        this.onDie.removeAll();
        this.velocity.x = Math.random() * 100;
        this.velocity.y = -Math.random() * 100 - 500;
        this.gravity = 4000;
        this.angularSpeed = (Math.random() * 0.1 - 0.05) * 60;
        this.sprite.scale.set(1.2, 0.8);
        TweenLite.to(this.sprite.scale, 0.5,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        });
    }
    resetCard()
    {}
    updateCard()
    {}
    forceDestroy()
    {
        this.parent.removeChild(this);
    }

}
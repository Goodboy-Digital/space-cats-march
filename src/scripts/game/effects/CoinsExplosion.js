import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class CoinsExplosion extends PIXI.Container
{
    constructor()
    {
        super();

        this.particles = [];

        this.maxParticles = 60;

    }

    update(delta)
    {
        if (this.particles && this.particles.length)
        {
            for (var i = this.particles.length - 1; i >= 0; i--)
            {
                let coin = this.particles[i];
                coin.x += coin.velocity.x * delta;
                coin.y += coin.velocity.y * delta;
                coin.velocity.y += coin.gravity * delta;
                coin.alpha -= 1 * delta;
                if (coin.alpha <= 0)
                {
                	if(coin.parent){
                		coin.parent.removeChild(coin);
                	}
                    window.COINS_POOL.push(coin);
                    this.particles.splice(i, 1)
                }
            }
        }
    }
    kill()
    {

    }
    show(position, tot = 10, customData = {})
    {

    	this.totParticles = tot;
        for (var i = 0; i < this.totParticles; i++)
        {
        	if(this.particles.lenght > this.maxParticles){
        		break;
        	}
            let coin;
            if (window.COINS_POOL.length)
            {
                coin = window.COINS_POOL[0];
                window.COINS_POOL.shift();
            }
            if (!coin)
            {
                coin = new PIXI.Sprite();
            }
            coin.texture = PIXI.Texture.from(customData.texture || 'cat_coin_particle')
            coin.gravity = (customData.gravity != undefined ? customData.gravity : 900)
            coin.alpha = 1
            coin.x = position.x;
            coin.y = position.y;
            coin.anchor.set(0.5)
            coin.scale.set(1)
            let scl = customData.scale || 0.03
            coin.scale.set(config.height / (coin.height * coin.scale.y) * (scl))
            let force = {
            	x: (customData.forceX != undefined ? customData.forceX : 400),
            	y: (customData.forceY != undefined ? customData.forceY : 500)
            }
            coin.velocity = {
                x: (Math.random() * 1 - 0.5) * force.x,
                y: (-Math.random() * 0.5 - 0.5) * force.y,
            }
            let parent = this;
            if(customData.customContainer){
            	parent = customData.customContainer;
            }
            parent.addChild(coin);
            this.particles.push(coin)
        }
    }
}
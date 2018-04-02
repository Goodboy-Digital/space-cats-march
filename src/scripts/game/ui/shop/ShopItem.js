import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import UIList from '../uiElements/UIList';
import ShopButton from './ShopButton';
export default class ShopItem extends UIList {
    constructor(rect = {
        w: 400,
        h: 80
    }) {
        super();

        this.w = rect.w;
        this.h = rect.h;
        // this.container = new PIXI.Container();
        // this.addChild(this.container);
        this.elementsList = [];
        this.rect = rect;

        this.itemIcon = new PIXI.Sprite.from('results_arrow');
        // this.itemIcon.scaleContent = true;
        this.itemIcon.listScl = 0.15;
        // this.itemIcon.fitHeight = 0.7;
        this.itemIcon.scaleContentMax = true;
        // this.itemIcon.scaleContent = false;
        this.elementsList.push(this.itemIcon);
        this.container.addChild(this.itemIcon);

        this.totalLabel = new PIXI.Text('LV1\nlalala', {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right',
            fontWeight: '800'
        });
        // this.totalLabel.fitHeight = 0.7;
        this.totalLabel.scaleContentMax = true;
        // this.totalLabel.scaleContent = false;
        this.elementsList.push(this.totalLabel);
        this.container.addChild(this.totalLabel);

        this.shopButton = new ShopButton();
        this.shopButton.onClickItem.add(this.onShopItem.bind(this));

        // this.totalLabel2.fitHeight = 0.7;
        this.shopButton.scaleContentMax = true;
        this.shopButton.listScl = 0.2;
        this.elementsList.push(this.shopButton);
        this.container.addChild(this.shopButton);

        this.onConfirmShop = new Signals();

        // this.addChild(this.container)

    }
    onShopItem(itemData) {
        this.onConfirmShop.dispatch(this.itemData, this.realCost);
    }
    updateValues() {
        let currentLevel = this.itemData.level;
        let levelPercent = currentLevel / this.staticData.levelMax;
        let shopItemValues = GAME_DATA.getShopValues(this.itemData);
        this.realCost = shopItemValues.cost;
        let cost = utils.formatPointsLabel(shopItemValues.cost / MAX_NUMBER);
        // let levelPercent = this.staticData.levelMax / ((this.staticData.levelMax + 1)  - currentLevel);
        this.shopButton.updateCoast(cost)
            // if(shopItemValues.cost >= GAME_DATA.moneyData.currentCoins){
        if (!GAME_DATA.canBuyIt(this.itemData)) {
            this.shopButton.deactive();
        } else {
            this.shopButton.enable();
        }
        this.itemIcon.texture = PIXI.Texture.from(this.staticData.icon)

        this.totalLabel.text = 'Level ' + this.itemData.level;
        this.updateHorizontalList();
    }
    updateData() {
        this.itemData = GAME_DATA.getUpdatedItem(this.itemData.dataType, this.itemData.id)
        this.updateValues();
    }
    setData(itemData, type) {
        this.itemData = itemData;
        this.dataType = type;
        this.staticData = GAME_DATA[type][this.itemData.id]
        this.shopButton.setType(this.staticData.shopType)

        this.updateValues();

    }
}
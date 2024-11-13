import Phaser from "phaser";

import { SCENE_KEYS } from "./scene-keys";
import forestBackgroundValue from '../../assets/images/monster-tamer/battle-backgrounds/forest-background.png'
import battleAssetHealthValue from '../../assets/images/kenneys-assets/ui-space-expansion/custom-ui.png'
import healthBarGreenRightAssetHealthValue from '../../assets/images/kenneys-assets/ui-space-expansion/barHorizontal_green_right.png'
import healthBarGreenMiddleAssetHealthValue from '../../assets/images/kenneys-assets/ui-space-expansion/barHorizontal_green_mid.png'
import healthBarGreenLeftAssetHealthValue from '../../assets/images/kenneys-assets/ui-space-expansion/barHorizontal_green_left.png'
import carnoMonster from '../../assets/images/monster-tamer/monsters/carnodusk.png'
import igniteMonster from '../../assets/images/monster-tamer/monsters/iguanignite.png'
import cursorImage from '../../assets/images/monster-tamer/ui/cursor.png'



import { BACKGROUND_KEYS, BATTLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../assets/assets-key";

export class PreloadScene extends Phaser.Scene{
    constructor(){
        super({key: SCENE_KEYS.PRELOAD_SCENE})
    }

    preload(){
        this.load.image(BACKGROUND_KEYS.FOREST, forestBackgroundValue)
        this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, battleAssetHealthValue)
        this.load.image(HEALTH_BAR_ASSET_KEYS.LEFT_CAP, healthBarGreenLeftAssetHealthValue)
        this.load.image(HEALTH_BAR_ASSET_KEYS.MIDDLE, healthBarGreenMiddleAssetHealthValue)
        this.load.image(HEALTH_BAR_ASSET_KEYS.RIGHT_CAP, healthBarGreenRightAssetHealthValue)
        this.load.image(MONSTER_ASSET_KEYS.CARNOUSK, carnoMonster)
        this.load.image(MONSTER_ASSET_KEYS.IGNITE, igniteMonster)
        this.load.image(UI_ASSET_KEYS.CURSOR, cursorImage)

    }

    create(){
        this.scene.start(SCENE_KEYS.BATTLE_SCENE)
    }


}
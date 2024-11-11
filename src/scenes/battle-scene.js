import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import { BACKGROUND_KEYS, BATTLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-key";


export class BattleScene extends Phaser.Scene{
    constructor(){
        super({key: SCENE_KEYS.BATTLE_SCENE})
    }



    create(){
        this.add.image(0,0,BACKGROUND_KEYS.FOREST).setOrigin(0)

        this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNOUSK)
        this.add.image(256, 316, MONSTER_ASSET_KEYS.IGNITE,0).setFlipX(true)

        const playerMonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.IGNITE,{
                color: '#7E3D3F',
                fontSize:'32px'
            }
        );

        this.add.container(556, 318,
            [   
                this.add.image(0,0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                playerMonsterName,
                this.createHealth(34,34)
            ]);
    }

    createHealth(x,y){
        const leftCap = this.add.image(x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP )
        const middleCap = this.add.image(x,y, HEALTH_BAR_ASSET_KEYS.MIDDLE)
        const rightCap = this.add.image(x,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP)
        return this.add.container(x,y,[leftCap, middleCap, rightCap]);
    }

}
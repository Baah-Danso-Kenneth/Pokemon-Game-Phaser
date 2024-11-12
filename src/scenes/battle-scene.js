import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import { BACKGROUND_KEYS, BATTLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-key";
import { BattleMenu } from "../battles/ui/battle-menu";


export class BattleScene extends Phaser.Scene{
    #battleMenu
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
        const MonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.CARNOUSK,{
                color: '#7E3D3F',
                fontSize:'32px'
            }
        );

        this.add.container(556, 318,
            [   
                this.add.image(0,0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                playerMonsterName,
                this.#createHealth(34,34),

                this.add.text(
                    playerMonsterName.width + 35,
                    23,
                    'L5',
                    {
                        color: '#ED474B',
                        fontSize:'28px'
                    }
                ),

                this.add.text(
                   30,
                    55,
                    'HP',
                    {
                        color: '#FF6505',
                        fontSize:'24px',
                        fontStyle:'italic'
                    }
                ),

                this.add.text(
                    443,
                     80,
                     '25/25',
                     {
                         color: '#7E3D3F',
                         fontSize:'16px',
                    
                     }
                 ).setOrigin(1,0)
            ]);


        
            this.add.container(26, 18,
                [   
                    this.add.image(
                        0,0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                        MonsterName,
                    this.#createHealth(34,34),
    
                    this.add.text(
                        MonsterName.width + 35,
                        23,
                        'L5',
                        {
                            color: '#ED474B',
                            fontSize:'28px'
                        }
                    ),
    
                    this.add.text(
                       30,
                        55,
                        'HP',
                        {
                            color: '#FF6505',
                            fontSize:'24px',
                            fontStyle:'italic'
                        }
                    ),
    
                    this.add.text(
                        443,
                         80,
                         '25/25',
                         {
                             color: '#7E3D3F',
                             fontSize:'16px',
                        
                         }
                     ).setOrigin(1,0)
                ]);

           this.#battleMenu = new BattleMenu(this);
        //    this.#battleMenu.showMonsterAttackSubMenu()
           this.#battleMenu.showBattleMenu()
    }


    #createHealth(x,y){
        const scaleY=0.7;

        const leftCap = this.add.image(
            x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP 
        ).setOrigin(0,0.5)
        .setScale(1, scaleY)
        const middleCap = this.add.image(
            leftCap.x + leftCap.width,y, HEALTH_BAR_ASSET_KEYS.MIDDLE
        ).setOrigin(0,0.5)
        .setScale(1, scaleY)
        middleCap.displayWidth=360;
        const rightCap = this.add.image(
            middleCap.x + middleCap.displayWidth,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
        ).setOrigin(0,0.5)
        .setScale(1,scaleY)
        return this.add.container(x,y,[leftCap, middleCap, rightCap]);
    }



}



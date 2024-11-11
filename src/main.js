import Phaser from "phaser";
import { SCENE_KEYS } from "./scenes/scene-keys";
import { PreloadScene } from "./scenes/preload-scene";
import { BattleScene } from "./scenes/battle-scene";



const game = new Phaser.Game({
    type: Phaser.CANVAS,
    scale:{
        parent:'game-container',
        width: 1024,
        height: 576,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  
    pixelArt: false,
    backgroundColor: '#000'
    
})


game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene)
game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene)
game.scene.start(SCENE_KEYS.PRELOAD_SCENE)

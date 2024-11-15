import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../assets/assets-key";
import { DIRECTION } from "../../common/direction";
import { ATTACK_MOVE_OPTIONS, BATTLE_MENU_OPTIONS, ACTIVE_BATTLE_MENU } from "./battle-menu-option.js";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config.js";
import { exhaustiveGuard } from "../../utils/guard.js";

const BATTLE_MENU_CURSOR_POS = Object.freeze({
    x: 42,
    y: 38,
  });
  
  const ATTACK_MENU_CURSOR_POS = Object.freeze({
    x: 42,
    y: 38,
  });

  
  
  export class BattleMenu {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #mainBattleMenuPhaserContainerGameObject;
    /** @type {Phaser.GameObjects.Container} */
    #moveSelectionSubBattleMenuPhaserContainerGameObject;
    /** @type {Phaser.GameObjects.Text} */
    #battleTextGameObjectLine1;
    /** @type {Phaser.GameObjects.Text} */
    #battleTextGameObjectLine2;
    /** @type {Phaser.GameObjects.Image} */
    #mainBattleMenuCursorPhaserImageGameObject;
    /** @type {Phaser.GameObjects.Image} */
    #attackBattleMenuCursorPhaserImageGameObject;
    /** @type {import('./battle-menu-options.js').BattleMenuOptions} */
    #selectedBattleMenuOption;
    /** @type {import('./battle-menu-options.js').AttackMoveOptions} */
    #selectedAttackMenuOption;
    /** @type {import('./battle-menu-options.js').ActiveBattleMenu} */
    #activeBattleMenu;
    #queuedInfoMessages;
    #queuedInfoPanelCallback;
    #waitingForPlayerInput;
    #selectAttackIndex;
  
    /**
     *
     * @param {Phaser.Scene} scene the Phaser 3 Scene the battle menu will be added to
     */
    constructor(scene) {
      this.#scene = scene;
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN
      this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
      this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
      this.#queuedInfoMessages = [];
      this.#queuedInfoPanelCallback = undefined
      this.#selectAttackIndex = undefined
      this.#waitingForPlayerInput = false;


      this.#createMainInfoPane();
      this.#createMainBattleMenu();
      this.#createMonsterAttackSubMenu();
    }

    get selectedAttack(){
        if(this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT){
            return this.#selectAttackIndex;
        }
        return undefined;
    }
  
    showMainBattleMenu() {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
      this.#battleTextGameObjectLine1.setText('what should');
      this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
      this.#battleTextGameObjectLine1.setAlpha(1);
      this.#battleTextGameObjectLine2.setAlpha(1);
  
      this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
      this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y);
      this.#selectAttackIndex = undefined;
    }
  
    hideMainBattleMenu() {
      this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
      this.#battleTextGameObjectLine1.setAlpha(0);
      this.#battleTextGameObjectLine2.setAlpha(0);
    }
  
    showMonsterAttackSubMenu() {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
      this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
    }
  
    hideMonsterAttackSubMenu() {
      this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
    }
  
    /**
     *
     * @param {import('../../../common/direction.js').Direction|'OK'|'CANCEL'} input
     */
    handlePlayerInput(input) {

        if(this.#waitingForPlayerInput && (input === 'CANCEL' || input ==='OK')){
            this.#updateInfoPaneWithMessage();
            return;
        }


      if (input === 'CANCEL') {
            this.#switchToMainBattleMenu();
        return;
      }
      if (input === 'OK') {
        if(this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN){
            // TODO
            this.#handlePlayerChooseMainBattleOption();
            return;
        }

        if(this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT){
            // TODO
            this.#handlePlayerChooseAttack();
            return;
        }
        this.hideMainBattleMenu();
        this.showMonsterAttackSubMenu();
        return;
      }
  
      this.#updateSelectedBattleMenuOptionFromInput(input);
      this.#moveMainBattleMenuCursor();
      this.#updateSelectedMoveMenuOptionFromInput(input);
      this.#moveMoveSelectBattleMenuCursor();
    }
  
    #createMainBattleMenu() {
      this.#battleTextGameObjectLine1 = this.#scene.add.text(20, 468, 'what should',BATTLE_UI_TEXT_STYLE);
      // TODO: update to use monster data that is passed into this class instance
      this.#battleTextGameObjectLine2 = this.#scene.add.text(
        20,
        512,
        `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
        BATTLE_UI_TEXT_STYLE
      );
  
      this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
        .image(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y, UI_ASSET_KEYS.CURSOR, 0)
        .setOrigin(0.5)
        .setScale(2.5);
  
      this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(520, 448, [
        this.#createMainInfoSubPane(),
        this.#scene.add.text(55, 22, BATTLE_MENU_OPTIONS.FIGHT, BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, BATTLE_MENU_OPTIONS.SWITCH, BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, BATTLE_MENU_OPTIONS.ITEM, BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, BATTLE_MENU_OPTIONS.FLEE, BATTLE_UI_TEXT_STYLE),
        this.#mainBattleMenuCursorPhaserImageGameObject,
      ]);
  
      this.hideMainBattleMenu();
    }
  
    #createMonsterAttackSubMenu() {
      this.#attackBattleMenuCursorPhaserImageGameObject = this.#scene.add
        .image(ATTACK_MENU_CURSOR_POS.x, ATTACK_MENU_CURSOR_POS.y, UI_ASSET_KEYS.CURSOR, 0)
        .setOrigin(0.5)
        .setScale(2.5);
  
      this.#moveSelectionSubBattleMenuPhaserContainerGameObject = this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, 'slash', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, 'growl', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, '-', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, '-', BATTLE_UI_TEXT_STYLE),
        this.#attackBattleMenuCursorPhaserImageGameObject,
      ]);
      this.hideMonsterAttackSubMenu();
    }



    updateInfoPaneMessageAndWaitForInput(messages, callback){
        this.#queuedInfoPanelCallback = callback;
        this.#queuedInfoMessages = messages;


        this.#updateInfoPaneWithMessage();
    }

    #updateInfoPaneWithMessage(){
        this.#waitingForPlayerInput = false;
        this.#battleTextGameObjectLine1.setText('').setAlpha(1);

        if(this.#queuedInfoMessages.length === 0){
            if(this.#queuedInfoPanelCallback){
                this.#queuedInfoPanelCallback();
                this.#queuedInfoPanelCallback = undefined;
            }
            return;
        }

        const messageToDisplay = this.#queuedInfoMessages.shift();
        this.#battleTextGameObjectLine1.setText(messageToDisplay);
        this.#waitingForPlayerInput = true;
    }

  
    #createMainInfoPane() {
      const padding = 4;
      const rectHeight = 124;
  
      this.#scene.add
        .rectangle(
          padding,
          this.#scene.scale.height - rectHeight - padding,
          this.#scene.scale.width - padding * 2,
          rectHeight,
          0xede4f3,
          1
        )
        .setOrigin(0)
        .setStrokeStyle(8, 0xe4434a, 1);
    }
  
    #createMainInfoSubPane() {
      const rectWidth = 500;
      const rectHeight = 124;
  
      return this.#scene.add
        .rectangle(0, 0, rectWidth, rectHeight, 0xede4f3, 1)
        .setOrigin(0)
        .setStrokeStyle(8, 0x905ac2, 1);
    }
  
    /**
     * @param {import('../../../common/direction.js').Direction} direction
     */
    #updateSelectedBattleMenuOptionFromInput(direction) {
      if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
        return;
      }
  
      if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
        switch (direction) {
          case DIRECTION.RIGHT:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
            return;
          case DIRECTION.DOWN:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
            return;
          case DIRECTION.LEFT:
          case DIRECTION.UP:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
        switch (direction) {
          case DIRECTION.LEFT:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
            return;
          case DIRECTION.DOWN:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
            return;
          case DIRECTION.RIGHT:
          case DIRECTION.UP:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
        switch (direction) {
          case DIRECTION.RIGHT:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
            return;
          case DIRECTION.UP:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
            return;
          case DIRECTION.LEFT:
          case DIRECTION.DOWN:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
        switch (direction) {
          case DIRECTION.LEFT:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
            return;
          case DIRECTION.UP:
            this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
            return;
          case DIRECTION.RIGHT:
          case DIRECTION.DOWN:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      exhaustiveGuard(this.#selectedBattleMenuOption);
    }
  
    #moveMainBattleMenuCursor() {
      if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
        return;
      }
  
      switch (this.#selectedBattleMenuOption) {
        case BATTLE_MENU_OPTIONS.FIGHT:
          this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y);
          return;
        case BATTLE_MENU_OPTIONS.SWITCH:
          this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, BATTLE_MENU_CURSOR_POS.y);
          return;
        case BATTLE_MENU_OPTIONS.ITEM:
          this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, 86);
          return;
        case BATTLE_MENU_OPTIONS.FLEE:
          this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
          return;
        default:
          exhaustiveGuard(this.#selectedBattleMenuOption);
      }
    }
  
    /**
     * @param {import('../../../common/direction.js').Direction} direction
     */
    #updateSelectedMoveMenuOptionFromInput(direction) {
      if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
        return;
      }
  
      if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_1) {
        switch (direction) {
          case DIRECTION.RIGHT:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
            return;
          case DIRECTION.DOWN:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
            return;
          case DIRECTION.LEFT:
          case DIRECTION.UP:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_2) {
        switch (direction) {
          case DIRECTION.LEFT:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
            return;
          case DIRECTION.DOWN:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
            return;
          case DIRECTION.RIGHT:
          case DIRECTION.UP:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_3) {
        switch (direction) {
          case DIRECTION.RIGHT:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
            return;
          case DIRECTION.UP:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
            return;
          case DIRECTION.LEFT:
          case DIRECTION.DOWN:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_4) {
        switch (direction) {
          case DIRECTION.LEFT:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
            return;
          case DIRECTION.UP:
            this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
            return;
          case DIRECTION.RIGHT:
          case DIRECTION.DOWN:
          case DIRECTION.NONE:
            return;
          default:
            exhaustiveGuard(direction);
        }
        return;
      }
  
      exhaustiveGuard(this.#selectedAttackMenuOption);
    }
  
    #moveMoveSelectBattleMenuCursor() {
      if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
        return;
      }
  
      switch (this.#selectedAttackMenuOption) {
        case ATTACK_MOVE_OPTIONS.MOVE_1:
          this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(
            ATTACK_MENU_CURSOR_POS.x,
            ATTACK_MENU_CURSOR_POS.y
          );
          return;
        case ATTACK_MOVE_OPTIONS.MOVE_2:
          this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(228, ATTACK_MENU_CURSOR_POS.y);
          return;
        case ATTACK_MOVE_OPTIONS.MOVE_3:
          this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(ATTACK_MENU_CURSOR_POS.x, 86);
          return;
        case ATTACK_MOVE_OPTIONS.MOVE_4:
          this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
          return;
        default:
          exhaustiveGuard(this.#selectedAttackMenuOption);
      }
    }

    #switchToMainBattleMenu(){
        this.hideMonsterAttackSubMenu();
        this.showMainBattleMenu();
    }

    #handlePlayerChooseMainBattleOption(){
        this.hideMainBattleMenu();
        
        if(this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT){
            this.#activeBattleMenu = BATTLE_MENU_OPTIONS.FIGHT
            this.showMonsterAttackSubMenu()
            return;
        }

        if(this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM){
            this.#activeBattleMenu = BATTLE_MENU_OPTIONS.ITEM
            this.updateInfoPaneMessageAndWaitForInput(['Your bag is empty....'],()=>{
                this.#switchToMainBattleMenu();
            })
            return;
        }

        if(this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH){
            this.#activeBattleMenu = BATTLE_MENU_OPTIONS.SWITCH
            this.updateInfoPaneMessageAndWaitForInput(['Your have no monsters in your party....'],()=>{
                this.#switchToMainBattleMenu();
            })
            return;
        }


        if(this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE){
            this.#activeBattleMenu = BATTLE_MENU_OPTIONS.FLEE
            this.updateInfoPaneMessageAndWaitForInput(['You Fail to run away....'],()=>{
                this.#switchToMainBattleMenu();
            })
            return;
        }
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }

    #handlePlayerChooseAttack(){
        let selectedMoveIndex=0;
        switch(this.#selectedAttackMenuOption){
            case ATTACK_MOVE_OPTIONS.MOVE_1:
                selectedMoveIndex =0;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_2:
                selectedMoveIndex = 1;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_3:
                selectedMoveIndex = 2;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_4:
                selectedMoveIndex = 3
                break;
            default:
             exhaustiveGuard(this.#selectedAttackMenuOption)
        }
        this.#selectAttackIndex = selectedMoveIndex;
    }

  }



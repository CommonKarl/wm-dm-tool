import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';

import { SelectItem } from 'primeng/api';
import { Subscription } from '../../../node_modules/rxjs';

import * as _ from 'lodash';

@Component({
  selector: 'dm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  calendarInfo: Subscription;
  showCalendarTool = false;
  showTreasureTool = false;
  individualOrHoard = false;
  encounterLevel = 1;
  treasureUnitValue = 100;
  artValueMod = 0;
  hoardSelect: any;
  chosenDay = 1;
  chosenMonth = 0;
  chosenYear = 1;
  months: SelectItem[];
  hoards: SelectItem[];
  dateSet = false;
  treasureHoardValue: any;
  randomizeTV = false;

  constructor(private infoService: InfoService) {
    this.months = [
      { label: infoService.months[0], value: 0 },
      { label: infoService.months[1], value: 1 },
      { label: infoService.months[2], value: 2 },
      { label: infoService.months[3], value: 3 },
      { label: infoService.months[4], value: 4 },
      { label: infoService.months[5], value: 5 },
      { label: infoService.months[6], value: 6 },
      { label: infoService.months[7], value: 7 }
    ];

    this.hoards = [
      { label: 'Random', value: 0 },
      { label: 'Individual Treasure', value: 1 },
      { label: 'Small (ungaurded) Hoard', value: 2 },
      { label: 'Small Hoard', value: 3 },
      { label: 'Medium Hoard', value: 4 },
      { label: 'Large Hoard', value: 5 },
      { label: 'Huge Hoard', value: 6 },
      { label: 'Massive Hoard', value: 7 },
      { label: 'Gargantuan Hoard', value: 8 }
    ];
  }

  ngOnInit() {
    this.calendarInfo = this.infoService.calendarObs.subscribe(
      x => {
        this.chosenYear = x.year;
        this.chosenDay = x.day;
        this.chosenMonth = x.month;
      },
      err => console.error(err)
    );

    this.setCalendar();
  }

  openCalendarTool() {
    this.showCalendarTool = true;
  }

  openTreasure() {
    this.showTreasureTool = true;
    this.individualOrHoard = false;
    this.encounterLevel = this.infoService.locationCR;
    this.hoardSelect = undefined;
    this.treasureUnitValue = 100;
  }

  generateTreasure() {
    // generate treasure!
    if (!this.individualOrHoard) {
      const d100 = this.roll(100);
      if (this.encounterLevel > 0 && this.encounterLevel <= 4) {
        // CR 0-4
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) + 'cp'; // 5d6 cp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) + 'sp'; // 4d6 sp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = (this.roll(6) + this.roll(6) + this.roll(6)) + 'gp'; // 3d6 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = this.roll(6) + 'pp'; // 1d6 pp
        } else {
          console.log('uh...error!');
        }
      } else if (this.encounterLevel > 4 && this.encounterLevel <= 10) {
        // CR 5-10
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'cp; '
            + (this.roll(3) * 10) + 'gp'; // 4d6x100 cp and 1d3x10 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'sp; '
            + ((this.roll(6) + this.roll(6)) * 10) + 'gp'; // 6d6x10 sp and 2d6x10 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 10) + 'gp'; // 4d6x10 gp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 10) + 'gp; ' + (this.roll(6) + this.roll(6) + this.roll(6)) + 'pp'; // 2d6x10 gp and 3d6 pp
        } else {
          console.log('uh...error!');
        }
      } else {
        // CR 11+
        if (d100 > 0 && d100 <= 30) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6) + this.roll(6) + this.roll(6)) * 100) + 'sp; '
            + (this.roll(6) * 100) + 'gp'; // 4d6x100 sp and 1d6x100 gp
        } else if (d100 > 30 && d100 <= 60) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp'; // 2d6x100 gp
        } else if (d100 > 60 && d100 <= 95) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + (this.roll(6) * 10) + 'pp'; // 2d6x100 gp and 1d6x10 pp
        } else if (d100 > 95 && d100 <= 100) {
          this.treasureHoardValue = ((this.roll(6) + this.roll(6)) * 100) + 'gp; ' + ((this.roll(6) + this.roll(6)) * 10) + 'pp'; // 2d6x100 gp and 2d6x10 pp
        } else {
          console.log('uh...error!');
        }
      }
    } else {
      // treasure hoard
      let hoardSize;
      if (!this.hoardSelect) {
        // randomize hoard size
        const d20 = this.roll(20);
        if (d20 === 1) {
          hoardSize = 1;
        } else if (d20 > 1 && d20 <= 3) {
          hoardSize = 2;
        } else if (d20 > 3 && d20 <= 7) {
          hoardSize = 3;
        } else if (d20 > 7 && d20 <= 13) {
          hoardSize = 4;
        } else if (d20 > 13 && d20 <= 16) {
          hoardSize = 5;
        } else if (d20 > 16 && d20 <= 18) {
          hoardSize = 6;
        } else if (d20 === 19) {
          hoardSize = 7;
        } else if (d20 === 20) {
          hoardSize = 8;
        } else {
          console.log('d20 roll error');
        }
      } else {
        hoardSize = this.hoardSelect;
      }

      // roll # treasure unit based on hoard size
      let numTreasureUnits;
      switch (hoardSize) {
        case 1: numTreasureUnits = 1;
          break;
        case 2: numTreasureUnits = this.roll(3);
          break;
        case 3: numTreasureUnits = this.roll(6) + 1;
          break;
        case 4: numTreasureUnits = this.roll(4) + 3;
          break;
        case 5: numTreasureUnits = this.roll(4) + 6;
          break;
        case 6: numTreasureUnits = this.roll(4) + this.roll(4) + 6;
          break;
        case 7: numTreasureUnits = this.roll(4) + this.roll(4) + this.roll(4) + 6;
          break;
        case 8: numTreasureUnits = (this.roll(4) + 2) * 4;
          break;
        default: console.log('hoard size is unrecognizable!');
          break;
      }

      let hoardBV = 1;
      if (this.randomizeTV) {
        // calculate base value of the hoard
        const d100 = this.roll(100);
        if (d100 === 1) {
          hoardBV = .01;
        } else if (d100 > 1 && d100 <= 3) {
          hoardBV = .1;
        } else if (d100 > 3 && d100 <= 8) {
          hoardBV = .25;
        } else if (d100 > 8 && d100 <= 14) {
          hoardBV = .5;
        } else if (d100 > 14 && d100 <= 24) {
          hoardBV = .75;
        } else if (d100 > 24 && d100 <= 76) {
          hoardBV = 1;
        } else if (d100 > 76 && d100 <= 86) {
          hoardBV = 1.5;
        } else if (d100 > 86 && d100 <= 92) {
          hoardBV = 2;
        } else if (d100 > 92 && d100 <= 97) {
          hoardBV = 3;
        } else if (d100 > 97 && d100 <= 99) {
          hoardBV = 5;
        } else if (d100 === 100) {
          hoardBV = 10;
        } else {
          console.log('hoard base value error');
        }

      }

      const finalTreasureValue = this.treasureUnitValue * hoardBV;
      for (let i = 0; i < numTreasureUnits; i++) {
        this.generateIndividualTreasure(finalTreasureValue);
      }


    }
  }

  generateIndividualTreasure(treasureValue) {
    // determine type of treasure
    const typed20 = this.roll(20);
    let treasure = '';
    switch (true) {
      case (typed20 < 2): treasure = this.generateArt();
        break;
      case (typed20 < 4): treasure = this.generateJeweledItem();
        break;
      case (typed20 < 28): treasure = this.generateGood();
        break;
      case (typed20 < 14): treasure = this.generateCoins();
        break;
      case (typed20 < 18): treasure = this.generateFurnishingClothing();
        break;
      case (typed20 < 20): treasure = this.generateGems();
        break;
      case (typed20 < 21): treasure = this.generateArt();
        // generateMagicOrSpecialItem();
        break;
      default:
        console.log('type of treasure failed');
        break;
    }
    console.log(treasure);
  }

  generateArt() {
    const d20 = this.roll(20);
    let art;
    this.artValueMod = 0;
    switch (true) {
      case (d20 < 3): art = this.treasureDetails('PaperArt');
        break;
      case (d20 < 5): art = this.treasureDetails('FabricArt');
        break;
      case (d20 < 7): art = this.treasureDetails('Painting');
        break;
      case (d20 < 9): art = this.treasureDetails('Crafts');
        break;
      case (d20 < 11): art = this.treasureDetails('Carving');
        break;
      case (d20 < 13): art = this.treasureDetails('Ceramics');
        break;
      case (d20 < 15): art = this.treasureDetails('Glasswork');
        break;
      case (d20 < 18): art = this.treasureDetails('Stonework');
        break;
      case (d20 < 20): art = this.treasureDetails('Metalwork');
        break;
      case (d20 < 21): art = this.treasureDetails('Carving');
        // this.treasureDetails(Magical);
        break;
      default: console.log('art type error');
        break;
    }

    art += ', Material Quality: ' + this.artMaterialQuality();
    art += ', Age: ' + this.artAge();
    art += ', Size: ' + this.artSize();
    art += ', Work Quality: ' + this.artWorkQuality();
    art += ', Condition: ' + this.artCondition();
    art += ', Value Modifier: ' + this.artValueMod;

    return art;
  }

  artMaterialQuality() {
    const d20 = this.roll(20);
    let result;
    switch (true) {
      case (d20 < 2): result = 'Awful'; this.artValueMod -= 3;
        break;
      case (d20 < 3): result = 'Poor'; this.artValueMod -= 2;
        break;
      case (d20 < 6): result = 'Below Average'; this.artValueMod -= 1;
        break;
      case (d20 < 14): result = 'Average';
        break;
      case (d20 < 18): result = 'Above Average'; this.artValueMod += 1;
        break;
      case (d20 < 19): result = 'Good'; this.artValueMod += 2;
        break;
      case (d20 < 20): result = 'Excellent'; this.artValueMod += 3;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Finest'; this.artValueMod += 4;
            break;
          case (d20b < 21): result = 'Unique'; this.artValueMod += 5;
            break;
          default: console.log('art mat quality 2 error');
        }
        break;
      default: console.log('art mat quality error');
        break;
    }
    return result;
  }

  artAge() {
    const d20 = this.roll(20);
    let result;
    switch (true) {
      case (d20 < 2): result = 'Avant-garde'; this.artValueMod -= 3;
        break;
      case (d20 < 3): result = 'Current'; this.artValueMod -= 2;
        break;
      case (d20 < 6): result = 'Recent'; this.artValueMod -= 1;
        break;
      case (d20 < 14): result = 'Contemporary';
        break;
      case (d20 < 18): result = 'Modern'; this.artValueMod += 1;
        break;
      case (d20 < 19): result = 'Old'; this.artValueMod += 2;
        break;
      case (d20 < 20): result = 'Antique'; this.artValueMod += 3;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Venerable'; this.artValueMod += 4;
            break;
          case (d20b < 20): result = 'Archaic'; this.artValueMod += 5;
            break;
          case (d20 < 21):
            const d20c = this.roll(20);
            switch (true) {
              case (d20c < 19): result = 'Antediluvian'; this.artValueMod += 6;
                break;
              case (d20c < 21): result = 'Primordial'; this.artValueMod += 7;
                break;
              default: console.log('art age 3 error');
            }
            break;
          default: console.log('art age 2 error');
        }
        break;
      default: console.log('art age error');
        break;
    }
    return result;
  }

  artSize() {
    const d20 = this.roll(20);
    let result;
    switch (true) {
      case (d20 < 2): result = 'Tiny'; this.artValueMod -= 3;
        break;
      case (d20 < 3): result = 'Very Small'; this.artValueMod -= 2;
        break;
      case (d20 < 6): result = 'Small'; this.artValueMod -= 1;
        break;
      case (d20 < 14): result = 'Average';
        break;
      case (d20 < 18): result = 'Large'; this.artValueMod += 1;
        break;
      case (d20 < 19): result = 'Very Large'; this.artValueMod += 2;
        break;
      case (d20 < 20): result = 'Huge'; this.artValueMod += 3;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Massive'; this.artValueMod += 4;
            break;
          case (d20b < 21): result = 'Gargantuan'; this.artValueMod += 5;
            break;
          default: console.log('art size 2 error');
        }
        break;
      default: console.log('art size error');
        break;
    }
    return result;
  }

  artWorkQuality() {
    const d20 = this.roll(20);
    let result;
    switch (true) {
      case (d20 < 3): result = 'Awful'; this.artValueMod -= 3;
        break;
      case (d20 < 5): result = 'Poor'; this.artValueMod -= 2;
        break;
      case (d20 < 7): result = 'Below Average'; this.artValueMod -= 1;
        break;
      case (d20 < 9): result = 'Average';
        break;
      case (d20 < 11): result = 'Above Average'; this.artValueMod += 1;
        break;
      case (d20 < 13): result = 'Good'; this.artValueMod += 2;
        break;
      case (d20 < 15): result = 'Excellent'; this.artValueMod += 3;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Brilliant'; this.artValueMod += 4;
            break;
          case (d20b < 21): result = 'Masterpiece'; this.artValueMod += 5;
            break;
          default: console.log('art work quality 2 error');
        }
        break;
      default: console.log('art work quality error');
        break;
    }
    return result;
  }

  artCondition() {
    const d20 = this.roll(20);
    let result;
    switch (true) {
      case (d20 < 3): result = 'Badly Damaged'; this.artValueMod -= 3;
        break;
      case (d20 < 5): result = 'Damaged'; this.artValueMod -= 2;
        break;
      case (d20 < 7): result = 'Worn'; this.artValueMod -= 1;
        break;
      case (d20 < 9): result = 'Average';
        break;
      case (d20 < 11): result = 'Good'; this.artValueMod += 1;
        break;
      case (d20 < 13): result = 'Excellent'; this.artValueMod += 2;
        break;
      case (d20 < 15): result = 'Near Perfect'; this.artValueMod -= 3;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Perfect'; this.artValueMod += 4;
            break;
          case (d20b < 21): result = 'Flawless'; this.artValueMod += 5;
            break;
          default: console.log('art condition 2 error');
        }
        break;
      default: console.log('art condition error');
        break;
    }
    return result;
  }

  generateJeweledItem() {
    let item;
    item = this.treasureDetails('JeweledItem');
    return item;
  }

  generateGood() {
    let good;
    const d100 = this.roll(100);
    switch (true) {
      case (d100 < 7): good = this.treasureDetails('Armor');
        break;
      case (d100 < 13): good = this.treasureDetails('Weapon');
        break;
      case (d100 < 17): good = this.treasureDetails('Drink');
        break;
      case (d100 < 21): good = this.treasureDetails('ExoticFruit');
        break;
      case (d100 < 31): good = this.treasureDetails('FancyFabric');
        break;
      case (d100 < 36): good = this.treasureDetails('Metal') + ' Bars';
        break;
      case (d100 < 42): good = this.treasureDetails('Ivory');
        break;
      case (d100 < 50): good = 'Perfume Bottle';
        break;
      case (d100 < 64): good = this.treasureDetails('ReligiousArtifacts');
        break;
      case (d100 < 86): good = this.treasureDetails('ScrollsBooks');
        break;
      case (d100 < 91): good = this.treasureDetails('LabItems');
        break;
      case (d100 < 101): good = this.treasureDetails('MagicalComponents');
        break;
      default: console.log('good type error');
        break;
    }
    return good;
  }

  generateCoins() {
    let coins;
    return coins;
  }

  generateFurnishingClothing() {
    let foc;
    return foc;
  }

  generateGems() {
    let gems;
    return gems;
  }

  treasureDetails(arrString) {
    const arr = eval(arrString);
    const deets = arr[Math.floor(Math.random() * arr.length)];
    if (typeof (deets) === 'string') {
      if (deets.includes('Random') === true) {
        const tempdeets = this.treasureDetailsArr(eval(deets.slice(7)));
        return tempdeets + ' ' + arrString;
      }
      return deets + ' ' + arrString;
    } else {
      let moredeets = '';
      for (const key of Object.keys(deets)) {
        let tempdeets = deets[key][Math.floor(Math.random() * deets[key].length)];
        if (tempdeets.includes('Random') === true) {
          tempdeets = this.treasureDetailsArr(eval(tempdeets.slice(7)));
        }
        moredeets += ' ' + tempdeets;
      }
      return moredeets.replace(' ', '') + ' ' + arrString;
    }
  }

  treasureDetailsArr(arr) {
    const deets = arr[Math.floor(Math.random() * arr.length)];
    if (typeof (deets) === 'string') {
      if (deets.includes('Random') === true) {
        const tempdeets = this.treasureDetailsArr(eval(deets.slice(7)));
        return tempdeets;
      }
      return deets;
    } else {
      let moredeets = '';
      for (const key of Object.keys(deets)) {
        let tempdeets = deets[key][Math.floor(Math.random() * deets[key].length)];
        if (tempdeets.includes('Random') === true) {
          tempdeets = this.treasureDetailsArr(eval(tempdeets.slice(7)));
        }
        moredeets += ' ' + tempdeets;
      }
      return moredeets.replace(' ', '');
    }
  }

  // generateMagicOrSpecialItem() {}

  addDay() {
    this.infoService.addDay();
  }

  setCalendar() {
    if (this.chosenDay < 1 || this.chosenDay > 30) {
      console.log("Day needs to be legit, yo.");
    } else {
      // console.log("submitting...");
      this.showCalendarTool = false;
      this.infoService.calendar.day = this.chosenDay;
      this.infoService.calendar.month = this.chosenMonth;
      this.infoService.calendar.year = this.chosenYear;
      this.infoService.updateMoonPhase();
      this.infoService.rollForEncounter();
      this.dateSet = true;
      // console.log(this.infoService);
    }
  }

  advanceTimePeriod() {
    this.infoService.advanceTimePeriod();
  }

  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

}

// GENERIC MATERIALS
const Wood = ['Pine', 'Cedar', 'Cypress', 'Fir', 'Yew', 'Hemlock', 'Larch', 'Redcedar', 'Redwood', 'Spruce', 'Alder', 'Applewood',
  'Ash', 'Aspen', 'Balsa Beech', 'Birch', 'Basswood', 'Blackwood', 'Boxwood', 'Buckeye', 'Cherry', 'Chestnut', 'Cottonwood', 'Dogwood',
  'Ebony', 'Elm', 'Eucalyptus', 'Gum wood', 'Hickory', 'Ironwood', 'Locust wood', 'Maple', 'Oak', 'Poplar', 'Sandalwood', 'Sassafras',
  'Teak', 'Walnut', 'Willow', 'Bluewood', 'Duskwood', 'Shadowtop wood', 'Silverbark', 'Weirwood'];

const Fabric = ['Wool', 'Wollen Wool', 'Worested Wool', 'Goat Hide', 'Alpaca Wool', 'Vicuna Fur', 'Llama Wool', 'Camel Hide', 'Rabbit Hide', 'Wadmal', 'Silk', 'Grass',
  'Rush', 'Hemp', 'Sisal', 'Coconut', 'Straw', 'Bamboo', 'Cotton', 'Flax', 'Ramie', 'Jute', 'Linen', 'Velour', 'Lace'];

const Metal = ['Bronze', 'Brass', 'Copper', 'Electrum', 'Gold', 'Iron', 'Lead', 'Platinum', 'Silver', 'Steel', 'Titanium', 'Cobalt', 'Nickel',
  'Palladium', 'Tungsten', 'Coral', 'Mithril', 'Adamantine', 'Cold Iron', 'Starmetal', 'Orichalcum', 'Green Steel', 'Morghuth Iron', 'Bloodiron',
  'Ferroplasm', 'Driftmetal'];

const Stone = ['Marble', 'Slate', 'Basalt', 'Obsidian', 'Pumice', 'Quartz', 'Chalk', 'Coal', 'Flint', 'Lignite', 'Sandstone', 'Shale', 'Granite',
  'Travertine', 'Limestone', 'Brick', 'Gems'];

const Tool = ['Adze', 'Ankus', 'Anvil', 'Auger', 'Awl', 'Balls', 'Bangles', 'Bell', 'Bowl', 'Branding Iron', 'Buckle', 'Candelabra', 'Candlestick',
  'Cup', 'Dice', 'Drill', 'Drinking Horn', 'Comb', 'Crowbar', 'Door Handles', 'Ewer', 'Eye-patch', 'File', 'Fingerpick', 'Fish-hooks', 'Flagon', 'Fork',
  'Game Pieces', 'Goblet', 'Hammer', 'Hilt', 'Hoe', 'Kettle', 'Key Ring', 'Knife', 'Ladle', 'Mallet', 'Mask', 'Mirror', 'Mortar & Pestle', 'Monocle', 'Mug',
  'Nails', 'Peg-leg', 'Pickaxe', 'Pitcher', 'Pen Case', 'Platter', 'Pots', 'Saw', 'Scissors', 'Scepter', 'Shepherds Crook', 'Spade', 'Spoon', 'Stein', 'Thimble',
  'Tiles', 'Tray', 'Tongs', 'Toy', 'Vestments', 'Whistle'];

const MusicalInstrument = ['Flute', 'Harp', 'Bagpipes', 'Chimes', 'Cymbal', 'Horn', 'Drum', 'Dulcimer', 'Fiddle', 'Fife', 'Gong', 'Bell', 'Hurdy-Gurdy', 'Lute',
  'Lyre', 'Mandolin', 'Ocarina', 'Organ', 'Pan Pipes', 'Recorder', 'Tambourine', 'Triangle', 'Trumpet', 'Whistle', 'Xylophone'];

const Weapon = ['Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light Crossbow', 'Dart', 'Shortbow',
  'Sling', 'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword',
  'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Heavy Crossbow', 'Longbow'];

const Armor = ['Padded', 'Leather', 'Studded Leather', 'Hide', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint', 'Plate', 'Shield'];

const DragonHide = [{
  1: ['Black Dragon', 'Blue Dragon', 'Brass Dragon', 'Bronze Dragon', 'Copper Dragon', 'Gold Dragon', 'Green Dragon', 'Red Dragon',
    'Silver Dragon', 'White Dragon'],
  2: ['Hide']
}];

// ART

const PaperArt = ['Pastel', 'Charcoal', 'Colored Pencil', 'Conte', 'Crayon', 'Graphite', 'Ink',
  {
    1: ['Calligraphic', 'Printed', 'Illustrated'],
    2: ['Manuscript', 'Letter', 'Drawing'],
    3: ['on'],
    4: ['Paper', 'Canvas', 'Random Wood', 'Plaster', 'Random Metal']
  }];

const FabricArt = [{
  1: ['Random Fabric'],
  2: ['Applique', 'Beadwork', 'Crochet', 'Cross-stitch', 'Dying', 'Embroidery', 'Felting', 'Knitting', 'Lace', 'Macrame', 'Nalebinding',
    'Needlework', 'Patchwork', 'Passementerie', 'Quilting', 'Rope', 'Rugmaking', 'Sewing', 'Tapestry', 'Textile printing', 'Weaving']
}];

const Painting = [{
  1: ['Acrylic Paint', 'Oil Paint', 'Enamel Paint', 'Encaustic (wax)', 'Fresco', 'Gesso', 'Glaze', 'Gouache', 'Ink', 'Sumi', 'Tempera', 'Watercolor'],
  2: ['on'],
  3: ['Buildings', 'Canvas', 'Clay', 'Cloth', 'Glass', 'Lacquer', 'Random Metal', 'Paper', 'Random Wood', 'Ceramic']
}];

const Crafts = ['Bracelets', 'Lace', 'Origami', 'Scrap-booking', 'Egg Decorating', 'Mosaic', { 1: ['Random Wood'], 2: ['Burning'] }];

const Carving = ['Bone', 'Gourd', 'Ice', 'Ivory', 'Scrimshaw', 'Random Stone', 'Random Wood'];

const Ceramics = ['Figures/Statuary', 'Tiles', 'Tableware/China', 'Pottery'];

const Glasswork = ['Beads', 'Decanter', 'Lamp', 'Chandelier', 'Goblets', 'Crystal', 'Pipes', 'Bowls', 'Stained Window', 'Flowers', 'Tiles', 'Etched', 'Engraved'];

const Stonework = [{
  1: ['Sculpture', 'Statue', 'Carving', 'Engraving', 'Lapidary', 'Pietra Dura', 'Fountain'],
  2: ['from'],
  3: ['Random Stone']
}];

const Metalwork = [{
  1: ['Random Metal'],
  2: ['Sculpture', 'Furnishing', 'Miniatures', 'Random Tool', 'Tableware']
}];

const JeweledItem = ['Anklet', 'Armband', 'Belt', 'Small Box', 'Coffer', 'Braclet', 'Brooch', 'Buckle', 'Chain', 'Chalice', 'Choker', 'Clasp', 'Collar',
  'Coffer', 'Comb', 'Coronet', 'Crown', 'Decanter', 'Diadem', 'Earring', 'Fob', 'Goblet', 'Headband', 'Idol', 'Locket', 'Medal', 'Medallion', 'Necklace',
  'Pendant', 'Pin', 'Orb', 'Ring', 'Scepter', 'Seal', 'Statuette', 'Tiara', 'Mask', 'Nose Ring/Stud', 'Circlet', 'Torc', 'Random Tool', 'Chatelaine', 'Cuff Link',
  'Lapel Pin', 'Grill', 'Bangles', 'Body Piercing', 'Prayer Beads', 'Puzzle', 'Aiguillette', 'Cock Ring', 'Pectoral', 'Ornamental Disc', 'Icon (small animal, symbol)',
  'Egg', 'Random Weapon', 'Random Armor', 'Jar', 'Random MusicalInstrument'];

// Goods

const Drink = ['Final Sip', 'Apple Duke Cider', 'Rude Gin', 'Gingerroot Beer', 'Pear Lord Wine', 'Dark Blood Ale', 'Dragon Wine', 'Ancient Elven Wine', 'Crazy Honey Mead'];

const ExoticFruit = ['Plunana', 'Rose Gourd', 'Rain Cawesh', 'Ground Marang', 'Cave Pepper', 'Flekiragus', 'Miracle Pumpkin', 'Cinder Loquat', 'Moon Dill', 'Regranut',
  'Ocean Rambutan', 'Fire Rambutan', 'Abyss Chicory', 'Eobaco', 'Desert Korlan', 'Night Bramble', 'Star Clementine', 'Sour Mundu', 'Tundra Courgette', 'Pygmy Pomelo',
  'Silver Pear', 'Mammoth Kiwi', 'Slukkuflower', 'Shimmerspud', 'Dragon Lychee', 'Mage Guanabana', 'Grim Bean'];

const FancyFabric = ['Barkcloth', 'Broadcloth', 'Burlap', 'Calico', 'Cambric', 'Canvas', 'Cheesecloth', 'Chiffon', 'Cloth of gold', 'Crape', 'Denim', 'Flannel', 'Gauze',
  'Haircloth', 'Herringbone', 'Himroo', 'Hodden', 'Khaki', 'Longcloth', 'Moleskin', 'Muslin', 'Oilskin', 'Ottoman', 'Oxford', 'Samite', 'Sateen', 'Satin', 'Scarlet',
  'Seersucker', 'Silk', 'Tweed', 'Twill', 'Brocade', 'Corduroy', 'Plush', 'Fleece', 'Terrycloth', 'Velvet', 'Velveteen', 'Wadmal', 'Felt', 'Cedar Bark', 'Velour',
  'Fishnet', 'Lace', 'Aurumvorak Fur', 'Bear Fur', 'Beaver Fur', 'Bunyip Hide', 'Caterwaul Hide', 'Devil Dog Hide', 'Ermine Fur', 'Owlbear Hide', 'Seal Skin',
  'Snow Leopard Fur', 'Tiger Fur', 'Winter Wolf Hide', 'Yeti Hide', 'Zebra Hide', 'Auroch Hide', 'Behemoth Hide', 'Basilisk Hide', 'Blink Dog Fur',
  'Random DragonHide', 'Displacer Beast Fur', 'Gorgon Hide', 'Hippopotamus Leather', 'Ki-rin Fur', 'Otyugh Leather', 'Snake Skin', 'Crocodile Hide',
  'Lizard Hide', 'Turtle Skin', 'Dinosaur Hide'];

const Ivory = ['Baku', 'Behemoth', 'Catoblepas', 'Elephant', 'Hippoputamus', 'Hollyphant', 'Mammoth', 'Mastodon', 'Narwhal', 'Oliphant', 'Walrus', 'Giant Walrus'];

const ReligiousArtifacts = [{
  1: ['Random FancyFabric', 'Random Metal', 'Random Fabric', 'Random Wood'],
  2: ['Altar', 'Altar Cloth', 'Bell', 'Brazier', 'Candelabra', 'Candles', 'Candlestick', 'Cassock', 'Censer', 'Chalice', 'Chimes', 'Font', 'Holy Symbol', 'Holy Bones',
    'Idol', 'Incense', 'Incense Burner', 'Kneeling Bench', 'Lamp', 'Lectern', 'Mosaic', 'Offertory Container', 'Reliquary', 'Snuffing Bell', 'Thurible', 'Vestment',
    'Whistle']
}];

const ScrollsBooks = [{
  1: ['Scroll', 'Book'],
  2: ['Autobiography', 'Biography', 'Engineering', 'Erotica', 'Historical', 'Legal Text', 'Epic', 'Novel', 'Play', 'Poetry', 'Ornithological', 'Planar', 'Religious',
    'Spellcraft', 'Trade Secrets', 'Warfare', 'Random Race', 'Random Universe']
}];

const Race = [{
  1: ['Human', 'Elven', 'Dwarven', 'Gnomish', 'Halfling', 'Orcish', 'Dragonborn'],
  2: ['Art & Music', 'Biology', 'Demography', 'History', 'Languages', 'Legends & Folklore', 'Law & Customs', 'Philosophy & Ethics', 'Politics & Genealogy',
    'Psychology', 'Sociology', 'Theology & Myth']
}];

const Universe = ['Architecture', 'Astronomy', 'Chemistry', 'Geography', 'Geology & Mineralogy', 'Mathmatics', 'Meteorology & Climatology', 'Oceanography',
  'Physics', 'Topography & Cartography', 'Amphibians', 'Arachnids', 'Avians', 'Cephalopods & Echinoderms', 'Crustaceans & Mollusks', 'Ichthyoids', 'Insects',
  'Mammals', 'Reptiles', 'Bushes & Shrubs', 'Flowers', 'Fungi', 'Grasses & Grains', 'Herbs', 'Mosses & Ferns', 'Trees', 'Weeds', 'Astrology & Numerology', 'Cryptography',
  'Divination', 'Dweomercraft', 'Heraldry', 'Signs & Sigils', 'Medicine', 'Metaphysics', 'Inner Planes', 'Outer Planes'];

const LabItems = [{
  1: ['Glass', 'Random Metal', 'Random Wood'],
  2: ['Alembic', 'Astrolabe', 'Weights and Balance', 'Beaker', 'Bellows', 'Bottle', 'Bowl', 'Brazier', 'Cage', 'Cauldron', 'Candles', 'Candlestick',
    'Carafe', 'Crucible', 'Cruet', 'Crystal Ball', 'Decanter', 'Desk', 'Dishes', 'Flask', 'Funnel', 'Horn', 'Hourglass', 'Ink', 'Inkwell', 'Jar', 'Jug', 'Kettle',
    'Ladle', 'Lamp', 'Lens', 'Mortar and Pestle', 'Pan', 'Pentacles', 'Pentagram', 'Phial', 'Prism', 'Quill', 'Mixing Rod', 'Scroll Tube', 'Skull', 'Measuring Spoons',
    'Stool', 'Stuffed Animal', 'Tweezers', 'Water Clock', 'Wax', 'Workbench']
}];

const MagicalComponents = ['Adamantine', 'Adders Stomach', 'Agate', 'Amber Rod', 'Glass Rod', 'Crystal Rod', 'Black Onyx Stone', 'Crushed Black Pearl',
  'Chalks and Inks infused with precious gems', 'Chrysolite Powder', 'Colored Sand', 'Crystal Hemisphere', 'Crystal Cone', 'Diamond', 'Exotic Feathers',
  'Forked Metal Rod', 'Gem Encrusted Bowl', 'Powered Gems', 'Giant Slug Bile', 'Glass Eye', 'Gold Dust', 'Herbs', 'Holy Water', 'Unholy Water', 'Jade Circlet',
  'Jade Dust', 'Jeweled Horn', 'Jeweled Dagger', 'Lodestone', 'Mercury', 'Moonseeds', 'Oils', 'Incense', 'Pearl', 'Platinum Rings', 'Red Dragon Scale', 'Ruby',
  'Sapphire', 'Jacinth', 'Silver Bar', 'Silver Cage', 'Silver Powder', 'Sunstone', 'Umber Hulk Blood', 'Eyeball encased in Gem'];

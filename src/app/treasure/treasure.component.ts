import { Component, OnInit } from '@angular/core';

import { SelectItem } from 'primeng/api';

import * as _ from 'lodash';

@Component({
  selector: 'dm-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.css']
})
export class TreasureComponent implements OnInit {

  individualOrHoard = false;
  encounterLevel = 1;
  treasureUnitValue = 100;
  artValueMod = 0;
  hoardSelect: any;
  treasureTypeSelect: any;
  hoards: SelectItem[];
  treasureTypes: SelectItem[];
  treasureHoardValue: any;
  randomizeTV = false;

  constructor() { }

  ngOnInit() {
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

    this.treasureTypes = [
      { label: 'Random Type', value: 0 },
      { label: 'Art - Any', value: 1 },
      { label: 'Art - Paper Art', value: 11 },
      { label: 'Art - Fabric Art', value: 12 },
      { label: 'Art - Painting', value: 13 },
      { label: 'Art - Crafts', value: 14 },
      { label: 'Art - Carving', value: 15 },
      { label: 'Art - Ceramics', value: 16 },
      { label: 'Art - Glasswork', value: 17 },
      { label: 'Art - Stonework', value: 18 },
      { label: 'Art - Metalwork', value: 19 },
      { label: 'Art - Carving', value: 110 },
      { label: 'Jeweled Item', value: 2 },
      { label: 'Good - Any', value: 3 },
      { label: 'Good - Armor', value: 31 },
      { label: 'Good - Weapon', value: 32 },
      { label: 'Good - Drinks', value: 33 },
      { label: 'Good - Fruit', value: 34 },
      { label: 'Good - Fabric', value: 35 },
      { label: 'Good - Metal Bars', value: 36 },
      { label: 'Good - Ivory', value: 37 },
      { label: 'Good - Perfume', value: 38 },
      { label: 'Good - Religious Artifact', value: 39 },
      { label: 'Good - Scrolls/Books', value: 310 },
      { label: 'Good - Lab Items', value: 311 },
      { label: 'Good - Magical Components', value: 312 },
      { label: 'Coins', value: 4 },
      { label: 'Gems', value: 5 }
    ];
  }

  generateTreasure() {
    // generate treasure!
    this.treasureHoardValue = [];
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

    for (let i = 0; i < numTreasureUnits; i++) {
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
      this.generateIndividualTreasure(finalTreasureValue);
    }
  }

  generateIndividualTreasure(treasureValue) {
    // determine type of treasure
    const typed20 = this.roll(20);
    let treasure = '';
    if (!this.treasureTypeSelect) {
      switch (true) {
        case (typed20 < 4): treasure = this.generateArt(treasureValue);
          break;
        case (typed20 < 7): treasure = this.generateJeweledItem(treasureValue);
          break;
        case (typed20 < 12): treasure = this.generateGood(treasureValue);
          break;
        case (typed20 < 18): treasure = this.generateCoins(treasureValue);
          break;
        case (typed20 < 21): treasure = this.generateGems(treasureValue);
          break;
        default:
          console.log('type of treasure failed');
          break;
      }
    } else {
      switch (this.treasureTypeSelect) {
        case 1: treasure = this.generateArt(treasureValue);
          break;
        case 11: treasure = this.generateArt(treasureValue, 1);
          break;
        case 12: treasure = this.generateArt(treasureValue, 4);
          break;
        case 13: treasure = this.generateArt(treasureValue, 6);
          break;
        case 14: treasure = this.generateArt(treasureValue, 8);
          break;
        case 15: treasure = this.generateArt(treasureValue, 10);
          break;
        case 16: treasure = this.generateArt(treasureValue, 12);
          break;
        case 17: treasure = this.generateArt(treasureValue, 14);
          break;
        case 18: treasure = this.generateArt(treasureValue, 17);
          break;
        case 19: treasure = this.generateArt(treasureValue, 19);
          break;
        case 110: treasure = this.generateArt(treasureValue, 20);
          break;
        case 2: treasure = this.generateJeweledItem(treasureValue);
          break;
        case 3: treasure = this.generateGood(treasureValue);
          break;
        case 31: treasure = this.generateGood(treasureValue, 6);
          break;
        case 32: treasure = this.generateGood(treasureValue, 12);
          break;
        case 33: treasure = this.generateGood(treasureValue, 16);
          break;
        case 34: treasure = this.generateGood(treasureValue, 20);
          break;
        case 35: treasure = this.generateGood(treasureValue, 30);
          break;
        case 36: treasure = this.generateGood(treasureValue, 35);
          break;
        case 37: treasure = this.generateGood(treasureValue, 41);
          break;
        case 38: treasure = this.generateGood(treasureValue, 49);
          break;
        case 39: treasure = this.generateGood(treasureValue, 63);
          break;
        case 310: treasure = this.generateGood(treasureValue, 85);
          break;
        case 311: treasure = this.generateGood(treasureValue, 90);
          break;
        case 312: treasure = this.generateGood(treasureValue, 100);
          break;
        case 4: treasure = this.generateCoins(treasureValue);
          break;
        case 5: treasure = this.generateGems(treasureValue);
          break;
        default: console.log('treasure type error!');
          break;
      }
    }
    this.treasureHoardValue.push(treasure);
  }

  generateArt(treasureValue, force = 0) {
    const d20 = (force > 0 ? force : this.roll(20));
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

    const artType = art;
    const artSize = this.artSize();
    art += ', Subject: ' + this.artSubject();
    art += ', Material Quality: ' + this.artMaterialQuality();
    art += ', Age: ' + this.artAge();
    art += ', Size: ' + artSize;
    art += ', Work Quality: ' + this.artWorkQuality();
    art += ', Condition: ' + this.artCondition();
    art += ', Value: ' + this.artEndValue(treasureValue);
    art += ', Weight: ' + this.artWeight(artType, artSize) + ' lbs.';

    return art;
  }

  artWeight(type, size) {
    let mult = 1;
    let weight = 0;
    if (this.isMaterial('Wood', type) || this.isMaterial('Fabric', type) || this.isMaterial('LightArt', type)) {
      mult = (2 / 3);
      this.artValueMod -= 1;
    } else if (this.isMaterial('Stone', type) || this.isMaterial('MedArt', type)) {
      mult = 3;
      this.artValueMod += 2;
    } else if (this.isMaterial('Metal', type)) {
      mult = 10;
      this.artValueMod += 4;
    } else {
      console.log('art weight mult error');
    }
    // Math.floor(Math.random() * (max - min + 1) ) + min;
    switch (size) {
      case 'Tiny': weight = 1;
        break;
      case 'Very Small': weight = Math.floor(Math.random() * (3)) + 1;
        break;
      case 'Small': weight = Math.floor(Math.random() * (3)) + 4;
        break;
      case 'Average': weight = Math.floor(Math.random() * (4)) + 9;
        break;
      case 'Large': weight = Math.floor(Math.random() * (6)) + 25;
        break;
      case 'Very Large': weight = Math.floor(Math.random() * (11)) + 80;
        break;
      case 'Huge': weight = Math.floor(Math.random() * (121)) + 500;
        break;
      case 'Massive': weight = Math.floor(Math.random() * (401)) + 1500;
        break;
      case 'Gargantuan': weight = Math.floor(Math.random() * (2001)) + 5000;
        break;
      default: console.log('art size weight error');
        break;
    }

    return (weight * mult >= 1 ? Math.floor(weight * mult) : 1);
  }

  isMaterial(material, artType) {
    return eval(material).some(function (arrVal) {
      return artType.includes(arrVal);
    });
  }

  artEndValue(value) {
    let currMod;
    switch (true) {
      case (value < 1): currMod = 0;
        break;
      case (value < 11): currMod = 1;
        break;
      case (value < 26): currMod = 2;
        break;
      case (value < 51): currMod = 3;
        break;
      case (value < 76): currMod = 4;
        break;
      case (value < 101): currMod = 5;
        break;
      case (value < 151): currMod = 6;
        break;
      case (value < 201): currMod = 7;
        break;
      case (value < 301): currMod = 8;
        break;
      case (value < 401): currMod = 9;
        break;
      case (value < 501): currMod = 10;
        break;
      case (value < 751): currMod = 11;
        break;
      case (value < 1001): currMod = 12;
        break;
      case (value < 1501): currMod = 13;
        break;
      case (value < 2001): currMod = 14;
        break;
      case (value < 3001): currMod = 15;
        break;
      case (value < 4001): currMod = 16;
        break;
      case (value < 5001): currMod = 17;
        break;
      case (value < 7501): currMod = 18;
        break;
      case (value < 10001): currMod = 19;
        break;
      case (value < 20001): currMod = 20;
        break;
      case (value < 40001): currMod = 21;
        break;
      case (value < 80001): currMod = 22;
        break;
      case (value < 10000001): currMod = 23;
        break;
      default: console.log('yo...');
        break;
    }
    currMod += this.artValueMod;
    if (currMod < 0) {
      currMod = 0;
    } else if (currMod > 28) {
      currMod = 28;
    }

    return artValue[currMod];
  }

  artSubject() {
    let subject: any = this.roll(20);
    switch (true) {
      case (subject < 2): subject = 'Abstract'; this.artValueMod -= 2;
        break;
      case (subject < 3): subject = 'Monster'; this.artValueMod -= 1;
        break;
      case (subject < 4): subject = 'Humanoid';
        break;
      case (subject < 6): subject = 'Natural';
        break;
      case (subject < 7): subject = 'Supernatural';
        break;
      case (subject < 10): subject = 'Local';
        break;
      case (subject < 13): subject = 'Historical';
        break;
      case (subject < 18): subject = 'Religious';
        break;
      case (subject < 20): subject = 'Wealthy/Noble'; this.artValueMod += 1;
        break;
      case (subject < 21): subject = 'Royalty'; this.artValueMod += 2;
        break;
      default: console.log('art subject error');
        break;
    }
    return subject;
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
      case (d20 < 2): result = 'Tiny'; this.artValueMod -= 5;
        break;
      case (d20 < 3): result = 'Very Small'; this.artValueMod -= 3;
        break;
      case (d20 < 6): result = 'Small'; this.artValueMod -= 1;
        break;
      case (d20 < 14): result = 'Average';
        break;
      case (d20 < 18): result = 'Large'; this.artValueMod += 1;
        break;
      case (d20 < 19): result = 'Very Large'; this.artValueMod += 3;
        break;
      case (d20 < 20): result = 'Huge'; this.artValueMod += 5;
        break;
      case (d20 < 21):
        const d20b = this.roll(20);
        switch (true) {
          case (d20b < 15): result = 'Massive'; this.artValueMod += 7;
            break;
          case (d20b < 21): result = 'Gargantuan'; this.artValueMod += 10;
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

  generateJeweledItem(value) {
    let item;
    item = this.treasureDetails('JeweledItem') + ' (' + value + 'gp, ' + this.roll(5) + ' lbs.)';
    return item;
  }

  generateGood(treasureValue, force = 0) {
    let good;
    const d100 = (force > 0 ? force : this.roll(100));
    switch (true) {
      case (d100 < 7): good = this.treasureDetails('Armor') + ' (' + treasureValue + 'gp)';
        break;
      case (d100 < 13): good = this.treasureDetails('Weapon') + ' (' + treasureValue + 'gp)';
        break;
      case (d100 < 17): good = this.generateDrinks(treasureValue);
        break;
      case (d100 < 21): good = this.generateFruit(treasureValue);
        break;
      case (d100 < 31): good = this.generateFabric(treasureValue);
        break;
      case (d100 < 36): good = this.generateMetalBars(treasureValue);
        break;
      case (d100 < 42): good = this.generateIvory(treasureValue);
        break;
      case (d100 < 50): good = this.treasureDetails('Perfume') + ' (' + treasureValue + 'gp)';
        break;
      case (d100 < 64): good = this.generateReligiousArtifact(treasureValue);
        break;
      case (d100 < 86): good = this.treasureDetails('ScrollsBooks') + ' (' + treasureValue + 'gp)';
        break;
      case (d100 < 91): good = this.treasureDetails('LabItems') + ' (' + treasureValue + 'gp)';
        break;
      case (d100 < 101): good = this.treasureDetails('MagicalComponents') + ' (magical component, ' + treasureValue + 'gp)';
        break;
      default: console.log('good type error');
        break;
    }
    return good;
  }

  generateDrinks(treasureValue) {
    const perLb = this.roll(5);
    const weight = treasureValue / perLb;
    const numBottles = weight / 2;
    const liquidContainer = this.treasureDetails('LiquidContainer');
    return Math.round(numBottles) + ' ' + this.treasureDetails('Drink') + ' in a ' + liquidContainer + ' ' + ' (2 lbs. & ' + (perLb * 2) + ' gp/Unit)';
  }

  generateFruit(treasureValue) {
    const perLb = this.roll(10);
    const weight = treasureValue / perLb;
    const numCrates = weight / 10;
    return Math.round(numCrates) + ' Crates of ' + this.treasureDetails('ExoticFruit') + ' (10 lbs. & ' + (perLb * 10) + ' gp/crate)';
  }

  generateMetalBars(treasureValue) {
    const bars = this.treasureDetails('Metal') + ' Ore/Bars/Ingots';
    const weight = this.roll(150);
    return bars + ' (' + treasureValue + 'gp, ' + weight + ' lbs.)';
  }

  generateIvory(treasureValue) {
    const weight = Math.floor(Math.random() * (21)) + 5;
    const value = Math.round(treasureValue / weight);
    return weight + ' lbs. of ' + this.treasureDetails('Ivory') + ' (' + value + 'gp/lb.)';
  }

  generateFabric(treasureValue) {
    const value = Math.floor(Math.random() * (21)) + 20;
    const weight = Math.round(treasureValue / value);
    const sqYards = weight * 2;
    return weight + ' lbs. (' + sqYards + ' sq. yards) of ' + this.treasureDetails('FancyFabric') + ' (' + value + 'gp/lb.)';
  }

  generateReligiousArtifact(treasureValue) {
    const treasure = this.treasureDetails('ReligiousArtifacts');
    let weight;
    if (treasure.includes('Altar') && !treasure.includes('Cloth')) {
      weight = Math.floor(Math.random() * (1991)) + 10;
    } else if (treasure.includes('Brazier')) {
      weight = Math.floor(Math.random() * (196)) + 5;
    } else if (treasure.includes('Kneeling')) {
      weight = Math.floor(Math.random() * (18)) + 3;
    } else if (treasure.includes('Lectern')) {
      weight = Math.floor(Math.random() * (131)) + 20;
    } else if (treasure.includes('Reliquary')) {
      weight = Math.floor(Math.random() * (46)) + 4;
    } else {
      weight = this.roll(5);
    }
    return treasure + ' (' + treasureValue + ', ' + weight + ' lbs.)';
  }

  generateCoins(value) {
    let coins;
    const d12 = this.roll(12);
    switch (true) {
      case (d12 < 4): coins = value * 100 + ' cp';
        break;
      case (d12 < 8): coins = value * 10 + ' sp';
        break;
      case (d12 < 12): coins = value + ' gp';
        break;
      case (d12 < 13): coins = value / 10 + ' pp';
        break;
      default: console.log('coin error');
        break;
    }

    coins += ' in a ' + this.treasureDetails('Container');

    const trapd20 = this.roll(20);
    if (trapd20 === 1) {
      coins += ' trapped with ' + this.treasureDetails('Trap');
    }

    const conceald20 = this.roll(20);
    if (conceald20 === 1) {
      coins += ' hidden by ' + this.treasureDetails('Hidden');
    }

    return coins;
  }

  /*generateFurnishingClothing() {
    let foc: any = this.roll(2);
    if (foc === 1) {
      foc = this.generateFurnishing();
    } else {
      foc = this.generateClothing();
    }
    return foc;
  }

  generateFurnishing() {
    let furnishing;
    return furnishing;
  }

  generateClothing() {
    let clothing;
    return clothing;
  }*/

  generateGems(value) {
    let gems;
    let numGems = this.roll(12);
    switch (true) {
      case (numGems < 2): numGems = 1; value *= 2;
        break;
      case (numGems < 4): numGems = 1;
        break;
      case (numGems < 6): numGems = this.roll(3) + 1;
        break;
      case (numGems < 8): numGems = this.roll(6) + 2;
        break;
      case (numGems < 10): numGems = this.roll(4) + this.roll(4) + 2;
        break;
      case (numGems < 12): numGems = this.roll(6) + this.roll(6) + this.roll(6) + 3;
        break;
      case (numGems < 13): numGems = Math.floor(Math.random() * (41)) + 80;
        break;
      default: console.log('num gems error');
        break;
    }
    const gemValue = Math.round(value / numGems * 10) / 10;

    let gemStep;
    switch (true) {
      case (gemValue < .11): gemStep = 1;
        break;
      case (gemValue < .51): gemStep = 2;
        break;
      case (gemValue < 1): gemStep = 3;
        break;
      case (gemValue < 2): gemStep = 4;
        break;
      case (gemValue < 11): gemStep = 5;
        break;
      case (gemValue < 51): gemStep = 6;
        break;
      case (gemValue < 151): gemStep = 7;
        break;
      case (gemValue < 301): gemStep = 8;
        break;
      case (gemValue < 501): gemStep = 9;
        break;
      case (gemValue < 1001): gemStep = 10;
        break;
      case (gemValue < 2501): gemStep = 11;
        break;
      case (gemValue < 5001): gemStep = 12;
        break;
      case (gemValue < 10001): gemStep = 13;
        break;
      case (gemValue < 50001): gemStep = 14;
        break;
      case (gemValue > 50000): gemStep = 15;
        break;
      default: console.log('gem step error');
        break;
    }

    let gemType;
    let gemRank;
    let stepDifference;
    do {
      gemType = this.treasureDetailsArr(Gem);

      _.forEach(GemRanks, function (gemList, key) {
        if (gemList.includes(gemType) === true) {
          gemRank = key;
        }
      });

      stepDifference = gemStep - gemRank;
      // positive step difference = gem upgrade
      // neg step diff = gem downgrade
    } while (stepDifference < -6 || stepDifference > 10);

    let size;
    let sized20;
    let sizeMod;
    let qualityMod;
    do {
      sized20 = this.roll(20);
      switch (true) {
        case (sized20 < 2): sizeMod = -3; size = 'Tiny (0.01 lbs. each, [100/lb.])'; // 100 per lb. (.01 lbs.)
          break;
        case (sized20 < 3): sizeMod = -2; size = 'Very Small (0.05 lbs. each, [20/lb.])'; // 20 per lb. (.05 lbs.)
          break;
        case (sized20 < 6): sizeMod = -1; size = 'Small (0.1 lbs. each, [10/lb.])'; // 10 per lb. (.1 lbs.)
          break;
        case (sized20 < 14): sizeMod = 0; size = 'Average (0.2 lbs. each, [5/lb.])'; // .5lbs., roughly 2x2x2 inches
          break;
        case (sized20 < 18): sizeMod = 1; size = 'Large (1 lb. each)'; // fist sized/baseball sized, 2 lb.
          break;
        case (sized20 < 19): sizeMod = 2; size = 'Very Large (5 lbs. each)'; // 2 fists, 5 lb.
          break;
        case (sized20 < 20): sizeMod = 3; size = 'Huge (10 lbs. each)'; // small sized head, 15 lb.
          break;
        case (sized20 < 21):
          sized20 = this.roll(20);
          switch (true) {
            case (sized20 < 15): sizeMod = 4; size = 'Massive (25 lbs. each)'; // medium creature head size, 50 lb.
              break;
            case (sized20 < 21): sizeMod = 5; size = 'Gargantuan (100 lbs. each)'; // ~torso, 150 lb.
              break;
            default: console.log('gem size 2 error');
          }
          break;
        default: console.log('gem size error');
          break;
      }
      qualityMod = stepDifference - sizeMod;
    } while ((qualityMod < -3 || qualityMod > 5) === true);

    let quality;
    switch (qualityMod) {
      case -3: quality = 'Badly Flawed';
        break;
      case -2: quality = 'Flawed';
        break;
      case -1: quality = 'with Minor Inclusions';
        break;
      case 0: quality = 'Average Quality';
        break;
      case 1: quality = 'Good Quality';
        break;
      case 2: quality = 'Excellent Quality';
        break;
      case 3: quality = 'Near Perfect';
        break;
      case 4: quality = 'Perfect';
        break;
      case 5: quality = 'Flawless';
        break;
      default: console.log('gem quality error');
        break;
    }

    return gems = numGems + ' ' + size + ' ' + gemType + ', ' + quality + ' (' + gemValue + ' gp each)';
  }

  treasureDetails(arrString) {
    const arr = eval(arrString);
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

        if (typeof (tempdeets) === 'string') {
          if (tempdeets.includes('Random') === true) {
            tempdeets = this.treasureDetailsArr(eval(tempdeets.slice(7)));
          }
          moredeets += ' ' + tempdeets;
        } else {
          // deeper object
          for (const tempkey of Object.keys(tempdeets)) {
            let doubletempdeets = tempdeets[tempkey][Math.floor(Math.random() * tempdeets[tempkey].length)];

            if (typeof (doubletempdeets) === 'string') {
              if (doubletempdeets.includes('Random') === true) {
                doubletempdeets = this.treasureDetailsArr(eval(doubletempdeets.slice(7)));
              }
              moredeets += ' ' + doubletempdeets;
            } else {
              // deeper object
              console.log('double deeper! what the fuuuuuuuuck!!!!!');
            }

          }
        }

      }
      return moredeets.replace(' ', '');
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

  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

}

// GENERIC MATERIALS
const Wood = ['Pine', 'Cedar', 'Cypress', 'Fir', 'Yew', 'Hemlock', 'Larch', 'Redcedar', 'Redwood', 'Spruce', 'Alder', 'Applewood',
  'Ash', 'Aspen', 'Balsa Beech', 'Birch', 'Basswood', 'Blackwood', 'Boxwood', 'Buckeye', 'Cherry', 'Chestnut', 'Cottonwood', 'Dogwood',
  'Ebony', 'Elm', 'Eucalyptus', 'Gum wood', 'Hickory', 'Ironwood', 'Locust wood', 'Maple', 'Oak', 'Poplar', 'Sandalwood', 'Sassafras',
  'Teak', 'Walnut', 'Willow', 'Bluewood', 'Duskwood', 'Shadowtop wood', 'Silverbark', 'Weirwood'];

const Fabric = ['Woolen Wool', 'Worested Wool', 'Goat Hide', 'Alpaca Wool', 'Vicuna Fur', 'Llama Wool', 'Camel Hide', 'Rabbit Hide', 'Wadmal', 'Silk', 'Grass',
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

const Weapon = [{
  1: ['Random Metal'],
  2: ['Club', 'Ball Game Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Light Crossbow', 'Dart', 'Shortbow',
    'Sling', 'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword',
    'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Heavy Crossbow', 'Longbow', 'Crossbow Bolts', 'Arrows'],
  3: ['with'],
  4: ['Random Accent'],
  5: ['in a'],
  6: ['Random FancyFabric'],
  7: ['Sheath/Scabbard/Quiver']
}];

const Accent = ['Word Engravings', 'Picture Carvings', 'Runes', { 1: ['Random Metal'], 2: ['Inlay'] }, { 1: ['Embedded'], 2: ['Random Gem'] }];

const Armor = ['Random ClothArmor', 'Random MetalArmor'];

const ClothArmor = [{
  1: ['Random Fabric', 'Random FancyFabric'],
  2: ['Padded', 'Leather', 'Studded Leather', 'Hide']
}];

const MetalArmor = [{
  1: ['Random Metal'],
  2: ['Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint', 'Plate Mail', 'Shield']
}];

const DragonHide = [{
  1: ['Black Dragon', 'Blue Dragon', 'Brass Dragon', 'Bronze Dragon', 'Copper Dragon', 'Gold Dragon', 'Green Dragon', 'Red Dragon',
    'Silver Dragon', 'White Dragon'],
  2: ['Hide']
}];

// ART

const PaperArt = [{
  1: ['Pastel', 'Charcoal', 'Colored Pencil', 'Conte', 'Crayon', 'Graphite', 'Ink', { 1: ['Calligraphic', 'Printed', 'Illustrated'], 2: ['Manuscript', 'Letter', 'Drawing'] }],
  2: ['on'],
  3: ['Paper', 'Canvas', 'Random Wood', 'Plaster', 'Random Metal']
}];

const FabricArt = [{
  1: ['Random Fabric'],
  2: ['Applique', 'Beadwork', 'Crochet', 'Cross-stitch', 'Dying', 'Embroidery', 'Felting', 'Knitting', 'Lace', 'Macrame', 'Nalebinding',
    'Needlework', 'Patchwork', 'Passementerie', 'Quilting', 'Rope', 'Rugmaking', 'Sewing', 'Tapestry', 'Textile printing', 'Weaving']
}];

const Painting = [{
  1: ['Acrylic Paint', 'Oil Paint', 'Enamel Paint', 'Encaustic (wax)', 'Fresco', 'Gesso', 'Glaze', 'Gouache', 'Ink', 'Sumi', 'Tempera', 'Watercolor'],
  2: ['on'],
  3: ['a Structural Object', 'Canvas', 'Clay', 'Random Fabric', 'Glass', { 1: ['Lacquer on'], 2: ['Random Wood'] }, 'Random Metal', 'Paper', 'Random Wood', 'Ceramic']
}];

const Crafts = [
  { 1: ['Glass', 'Random Metal', 'Random Wood'], 2: ['Bracelets'] }, { 1: ['Random Fabric'], 2: ['Lace'] },
  'Paper Origami', 'Ornamental Egg', { 1: ['Glass', 'Ceramic'], 2: ['Mosaic'] }, { 1: ['Random Wood'], 2: ['Burning'] },
  { 1: ['Random FancyFabric'], 2: 'covered', 3: 'Ball Game Ball' }
];

const Carving = [{
  1: ['Bone', 'Gourd', 'Random Ivory', 'Random Stone', 'Random Wood'],
  2: ['Carving']
}];

const Ceramics = [{
  1: ['Figures/Statuary', 'Tiles', 'Tableware/China', 'Pottery'],
  2: ['Ceramics']
}];

const Glasswork = [{
  1: ['Beads', 'Decanter', 'Lamp', 'Chandelier', 'Goblets', 'Crystal', 'Pipe', 'Bowls', 'Stained Window', 'Flowers', 'Tiles', 'Etched', 'Engraved'],
  2: ['Glasswork']
}];

const Stonework = [{
  1: ['Sculpture', 'Statue', 'Carving', 'Engraving', 'Lapidary', 'Pietra Dura', 'Fountain'],
  2: ['from'],
  3: ['Random Stone']
}];

const Metalwork = [{
  1: ['Random Metal'],
  2: ['Sculpture', 'Furnishing', 'Miniatures', 'Random Tool', 'Tableware']
}];

const artValue = {
  0: '<1 gold',
  1: '10 gold',
  2: '25 gold',
  3: '50 gold',
  4: '75 gold',
  5: '100 gold',
  6: '150 gold',
  7: '200 gold',
  8: '300 gold',
  9: '400 gold',
  10: '500 gold',
  11: '750 gold',
  12: '1000 gold',
  13: '1500 gold',
  14: '2000 gold',
  15: '3000 gold',
  16: '4000 gold',
  17: '5000 gold',
  18: '7500 gold',
  19: '10,000 gold',
  20: '20,000 gold',
  21: '40,000 gold',
  22: '80,000 gold',
  23: '150,000 gold',
  24: '250,000 gold',
  25: '400,000 gold',
  26: '800,000 gold',
  27: '1 million gold',
  28: 'Priceless'
};

const LightArt = ['Paper', 'Canvas', 'Gourd'];

const MedArt = ['Plaster', 'Structural Object', 'Clay', 'Glass', 'Ceramic', 'Bone', 'Egg', 'Ivory'];

//


const JeweledItem = [{
  1: ['Anklet', 'Armband', 'Belt', 'Ball Game Ball', 'Ball Game Bat', 'Ball Game Trophy', 'Small Box', 'Coffer', 'Braclet', 'Brooch', 'Buckle', 'Chain', 'Chalice', 'Choker', 'Clasp', 'Collar',
    'Coffer', 'Comb', 'Coronet', 'Crown', 'Decanter', 'Diadem', 'Earring', 'Fob', 'Goblet', 'Headband', 'Idol', 'Locket', 'Medal', 'Medallion', 'Necklace',
    'Pendant', 'Pin', 'Orb', 'Ring', 'Scepter', 'Seal', 'Statuette', 'Tiara', 'Mask', 'Nose Ring/Stud', 'Circlet', 'Torc', 'Random Tool', 'Chatelaine', 'Cuff Link',
    'Lapel Pin', 'Grill', 'Bangles', 'Body Piercing', 'Prayer Beads', 'Puzzle', 'Aiguillette', 'Cock Ring', 'Pectoral', 'Ornamental Disc', 'Icon (small animal, symbol)',
    'Egg', 'Random Armor', 'Jar', 'Random MusicalInstrument'],
  2: ['made from'],
  3: ['Random Metal', 'Random Wood', 'Random Metal'],
  4: ['embedded with'],
  5: ['Random Gem']
}];

// Goods

const Drink = ['Final Sip', 'Apple Duke Cider', 'Rude Gin', 'Gingerroot Beer', 'Pear Lord Wine', 'Dark Blood Ale', 'Dragon Wine', 'Ancient Elven Wine',
  'Crazy Honey Mead', 'Stardust Coffee', 'Witchgrass Tea', 'Drakethistle Tea', 'Myconid Coffee'];

const ExoticFruit = ['Plunana', 'Rose Gourd', 'Rain Cawesh', 'Ground Marang', 'Cave Pepper', 'Flekiragus', 'Miracle Pumpkin', 'Cinder Loquat', 'Moon Dill', 'Regranut',
  'Ocean Rambutan', 'Fire Rambutan', 'Abyss Chicory', 'Eobaco', 'Desert Korlan', 'Night Bramble', 'Star Clementine', 'Sour Mundu', 'Tundra Courgette', 'Pygmy Pomelo',
  'Silver Pear', 'Mammoth Kiwi', 'Slukkuflower', 'Shimmerspud', 'Dragon Lychee', 'Mage Guanabana', 'Grim Bean'];

const FancyFabric = ['Barkcloth', 'Broadcloth', 'Burlap', 'Calico', 'Cambric', 'Canvas', 'Cheesecloth', 'Chiffon', 'Cloth of gold', 'Gauze',
  'Haircloth', 'Himroo', 'Hodden', 'Longcloth', 'Moleskin', 'Muslin', 'Oilskin', 'Ottoman', 'Samite', 'Sateen', 'Satin', 'Scarlet',
  'Silk', 'Brocade', 'Fleece', 'Velvet', 'Velveteen', 'Wadmal', 'Felt', 'Cedar Bark', 'Velour', 'Fishnet', 'Lace', 'Bear Fur',
  'Beaver Fur', 'Bunyip Hide', 'Death Dog Hide', 'Ermine Fur', 'Owlbear Hide', 'Seal Skin', 'Snow Leopard Fur', 'Panther Fur', 'Tiger Fur', 'Lion Fur', 'Winter Wolf Hide',
  'Yeti Hide', 'Zebra Hide', 'Auroch Hide', 'Basilisk Hide', 'Random DragonHide', 'Displacer Beast Fur', 'Gorgon Hide',
  'Hippopotamus Leather', 'Ki-rin Fur', 'Otyugh Leather', 'Snake Skin', 'Crocodile Hide', 'Lizard Hide', 'Turtle Skin', 'Dinosaur Hide', 'Pegasus Hide', 'Dryad Bark', 'Manticore Hide',
  'Griffon Hide', 'Worg Fur', 'Troll Hide', 'Hydra Leather', 'Rhino Leather', 'Chimera Hide'];

const Ivory = [{
  1: ['Baku', 'Behemoth', 'Catoblepas', 'Hippopotamus', 'Hollyphant', 'Mammoth', 'Mastodon', 'Narwhal', 'Oliphant', 'Walrus', 'Giant Walrus', 'Minotaur'],
  2: ['Ivory', { 1: 'Random Subject', 2: 'Scrimshaw' }]
}];

const ReligiousArtifacts = [{
  1: ['Random FancyFabric', 'Random Metal', 'Random Fabric', 'Random Wood'],
  2: ['Altar', 'Altar Cloth', 'Bell', 'Brazier', 'Candelabra', 'Candles', 'Candlestick', 'Cassock', 'Censer', 'Chalice', 'Chimes', 'Font',
    'Holy Symbol', 'Holy Bones', 'Idol', 'Incense', 'Incense Burner', 'Kneeling Bench', 'Lamp', 'Lectern', 'Mosaic', 'Offertory Container',
    'Reliquary', 'Snuffing Bell', 'Thurible', 'Vestment', 'Whistle']
}];

const ScrollsBooks = [{
  1: ['Autobiography', 'Biography', 'Engineering', 'Erotica', 'Historical', 'Legal Text', 'Epic', 'Novel', 'Play', 'Poetry', 'Ornithological', 'Planar', 'Religious',
    'Spellcraft', 'Trade Secrets', 'Warfare', 'Random Race', 'Random Universe'],
  2: ['Scroll', 'Book (5 lbs.)'],
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

// Container

const Container = ['Random Bag', 'Barrel', 'Random Coffer', 'Random Chest', 'Random HugeChest', 'Random Urn', 'Random Jar', 'Niche', 'Pile'];

const LiquidContainer = ['Random Urn', 'Random Jar', 'Random Bottle'];

const Bag = [{
  1: ['Random Fabric', 'Random Fabric', 'Random FancyFabric'],
  2: ['Bag', 'Sack']
}];

const Coffer = [{
  1: ['Random ContainerMat'],
  2: ['Coffer', 'Kist']
}];

const Chest = [{
  1: ['Random ContainerMat'],
  2: ['Chest']
}];

const HugeChest = [{
  1: ['Huge'],
  2: ['Random ContainerMat'],
  3: ['Chest']
}];

const Urn = [{
  1: ['Random ContainerCeramic'],
  2: ['Urn with'],
  3: ['Random Lid']
}];

const Jar = [{
  1: ['Random ContainerCeramic'],
  2: ['Jar with'],
  3: ['Random Lid']
}];

const Bottle = [{
  1: ['Glass'],
  2: ['Bottle with'],
  3: ['Random Lid']
}];

const Lid = ['no lid', 'a wax seal', 'a stopper', 'a lid'];

const ContainerCeramic = ['Glass', 'Random Wood', 'Random Metal', 'Pottery', 'Ceramic'];

const ContainerMat = ['Bronze', 'Cheap Wooden', 'Carved Wooden', 'Painted Wooden', 'Sturdy Wooden', 'Random Wood', 'Copper', 'Gold', 'Iron', 'Lead', 'Leather',
  'Marble', 'Silver', 'Slate', 'Steel', 'Random Stone', 'Magical Energy'];

const Trap = ['Contact Poison on Treasure', 'Contact Poison on Container', 'Poisoned needles in the lock', 'Poisoned needle in the handle',
  'Poisoned spring darts in the front', 'Poisoned spring darts on top', 'Poisoned spring darts from inside lid', 'Poisoned spring darts from inside bottom',
  'Blade scything across top', 'Poisonous vermin', 'Poison Gas', 'Trap Door', 'Stone Block Drops', 'Magic'];

const Hidden = ['Concealment', 'Invisibility', 'Secret space under container', 'Secret Compartment', 'being Disguised to appear as something else',
  'being under a heap of trash or dung', 'being under a loose stone in the floor or wall', 'a nearby secret or concealed room'];

// Gems

const Gem = ['Azurite', 'Banded Agate', 'Blue Quartz', 'Eye Agate', 'Hematite', 'Lapis Lazuli', 'Malachite', 'Moss Agate', 'Obsidian', 'Pyrite', 'Rhodochrosite',
  'Tiger Eye', 'Turquoise', 'Mother of Pearl', 'Amazon Stone', 'Bloodstone', 'Carnelian', 'Chalcedony', 'Chrysoprase', 'Citrine', 'Jasper', 'Moonstone', 'Onyx',
  'Rock Crystal', 'Sardonyx', 'Serpentine', 'Smoky Quartz', 'Star Rose Quartz', 'Variscite', 'Amber', 'Alamandines', 'Alexandrite', 'Amethyst', 'Chrysoberyl',
  'Coral', 'Diopside', 'Garnet', 'Idicolite', 'Jade', 'Jet', 'Morganite', 'Nephrite', 'Pearl', 'Spessarite', 'Sugilite (luvulite)', 'Rubellite Tourmaline',
  'Zircon', 'Aquamarine', 'Garnet', 'Black Pearl', 'Peridot', 'Spinel', 'Kunzite', 'Hiddentine', 'Topaz', 'Zoisite (Tanzanite)', 'Black Opal', 'Emerald',
  'Fire Opal', 'Garnet', 'Opal', 'Oriental Amethyst', 'Oriental Topaz', 'Sapphire', 'Star Ruby', 'Star Sapphire', 'Ammolite', 'Black Sapphire', 'Diamond',
  'Jacinth', 'Oriental Emerald', 'Ruby'];

const GemRanks = {
  5: ['Azurite', 'Banded Agate', 'Blue Quartz', 'Eye Agate', 'Hematite', 'Lapis Lazuli', 'Malachite', 'Moss Agate', 'Obsidian', 'Pyrite', 'Rhodochrosite', 'Tiger Eye',
    'Turquoise', 'Mother of Pearl'],
  6: ['Amazon Stone', 'Bloodstone', 'Carnelian', 'Chalcedony', 'Chrysoprase', 'Citrine', 'Jasper', 'Moonstone', 'Onyx', 'Rock Crystal', 'Sardonyx', 'Serpentine',
    'Smoky Quartz', 'Star Rose Quartz', 'Variscite'],
  7: ['Amber', 'Alamandines', 'Alexandrite', 'Amethyst', 'Chrysoberyl', 'Coral', 'Diopside', 'Garnet', 'Idicolite', 'Jade', 'Jet', 'Morganite', 'Nephrite', 'Pearl',
    'Spessarite', 'Sugilite (luvulite)', 'Rubellite Tourmaline', 'Zircon'],
  8: ['Aquamarine', 'Garnet', 'Black Pearl', 'Peridot', 'Spinel', 'Kunzite', 'Hiddentine', 'Topaz', 'Zoisite (Tanzanite)'],
  9: ['Black Opal', 'Emerald', 'Fire Opal', 'Garnet', 'Opal', 'Oriental Amethyst', 'Oriental Topaz', 'Sapphire', 'Star Ruby', 'Star Sapphire'],
  10: ['Ammolite', 'Black Sapphire', 'Diamond', 'Jacinth', 'Oriental Emerald', 'Ruby']
};

// Perfume

const Perfume = [{
  1: ['Perfume'],
  2: ['in a'],
  3: ['Random LiquidContainer']
}];

const ArtSubject = ['Abstract', 'Monster', 'Humanoid', 'Supernatural', 'Local', 'Historical', 'Religious', 'Wealthy/Noble', 'Royalty'];


export const Complication = {
    Hazard: {
        1: ['Spiderwebs (enter or starting turn DC 12 Dex or restrained [action to DC 12 athletics or acrobatics])', 'Shrieker Grounds (MM 138)',
            'Poison Gas (vents release gas randomly, every round each vent 1 in 4 chance to expel gas at init 0 [DC 10 CON save; 1d10 poison to all adjacent targets])',
            'Bees! (area of effect attacks release an insect swarm that attacks the nearest creature(s))',
            'Sinkhole (DC 12 Dex; 1d6 falling)'],
        2: ['Quicksand/mud/tarpit[flammable!] (when enter sink 1d4+1 ft and be restrained; sink 1d4 at start of turn; DC 10+ft submerged STR to bust out as action; other creature can try DC 5+ft submerged STR check)',
            'Razorvine (10x10 section is AC 11, 25 hp, immune to bludgeoning, piercing, and psychic; DC 10 DEX save with contact or take 1d10 slashing)',
            'Natural Gas Pockets (flame spells cause explosions: 40% on caster, 40% on target, 20% on both)',
            'Poison Gas (vents release gas randomly, every round each vent 1 in 4 chance to expel gas at init 0 [DC 15 CON save; 2d10 poison to all adjacent targets])'],
        3: ['Cave-In/Sinkhole (DC 15 Dex; [4/8d6 for sinkhole/cave-in] + 1d6 per minute buried; 5x5x5 area = 1 ton; 1 minute to clear 100x STR score, doubled with proper tools)',
            'Gas Spore (MM 138) Grounds', 'Poison Gas (vents release gas randomly, every round each vent 1 in 4 chance to expel gas at init 0 [DC 20 CON save; 4d10 poison to all adjacent targets])',
            'Poisoned Water - Unless the characters have a way to purify water, they are unable to drink and refill their water supplies for the day']
    },
    Locale: {
        1: ['Giant Crystal Shard', 'Floating Earth Mote(s)', 'Ancient Ruins', 'Desecrated Ground (DMG 110)', 'Fairy Ring', 'Menhir', 'Faces/Statues carved into the Rock'],
        2: ['Haunted Barrow Mound', 'Boulder carved with talking faces', 'Ancient Shrine', 'Menhir with writings/carvings', 'Rusted Giant\'s Weapon'],
        3: ['Antilife Aura (living creatures can’t regain hp)', 'Dead Magic Zone (antimagic)', 'Wild Magic Zone (roll on Wild Magic Surge table PHB 104 whenever a spell is cast)', 'Blood Rocks (pulsing veins that ooze crimson ichor if slashed)']
    },
    Trap: {
        1: ['Magic Item Suppression', 'Magic Mouth speaks riddles', 'Object flies about to avoid being touched',
            'Object wails loudly', 'Object talks (normal speech, nonsense, poetry and rhymes, singing, spellcasting', 'Snare', '10 ft. pit (DC 11 passive perception)'],
        2: ['Bestow Resistance/Vulnerability', 'Illusion', 'Contains imprisoned creature', 'Releases/summons/turns into a monster', 'Cantrip Spell Suppression', '30 ft. pit (DC 15 passive perception)'],
        3: ['Aging Trap', 'Force Field', 'Confusion (DC 14 WIS save all creatures within 10 ft. [as per spell PHB 224])',
            '30 ft. pit w/ stuff at bottom (DC 18 passive perception) [Spikes: +2d10, Poison/Diseased Spikes: +4d10 (Con 13 or half), Insect Swarm]']
    }
};

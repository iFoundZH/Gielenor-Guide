import type { SkillTrainingGuide } from "@/types/guides";

export const miningF2pGuide: SkillTrainingGuide = {
  skill: "Mining" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Mining_training",
  methods: [
    {
      name: "Doric's Quest",
      levelRange: [1, 10],
      xpPerHour: null,
      description:
        "It is recommended to complete Doric's Quest early on for the reward of 1,300 Mining experience, enough to level Mining from 1 to 10. It can be completed immediately by already having the required m...",
      members: false,
    },
    {
      name: "Copper and Tin ore",
      levelRange: [1, 15],
      xpPerHour: null,
      description:
        "Mine copper or tin ore from rocks near Lumbridge or the Dwarven Mine. Each ore grants 17.5 experience. This is the standard early-game Mining method for free-to-play players before iron becomes available at level 15.",
      members: false,
    },
    {
      name: "Iron ore",
      levelRange: [15, 70],
      xpPerHour: null,
      description:
        "From level 15, iron ore provides the best free-to-play Mining experience. Use 3-rock iron mining spots such as the one in the Mining Guild (level 60+) or Al Kharid mine. Iron rocks respawn quickly and each ore gives 35 experience.",
      members: false,
    },
    {
      name: "Superheat Item",
      levelRange: [30, 99],
      xpPerHour: null,
      description:
        "Superheat Item can be used at 43 Magic and the appropriate Smithing level to smelt a bar without a furnace. This reduces the need to bank when Mining, especially for coal. Equip a staff of fire, an...",
      members: false,
    },
    {
      name: "Adamantite ore",
      levelRange: [70, 85],
      xpPerHour: null,
      description:
        "At level 70, adamantite ore becomes available, providing 95 experience per ore. Rocks have a slow respawn time, so world hopping between 2-3 mining spots is recommended. Good locations include the Dwarven Mine and the Wilderness.",
      members: false,
    },
    {
      name: "Runite ore",
      levelRange: [85, 99],
      xpPerHour: null,
      description:
        "At level 85, runite ore becomes available, providing 125 experience per ore. Rocks respawn very slowly, requiring world hopping. Free-to-play runite locations include the Lava Maze in the Wilderness and spots in the Mining Guild.",
      members: false,
    },
    {
      name: "Crashed stars",
      levelRange: [10, 99],
      xpPerHour: 13000,
      description:
        "Crashed Stars are part of the Shooting Stars Distraction and Diversion. Mining them yields low experience per hour, but is very AFK, as you can mine for seven minutes before having to click again w...",
      members: false,
    },
    {
      name: "Barronite shards and deposits",
      levelRange: [14, 99],
      xpPerHour: 20000,
      description:
        "Completing the free-to-play Below Ice Mountain quest rewards the player with access to the Ruins of Camdozaal where you can mine barronite shards from barronite rocks. Mining barronite shards gives...",
      members: false,
    },
  ],
};

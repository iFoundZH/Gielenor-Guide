import type { SkillTrainingGuide } from "@/types/guides";

export const constructionF2pGuide: SkillTrainingGuide = {
  skill: "Construction" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Construction_training",
  methods: [
    {
      name: "Starting off",
      levelRange: [1, 33],
      xpPerHour: null,
      description: "The table below shows the furniture and materials needed to reach level 33. Be sure to bring a saw and a hammer in order to make furniture. Regular planks require using nails. Use steel nails or be...",
      members: false,
    },
    {
      name: "/74: Oak larders",
      levelRange: [33, 52],
      xpPerHour: 480000,
      description: "From level 33 to 52, build oak larders in the Kitchen. Oak larders require 8 oak planks to build, and they grant 480 experience each. Players can gain up to around 480,000 experience per hour from ...",
      members: false,
    },
    {
      name: "Mahogany furniture",
      levelRange: [52, 99],
      xpPerHour: 900000,
      description: "Building mahogany furniture becomes the fastest viable training method at level 52. It is very expensive, so look into cheaper alternatives (such as teak or oak furniture) if trying to save money. ...",
      members: false,
    },
    {
      name: "Mahogany Homes",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Mahogany Homes is a cheaper and less click-intensive alternative to the faster methods. Players work as a contractor for the Mahogany Homes company, repairing and replacing furniture in client NPCs...",
      members: false,
    },
    {
      name: "Shipwrights' workbench",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Boat repair kits and hull parts can be constructed at a shipwrights' workbench near a bank and resold to other players, which is different from most other Construction training methods which use re...",
      members: false,
    },
    {
      name: "Mounted mythical capes",
      levelRange: [50, 99],
      xpPerHour: null,
      description: "Mounted mythical capes are a cheaper alternative to mahogany or other teak furniture. They require 3 teak planks each along with a mythical cape. The cape is returned after removing the furniture. ...",
      members: false,
    },
    {
      name: "/99: Teak garden benches",
      levelRange: [66, 74],
      xpPerHour: 700000,
      description: "Building teak garden benches is the fastest way to use teak planks. They require 6 teak planks to build and give 540 experience each. This method is similar to gnome benches, offering slower (albei...",
      members: false,
    },
    {
      name: "Use the custom swap \"Talk",
      levelRange: [74, 99],
      xpPerHour: null,
      description: "Use the custom swap \"Talk-to,Demon Butler\" to give him priority over the door on left clicks.",
      members: false,
    },
    {
      name: "Menu entry swap the door space to build, and the built doors to remove",
      levelRange: [74, 99],
      xpPerHour: null,
      description: "Menu entry swap the door space to build, and the built doors to remove.",
      members: false,
    },
    {
      name: "Hold 1, and get familiar with the click timings",
      levelRange: [74, 99],
      xpPerHour: null,
      description: "Hold 1, and get familiar with the click timings. This eliminates having to switch keys and having to right click.",
      members: false,
    },
  ],
};

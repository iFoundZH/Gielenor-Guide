import type { IronmanGuide } from "@/types/guides";

export const hardcoreIronmanGuide: IronmanGuide = {
  variant: "hardcore" as IronmanGuide["variant"],
  wikiUrl: "https://oldschool.runescape.wiki/w/Hardcore_Ironman_guide",
  sections: [
    {
      title: "Limitations",
      level: 2,
      content: "Hardcore Ironman accounts share all restrictions with standard Ironman accounts:\n\n* Trading other players is disabled.\n* The Grand Exchange cannot be used to buy or sell items, with the exception of bonds (buy only).\n* Accept Aid is disabled.\n* Experience from player-versus-player encounters is not gained.\n* Drops from other players' kills cannot be picked up.\n* Assistance from other players to slay a monster is not allowed.\n\nIn addition to these restrictions, Hardcore Ironmen have only one life. A dangerous death will permanently revert the account to a standard Ironman, and the player's stats on the Hardcore Ironman Hiscores will be frozen at the moment of death. Safe deaths, such as those in many minigames and tutorial areas, do not count and will not remove Hardcore status.\n\nHardcore Ironman accounts are identified by a red skull icon next to their name. This icon is visible to all players and serves as a badge of the account's status. Once lost, Hardcore status cannot be regained.\n\nThe Hardcore Ironman Hiscores track total level and experience for all active Hardcore Ironmen. Dying removes the account from the active rankings, though frozen stats remain visible. Many players treat maintaining their Hiscores rank as a primary goal.\n\nHardcore Ironman mode must be activated by speaking to the Ironman tutor on Tutorial Island before being teleported to the mainland. Players should be absolutely certain of their choice, as it cannot be reversed once the account leaves Tutorial Island.",
      subsections: [],
    },
    {
      title: "Safe vs Dangerous Deaths",
      level: 2,
      content: "Understanding which deaths are safe and which are dangerous is the single most important knowledge a Hardcore Ironman can have. Getting this wrong means the end of the account's Hardcore status.\n\nAs a general rule, if you are unsure whether a death is safe, treat it as dangerous. Always research new content before attempting it on your Hardcore.",
      subsections: [
        {
          title: "Safe deaths",
          level: 3,
          content: "The following deaths will not remove Hardcore Ironman status:\n\n* Most minigame deaths, including Pest Control, Barbarian Assault, Castle Wars, Soul Wars, Clan Wars (safe portal), Last Man Standing, Guardians of the Rift, and Trouble Brewing.\n* Nightmare Zone deaths (both practice and rumble modes).\n* Tutorial and instanced safe areas, such as Cook's Assistant cutscenes and certain quest instances explicitly marked as safe.\n* Deaths in the Emir's Arena (formerly Duel Arena).\n* Deaths during Wintertodt, Tempoross, and Volcanic Mine.\n* Deaths in the Gauntlet and Corrupted Gauntlet (these are safe deaths, though the content itself is very mechanically demanding).\n* Deaths in Tombs of Amascut (the raid itself is a safe death, but the path to the raid is not).\n* Deaths during Hallowed Sepulchre.\n* Deaths during the Mage Training Arena.\n* Deaths in player-owned houses (both your own and others').\n\nNote that safe death status can change with game updates. Always verify before attempting content for the first time.",
          subsections: [],
        },
        {
          title: "Dangerous deaths",
          level: 3,
          content: "The following deaths are dangerous and will end Hardcore status:\n\n* All overworld deaths, including being killed by any monster or NPC in the open game world.\n* All Wilderness deaths, whether from monsters, other players, or environmental damage.\n* Deaths at the TzHaar Fight Cave (including during the Jad fight). Note: the Inferno is also a dangerous death.\n* Deaths at most bosses outside of raids, including God Wars Dungeon, Zulrah, Vorkath, Corporeal Beast, Cerberus, the Alchemical Hydra, and all Wilderness bosses.\n* Deaths at Theatre of Blood (this is a dangerous death, unlike Tombs of Amascut).\n* Deaths at Chambers of Xeric (dangerous death).\n* Deaths from poison or venom while in dangerous areas.\n* Deaths from disconnection in dangerous areas. The game does not distinguish between a disconnect death and a normal death.\n* Deaths at the Phantom Muspah, Nex, and the Desert Treasure II bosses.\n\nSome content has changed between safe and dangerous over the years. The OSRS Wiki maintains an up-to-date list of safe death locations. Always check the wiki page for any new boss or activity before attempting it.",
          subsections: [],
        },
        {
          title: "Disconnect deaths",
          level: 3,
          content: "Disconnection is one of the most common causes of Hardcore Ironman deaths. When you disconnect, your character remains in the game world for up to 60 seconds. If a monster kills you during that time, the death counts as dangerous.\n\nTo mitigate disconnect risk:\n\n* Use a stable, wired internet connection whenever possible.\n* Avoid doing dangerous PvM content during known server instability or DDoS attacks.\n* Keep your character in a safe area when not actively playing.\n* Consider logging out rather than idling in dangerous locations.\n* Use the official world status page to check server stability before bossing.",
          subsections: [],
        },
      ],
    },
    {
      title: "Early Game Strategy",
      level: 2,
      content: "The early game for a Hardcore Ironman follows a similar path to standard Ironman, but with a strong emphasis on avoiding unnecessary risk. Every activity should be evaluated through the lens of \"can this kill me?\" before attempting it.\n\nThe overarching strategy is to build up your account's stats, gear, and supplies through safe or low-risk methods before engaging with any content that could result in a dangerous death.",
      subsections: [
        {
          title: "Wintertodt at low HP",
          level: 3,
          content: "Wintertodt is one of the best early-game activities for Hardcore Ironmen. The damage taken from Wintertodt scales with the player's Hitpoints level, so starting at 10 HP means the cold and falling snow deal only 1 damage per hit. This makes the activity essentially risk-free at low levels.\n\nPlayers commonly train Firemaking to 85-99 at Wintertodt before doing anything else. This provides:\n\n* A large supply of starting cash from crate rewards.\n* Seeds, ores, herbs, and other skilling supplies.\n* Construction, Woodcutting, and Fletching experience.\n\nBringing cakes or wines as food is sufficient at 10 HP. The main risk is accidentally training Hitpoints before starting Wintertodt, so avoid all combat until you have finished your Wintertodt grind.",
          subsections: [],
        },
        {
          title: "Safe questing",
          level: 3,
          content: "Questing is essential for early progression, but many quest bosses can be dangerous if unprepared. Follow these principles:\n\n* Always look up quest boss fights before attempting them. Know what damage they deal and whether safespots exist.\n* Many quest bosses can be safespotted or flinched. Use these methods whenever available.\n* Bring more food than you think you need. Over-preparation is always better than death.\n* Iban's staff from Underground Pass is a common danger point. The quest has several areas with high-hitting enemies. Use protection prayers and bring plenty of food.\n* Monkey Madness I has a notoriously dangerous tunnel section. Many Hardcore Ironmen have died here. Use protection prayers, bring emergency teleports, and consider using stamina-restoring methods.\n* Desert Treasure I has several challenging fights. The ice diamond fight with Kamil is particularly dangerous due to the freezing mechanic and stat drain.",
          subsections: [],
        },
        {
          title: "Safe combat training",
          level: 3,
          content: "For combat training, prioritize methods where death is nearly impossible:\n\n* Sand Crabs and Ammonite Crabs are excellent for safe AFK melee and ranged training. They deal very little damage and are in non-dangerous areas.\n* Crabs are preferred over Rock Crabs because the areas are generally less crowded and farther from any Wilderness access.\n* Use protection prayers when fighting anything that could deal significant damage.\n* Avoid multi-combat areas where you could be overwhelmed by multiple enemies.\n* Keep your Hitpoints high at all times. Never let yourself drop below half health without eating.\n* The Nightmare Zone is completely safe and provides excellent melee training once you have enough quest points to make it worthwhile.\n\nAvoid the Wilderness entirely in the early game. There is no content in the Wilderness worth risking your Hardcore status for at low levels.",
          subsections: [],
        },
        {
          title: "Early transportation safety",
          level: 3,
          content: "Transportation is important for all Ironmen, but Hardcore Ironmen should be especially careful about certain travel methods:\n\n* Avoid the Wilderness at all costs. Do not use shortcuts or paths that go through it.\n* The Abyss requires running through dangerous Wilderness territory. Use the slower but safer altar entrances for Runecraft training instead.\n* Be cautious with random events. While most are harmless, always pay attention to avoid being teleported somewhere unexpected.\n* Keep a teleport (such as an ectophial, house teleport tablet, or ring of dueling) in your inventory at all times when in dangerous areas.\n* Training Agility early is recommended for all Ironmen, and doubly so for Hardcores. Better run energy regeneration means less time spent walking through dangerous areas.",
          subsections: [],
        },
      ],
    },
    {
      title: "Risk Management",
      level: 2,
      content: "Risk management is the defining skill of a successful Hardcore Ironman. Every piece of content should be assessed for its danger level relative to the reward it offers. Many Hardcore Ironmen set personal rules about what content they will and will not attempt, and adjust those rules as their account grows stronger.",
      subsections: [
        {
          title: "Content to avoid or delay",
          level: 3,
          content: "Some content is best avoided entirely or delayed until your account is significantly overgeared for it:\n\n* TzHaar Fight Cave (Jad): Dangerous death. Delay until you have a toxic blowpipe, 85+ Ranged, and ideally 70+ Prayer. Many Hardcores wait until they have a twisted bow. Practice on a main account first.\n* Theatre of Blood: Dangerous death. Extremely punishing mechanics. Most Hardcore Ironmen avoid this entirely or only attempt it very late in their account's life.\n* Inferno: Dangerous death. The hardest PvM challenge in the game. Only the most experienced Hardcores attempt this, and many still choose not to risk it.\n* Chambers of Xeric: Dangerous death. While the mechanics are more forgiving than Theatre of Blood, the risk of death in later rooms (particularly Olm) is significant.\n* All Wilderness content: PvP deaths are always possible and entirely outside your control. The dragon pickaxe from Wilderness bosses is not worth the risk for most Hardcores.\n* Zulrah: Dangerous death. The fight has a steep learning curve with multiple phase rotations. Delay until you have high stats and practice extensively on another account.\n* Vorkath: Dangerous death. The one-shot mechanic from the acid phase can kill inattentive players. Delay until comfortable with the mechanics.\n* Desert Treasure II bosses: All dangerous deaths with challenging mechanics.",
          subsections: [],
        },
        {
          title: "Defensive equipment priorities",
          level: 3,
          content: "Hardcore Ironmen should prioritize defensive equipment more than standard Ironmen:\n\n* Ring of life: This is the single most important item for a Hardcore Ironman. It automatically teleports you to your respawn point when your Hitpoints drop below 10% of your max. Always wear one when doing any remotely dangerous content. Note: the ring of life does not work in the Wilderness above level 30, does not work if the hit that would kill you takes you from above 10% to 0 in one hit, and does not work in certain instanced areas.\n* Phoenix necklace: Functions similarly to a ring of life but activates at 20% Hitpoints and heals instead of teleporting. Can be useful as an additional safety layer.\n* Keep emergency teleports in your inventory at all times. A royal seed pod (from Monkey Madness II) provides a one-click teleport to the Grand Tree. Ectophial is another good option.\n* Bring antipoison or anti-venom when fighting anything that poisons or envenoms. Dying to venom ticks while banking or walking is a real risk.\n* Always bring a stamina potion or energy restoration when doing long PvM trips to avoid being unable to run from danger.",
          subsections: [],
        },
        {
          title: "General safety habits",
          level: 3,
          content: "Develop these habits to protect your Hardcore status:\n\n* Always check the OSRS Wiki death mechanics section for any new content before attempting it.\n* Never attempt new or difficult PvM content when tired, distracted, or under the influence. Many Hardcore deaths happen late at night when the player's reaction time is impaired.\n* Keep your client updated and use recommended plugins (such as the RuneLite death indicator) that warn you about dangerous areas.\n* If you feel your heart rate rising during a boss fight, that is a sign you are attempting content beyond your comfort level. Consider teleporting out and coming back when better prepared.\n* Practice boss mechanics on a main account or alt before attempting them on your Hardcore. This includes learning attack rotations, prayer switches, and safe tiles.\n* Keep a bank tab with emergency supplies: teleport tablets, food, antipoisons, and restore potions. Restock this tab regularly.\n* Log out immediately if you notice server lag, stuttering, or world instability. Do not wait to see if it resolves.",
          subsections: [],
        },
      ],
    },
    {
      title: "Safe PvM Progression",
      level: 2,
      content: "PvM progression on a Hardcore Ironman should be approached methodically. Overgear every encounter, over-prepare supplies, and never attempt a boss for the first time without studying its mechanics thoroughly. The recommended progression below moves from lowest to highest risk.",
      subsections: [
        {
          title: "Barrows",
          level: 3,
          content: "Barrows is generally considered the safest mid-game boss content for Hardcore Ironmen. The brothers deal moderate damage and can be safespotted or prayer-flicked. The tunnels have low-level monsters that pose minimal threat.\n\nRecommended setup:\n\n* 43+ Prayer for protection prayers (strongly recommended).\n* Iban's blast or Slayer Dart for killing the melee brothers.\n* A ranged weapon for Ahrim.\n* A melee weapon for Karil.\n* Plenty of food (lobsters or better) and prayer potions.\n\nThe main risk is Dharok, who hits extremely hard at low Hitpoints. Always use Protect from Melee against him. Karil can also deal surprisingly high damage through prayer, so keep your Hitpoints topped up.\n\nComplete the hard Morytania Diary for 50% more runes from chests, making runs significantly more profitable.",
          subsections: [],
        },
        {
          title: "Giant Mole",
          level: 3,
          content: "Giant Mole is a straightforward boss with no complex mechanics. The main annoyance is the mole digging underground and relocating, requiring the player to chase it through the tunnels.\n\n* Complete the hard Falador Diary first. The Falador shield 3 shows the mole's location on the minimap, making kills dramatically faster.\n* The mole deals moderate damage but cannot one-shot a well-prepared player.\n* Bring a Dharok's set at low Hitpoints for fast kills, or use ranged/melee with a strength setup.\n* Always bring food and a teleport out. While the mole is not particularly dangerous, complacency kills Hardcores.\n\nGiant Mole drops mole claws and mole skins, which can be traded to Wyson the gardener for bird nests containing seeds.",
          subsections: [],
        },
        {
          title: "Dagannoth Kings",
          level: 3,
          content: "Dagannoth Kings are accessible to mid-game Hardcores, but require careful preparation. The most common approach is to safespot Dagannoth Rex for the berserker ring.\n\n* Bring a full inventory of food and prayer potions for your first attempts.\n* The journey to the Kings' lair can be dangerous. Dagannoth in the tunnels hit hard in multi-combat. Use protection prayers and bring a pet rock and a rune thrownaxe (or other method) to bypass the door puzzle.\n* Safespot Rex by standing behind the rocks in the south-east part of the lair. Only Rex will aggro if you do this correctly.\n* Be aware that Supreme and Prime can wander into your safespot area. If this happens, pray accordingly and wait for them to wander away.\n* Ring of life is essential here. If something goes wrong, it can save your life.\n\nThe berserker ring (i) is one of the best melee upgrades in the game and worth the moderate risk for most Hardcores.",
          subsections: [],
        },
        {
          title: "Approaching Jad",
          level: 3,
          content: "The TzHaar Fight Cave is a dangerous death, making it one of the most nerve-wracking challenges for a Hardcore Ironman. The fire cape is an extremely powerful melee upgrade, but many Hardcores delay it for a very long time or skip it entirely.\n\nDo not attempt Jad until you have:\n\n* 85+ Ranged (preferably 90+).\n* A toxic blowpipe with adamant or better darts.\n* 70+ Prayer with an adequate supply of prayer potions or super restores.\n* 70+ Defence with tank gear (blessed d'hide or Karil's).\n* Multiple successful Jad kills on another account.\n\nDuring the fight:\n\n* Use the Italy Rock safespot to manage healers.\n* Keep your Hitpoints above 60 at all times during the Jad fight.\n* If you panic or lose track of the prayer switches, immediately teleport out. You can always try again.\n* Wear a ring of life as a last resort, though relying on it is not a reliable strategy against Jad's high max hits.\n\nSome Hardcores choose to log out between waves to take breaks and stay focused. This is a completely valid strategy.",
          subsections: [],
        },
        {
          title: "God Wars Dungeon",
          level: 3,
          content: "God Wars Dungeon bosses are dangerous deaths and should be approached with extreme caution. The bosses themselves are mechanically simple but hit very hard, and the bodyguards in each room add significant danger.\n\n* General Graardor (Bandos): The most accessible GWD boss for Hardcores. Can be done with a melee setup and protection prayers. The main risk is Graardor's ranged attack, which can hit through Protect from Melee. Keep Hitpoints high at all times.\n* Commander Zilyana (Saradomin): Very fast and deals consistent damage. Requires a specific kiting method to avoid taking too many hits. Not recommended until very comfortable with the mechanics.\n* K'ril Tsutsaroth (Zamorak): Hits hard through prayer and has a special attack that drains Prayer points. The Zamorakian spear and Staff of the dead are valuable drops. Only attempt with high combat stats and plenty of supplies.\n* Kree'arra (Armadyl): Requires high Ranged and careful management of the minions. The Armadyl crossbow is a significant upgrade but the fight is consistently dangerous.\n\nFor all GWD bosses, bring maximum food and prayer potions. Many Hardcores choose to do short trips (3-5 kills) rather than extended stays to minimize risk. Always have a teleport available.",
          subsections: [],
        },
      ],
    },
    {
      title: "Skilling and Quests",
      level: 2,
      content: "Skilling and questing on a Hardcore Ironman follows the same general path as a standard Ironman, with extra caution applied to any activity that involves danger. The key principle is to always choose the safer option, even if it is slower or less efficient.",
      subsections: [
        {
          title: "Safe skilling methods",
          level: 3,
          content: "When choosing training methods, prefer those that carry zero risk of death:\n\n* Agility: Rooftop courses are generally safe, as falling from an obstacle does not deal lethal damage. However, the Wilderness Agility Course should be avoided entirely. The Hallowed Sepulchre is a safe death and an excellent training option at higher levels.\n* Mining: Motherlode Mine, Shooting Stars, and standard ore rocks are all completely safe. Volcanic Mine is a safe death but requires some learning.\n* Fishing: Barbarian Fishing, Tempoross, and standard fishing spots are all safe.\n* Runecraft: Avoid the Abyss (requires running through the Wilderness). Use fairy rings, the Arceuus library, or Guardians of the Rift (safe death) instead.\n* Thieving: Blackjacking in Pollnivneach is safe (the thugs cannot actually kill you as they stop attacking at low HP). Artefact stealing in Port Piscarilius is also completely safe.\n* Woodcutting: All standard Woodcutting methods are safe. The Woodcutting Guild provides good resources with zero risk.\n* Hunter: Birdhouse runs, standard trap hunting, and Herbiboar are all completely safe.",
          subsections: [],
        },
        {
          title: "Dangerous skilling to avoid",
          level: 3,
          content: "Some skilling methods carry unnecessary risk for Hardcore Ironmen:\n\n* Wilderness Agility Course: While offering good experience rates, the presence of PKers makes this unacceptably dangerous.\n* Abyss Runecrafting: Requires running through the Wilderness where PKers are common. The skulling mechanic also means you risk losing all equipment.\n* Lava dragons for Prayer: While profitable, the Wilderness location makes this extremely risky.\n* Dark crabs for Fishing: Located in the deep Wilderness. Not worth the risk.\n* Chaos Temple for Prayer: The 50% bone-saving effect is tempting but the Wilderness location is too dangerous.\n\nIn general, if a skilling method involves the Wilderness, avoid it. The small efficiency gain is never worth the risk of losing Hardcore status.",
          subsections: [],
        },
        {
          title: "Quest boss safety",
          level: 3,
          content: "Many quest bosses can be safespotted or otherwise trivialized. Key quest boss tips for Hardcores:\n\n* Tree Gnome Village: The Khazard warlord can be safespotted behind the fence.\n* Vampire Slayer: Count Draynor is easy with garlic and a stake, but bring extra food if low level.\n* Dragon Slayer I: Elvarg can be safespotted against the wall. Bring an anti-dragon shield and plenty of food.\n* Underground Pass: The entire quest is dangerous. Bring emergency teleports, protection prayers, and extra food. The Iban fight can be done safely from the walkway.\n* Monkey Madness I: The Jungle Demon can be safespotted. The real danger is the tunnel section before the fight. Use Protect from Melee and bring plenty of food.\n* Desert Treasure I: Each of the four bosses has different mechanics. Kamil is the most dangerous due to constant freezing and stat drain. Bring super restore potions and a fire spell.\n* Dream Mentor: The Inadequacy hits hard. Bring the best food and potions available.\n* Song of the Elves: The Fragment of Seren fight has mechanics that must be learned. Practice the prayer switches and bring a full inventory of high-healing food.\n* A Night at the Theatre: This quest introduces Theatre of Blood mechanics, and the quest version is a safe death. Use this as a learning opportunity.",
          subsections: [],
        },
      ],
    },
    {
      title: "Status Preservation Tips",
      level: 2,
      content: "Keeping your Hardcore status alive requires constant vigilance and a set of habits that go beyond normal gameplay. The following tips represent the accumulated wisdom of the Hardcore Ironman community.",
      subsections: [
        {
          title: "Essential equipment and supplies",
          level: 3,
          content: "Always carry or have quick access to the following:\n\n* Ring of life: Wear this whenever doing any content with a risk of death. The only time to remove it is when the ring slot is absolutely critical for DPS (such as a berserker ring at a boss you are very comfortable with). Even then, consider keeping the ring of life on.\n* Emergency teleports: Keep a one-click teleport in your inventory at all times. The royal seed pod (from Monkey Madness II) is the best option as it works up to level 30 Wilderness and requires no runes. Ectophial, house teleport tablets, and teleport to house spell are also good options.\n* Antipoison and anti-venom: Carry these whenever fighting monsters that poison or envenom. Dying to poison ticks after leaving a fight is a real and common cause of Hardcore deaths.\n* Antidote++ is recommended for extended trips, as it provides longer-lasting poison immunity than standard antipoison.\n* Food: Always carry at least a few pieces of food, even when doing activities you consider safe. Unexpected damage can come from random aggressive monsters or environmental hazards.\n* Prayer potions or super restores: Essential for maintaining protection prayers during dangerous combat.",
          subsections: [],
        },
        {
          title: "Behavioural habits",
          level: 3,
          content: "Adopt these practices to minimize risk:\n\n* Never play while tired or distracted. More Hardcore Ironmen die to lapses in attention than to genuinely difficult content. If you catch yourself yawning during a boss fight, teleport out and go to sleep.\n* Learn boss mechanics on a main account first. Never attempt a new boss blind on your Hardcore. Watch video guides, read the wiki, and get multiple kills on another account before trying it.\n* Avoid PvP worlds entirely. There is no reason for a Hardcore Ironman to be on a PvP world, and accidentally logging into one can be fatal.\n* Do not attempt risky content during known server issues. Check social media and community forums for reports of server instability or DDoS attacks before starting a boss trip.\n* Set personal risk thresholds and stick to them. Decide in advance what content you are willing to attempt and at what stats. Do not let peer pressure or impatience push you into attempting content you are not ready for.\n* Take breaks during extended PvM sessions. Fatigue degrades reaction time and decision-making.\n* Use the logout button liberally. If anything feels wrong, such as unexpected damage, lag, or unfamiliar mechanics, log out immediately. You can always log back in and reassess.",
          subsections: [],
        },
        {
          title: "World and connection safety",
          level: 3,
          content: "Your internet connection and world choice can be the difference between keeping and losing Hardcore status:\n\n* Use a wired connection rather than Wi-Fi when doing dangerous content. Wi-Fi is more susceptible to brief disconnections that can be fatal.\n* Choose worlds with low ping and stable connections. The world switcher shows your ping to each world.\n* Avoid high-population worlds for bossing, as they are more likely to experience lag or instability.\n* If you experience any lag spike during combat, teleport out immediately. Do not wait to see if it was a one-time occurrence.\n* Consider using the official OSRS server status page to check for known issues before logging in for a PvM session.\n* Keep your operating system and client updated to minimize client-side crashes.\n* Close unnecessary background applications that could cause your game to freeze or stutter.",
          subsections: [],
        },
        {
          title: "Common causes of death",
          level: 3,
          content: "Being aware of how other Hardcore Ironmen have died can help you avoid the same fate. The most common causes of Hardcore death include:\n\n* Disconnection during combat: The number one killer of Hardcores. Mitigate with a stable connection and ring of life.\n* Jad prayer switches: Many Hardcores die during their first Jad attempt. Practice extensively on another account.\n* Poison and venom ticks: Dying to residual poison after leaving a dangerous area. Always cure poison before teleporting.\n* Wilderness PKers: Any time spent in the Wilderness is a risk. Avoid it.\n* Overconfidence at familiar bosses: Complacency after hundreds of successful kills leads to sloppy play. Stay focused.\n* New content with unknown death mechanics: Always check whether deaths are safe or dangerous before attempting new content.\n* Multi-combat piling: Being attacked by multiple monsters simultaneously in multi-combat zones. Be aware of your surroundings.\n* Falling asleep or going AFK: This sounds obvious, but many Hardcores have died because they fell asleep at the keyboard or walked away from the computer in a dangerous area.\n\nLearn from these examples and develop habits that protect against each one. The goal is to make your Hardcore Ironman account as resilient as possible against both game mechanics and human error.",
          subsections: [],
        },
      ],
    },
  ],
};

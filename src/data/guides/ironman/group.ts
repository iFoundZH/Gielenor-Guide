import type { IronmanGuide } from "@/types/guides";

export const groupIronmanGuide: IronmanGuide = {
  variant: "group" as IronmanGuide["variant"],
  wikiUrl: "https://oldschool.runescape.wiki/w/Group_Ironman/Strategies",
  sections: [
    {
      title: "Group Ironman Overview",
      level: 2,
      content: "Group Ironman (GIM) is an Ironman mode where teams of 2 to 5 players share a group storage chest and can trade freely between each other. Like standard Ironmen, GIM accounts cannot use the Grand Exchange (except to buy bonds) and cannot trade with players outside the group.\n\nGroup Ironman teams are formed during Tutorial Island. The group leader creates the group and other players join before leaving the island. Once formed, the group is permanent, though members can leave or be kicked (with consequences to group prestige).\n\nGroups can optionally be Hardcore Group Ironman (HCGIM). In HCGIM mode, the group shares a limited pool of lives. When a member dies a dangerous death, one life is consumed. When all lives are depleted, the entire group loses Hardcore status and becomes a regular GIM team. HCGIM groups start with the same number of lives as group members. Additional lives can be earned by completing the Theatre of Blood.\n\nKey GIM features:\n\n* Shared group storage chest accessible at banks.\n* Free trading between group members for any tradeable item.\n* Group prestige rating that tracks whether the team has remained intact since creation.\n* Separate GIM hiscores that rank groups by total level and other metrics.\n* Group members can assist each other in combat, unlike regular Ironmen.\n* GIM accounts can pick up drops from other group members' kills.\n* The Ironman chat-channel connects you with other Ironmen for advice.",
      subsections: [
      ],
    },
    {
      title: "Team Composition & Roles",
      level: 2,
      content: "One of the biggest advantages of Group Ironman is the ability to divide labour across team members. Rather than every player grinding every skill and every boss, teams can specialize so that each member focuses on what they enjoy or what the team needs most. Effective role division dramatically accelerates group progression compared to solo Ironman play.",
      subsections: [
        {
          title: "Skill specialization",
          level: 3,
          content: "Certain skills produce items that benefit the entire team but require significant time investment to level. Assigning these to specific members avoids redundant grinding.\n\n* Herblore: One member focuses on gathering herbs and secondary ingredients to make potions for the whole group. This is one of the most impactful specializations because potions are consumed constantly.\n* Crafting: A dedicated crafter can produce jewellery, dragonhide armour, and glass items for the group. Reaching 89 Crafting for a fury amulet benefits the whole team once it can be passed around.\n* Smithing: One player handles Blast Furnace runs to produce bars and smith dart tips, cannonballs, and platebodies for alching.\n* Construction: A single player building a maxed player-owned house with ornate pool, fairy ring, spirit tree, and jewellery box saves the rest of the team from training Construction at all. Other members can use the house via the \"house party\" system.\n* Farming: While herb runs benefit from multiple members doing them, tree runs and high-level farming can be concentrated to one player.\n\nNot every skill needs to be specialized. Combat skills, Slayer, Prayer, Agility, and similar personal-progression skills should be trained by every member independently.",
          subsections: [
          ],
        },
        {
          title: "Combat roles",
          level: 3,
          content: "Dividing combat roles helps the team gear up faster and tackle group PvM content more effectively.\n\n* Main tank / melee specialist: Prioritizes melee gear upgrades (Bandos, Abyssal whip, Dragon warhammer). Takes aggro in group bossing.\n* Ranged DPS: Focuses on ranging gear (Armadyl, Toxic blowpipe, Twisted bow). Often assigned Zulrah and Vorkath for unique drops.\n* Mage / support: Prioritizes magic gear and acts as the group's spellcaster for freezes, vengeance support, and thralls in raids.\n\nIn practice, all members will train all combat styles to some degree. The roles primarily determine who gets priority on gear drops rather than who trains what.",
          subsections: [
          ],
        },
        {
          title: "Gatherer vs artisan",
          level: 3,
          content: "A simple two-role framework that works well for smaller groups:\n\n* Gatherers focus on Mining, Woodcutting, Fishing, Farming, and Hunter to supply raw materials.\n* Artisans focus on Smithing, Crafting, Fletching, Herblore, Cooking, and Construction to process those materials into useful items.\n\nThis avoids the common GIM pitfall where everyone mines their own ore and smelts their own bars independently, which is no more efficient than solo Ironman play. The goal is to leverage the group so that each hour played by any member benefits the whole team.",
          subsections: [
          ],
        },
        {
          title: "Boss grind responsibilities",
          level: 3,
          content: "Assign specific boss grinds to members based on their combat specialization and the drops the team needs:\n\n* Assign one player to grind Zulrah for the Toxic blowpipe and Trident of the swamp, then pass them to the team.\n* Have the melee specialist farm Cerberus for Primordial crystals, since they will already have high Slayer.\n* Split God Wars Dungeon assignments: one member focuses Bandos, another Sara/Arma. Tanking roles can be divided based on defensive stats.\n* For bosses with multiple useful uniques (like Dagannoth Kings), have the whole group go together since GIM members can assist in combat.\n* Wilderness bosses are risky, so assign them to the member most comfortable with the PvP threat.\n\nThe key principle is that once a member gets a unique drop, it can be traded to whoever on the team benefits most from it.",
          subsections: [
          ],
        },
      ],
    },
    {
      title: "Shared Storage & Trading",
      level: 2,
      content: "The group storage chest is the centrepiece of GIM logistics. Understanding its mechanics and using it effectively is critical to efficient group play.",
      subsections: [
        {
          title: "Group storage chest",
          level: 3,
          content: "The group storage chest is accessible at any bank and functions as a shared bank space that all group members can deposit into and withdraw from.\n\n* The chest starts with 80 slots and can be expanded by completing content milestones as a group.\n* Items stored in group storage are visible to all members and can be withdrawn by anyone.\n* The chest cannot hold untradeable items.\n* Stackable items (runes, arrows, coins) still occupy one slot per type regardless of quantity.\n\nBecause space is limited, teams should establish rules about what goes in the chest. Common conventions include:\n\n* Potions and food for group bossing.\n* High-value gear that rotates between members (such as a Bandos chestplate being shared until a second one is obtained).\n* Raw materials that an artisan specialist needs to process.\n* Quest items that multiple members need in sequence.\n\nAvoid cluttering group storage with junk. Each member has their own personal bank for items that are only relevant to them.",
          subsections: [
          ],
        },
        {
          title: "Trading between members",
          level: 3,
          content: "GIM members can trade any tradeable item directly with each other, just like regular accounts trade. This is often faster than using group storage for quick transfers.\n\n* Trading is only available when both members are online and in the same location.\n* You can trade noted items and stackable items normally.\n* There are no trade limits or cooldowns between group members.\n* Items received from other group members do not affect your collection log.\n\nTrading is the primary mechanism for passing gear upgrades, supplies, and quest items between members. Coordinate trades at a common meeting point such as a bank or the group's player-owned house.",
          subsections: [
          ],
        },
        {
          title: "Grand Exchange restrictions",
          level: 3,
          content: "GIM accounts cannot buy or sell items on the Grand Exchange, with the exception of bonds. This means every item the group uses must be obtained through skilling, combat drops, shops, or minigames.\n\nThis restriction is what makes skill specialization so valuable. On a regular Ironman, every player must be self-sufficient. On a GIM team, only the group as a whole needs to be self-sufficient. If one member can make potions and another can smith dart tips, neither needs to train the other's skill.",
          subsections: [
          ],
        },
      ],
    },
    {
      title: "Early Game Strategy",
      level: 2,
      content: "The early game for a GIM team is significantly faster than solo Ironman because members can coordinate quests, share supplies, and avoid duplicating effort. The goal is to get the whole team through early milestones as quickly as possible.",
      subsections: [
        {
          title: "Coordinated questing",
          level: 3,
          content: "Not every member needs to complete every quest immediately. Prioritize quests based on what they unlock and who benefits most:\n\n* Have one member rush Fairy Tale I and start Fairy Tale II for fairy ring access. Other members can use the fairy ring in the group house.\n* One member should prioritize Animal Magnetism for Ava's devices, then supply the group with them.\n* Assign Waterfall Quest and The Feud to the melee specialist first so they can begin training with an adamant scimitar and share one later.\n* The member focusing Herblore should complete Druidic Ritual, Jungle Potion, and Recruitment Drive early.\n* Assign Recipe for Disaster subquests across multiple members so that each person only completes a portion, then the whole team converges to finish the final boss fight once all subquests are done.\n\nQuests that provide one-time rewards (like experience lamps) should be completed by the member who benefits most from skipping slow early training in that skill.",
          subsections: [
            {
              title: "Barrows Gloves as a team",
              level: 4,
              content: "Recipe for Disaster is a critical milestone for every Ironman. As a GIM team, the path to Barrows Gloves can be accelerated:\n\n* Split the subquest requirements across members. For example, one member trains Cooking while another handles the Fishing requirements.\n* Share food, potions, and gear for the boss fights. A member who has already completed a subquest can supply the next member with the exact items needed.\n* The desert subquest (Freeing Pirate Pete) requires 53 Cooking and 53 Fishing. Have the member who specializes in those skills help gather the supplies.\n* Pool quest reward experience lamps to push specific members past skill thresholds needed for subquests.\n\nThe goal is for the entire team to have Barrows Gloves as early as possible, since they are best-in-slot for all combat styles at that stage of the game.",
              subsections: [
              ],
            },
          ],
        },
        {
          title: "Splitting early skilling activities",
          level: 3,
          content: "The three big early-game skilling activities (Wintertodt, Tempoross, and Guardians of the Rift) should be divided among members rather than having everyone grind all three.\n\n* Wintertodt: Assign one member to grind this early for Firemaking levels and supply crates. The crates provide seeds, ores, gems, herbs, and logs that can be distributed to the team. Having low hitpoints makes Wintertodt easier, so the assigned member should go before doing combat training.\n* Tempoross: Assign a second member to Tempoross for Fishing experience and supply rewards (raw fish, planks, uncut gems, unenchanted jewellery). These rewards benefit the whole group.\n* Guardians of the Rift: A third member can focus on Runecraft here for rune supplies and the Raiments of the Eye outfit. Runes are always in demand for the whole team.\n\nBy splitting these activities, the group gets all the benefits in roughly one-third of the total time compared to every member doing all three.",
          subsections: [
          ],
        },
        {
          title: "Early supply sharing",
          level: 3,
          content: "In the earliest hours of a GIM team, sharing basic supplies makes a big difference:\n\n* The first member to access a cake stall should steal enough cakes for the whole team's early questing food.\n* Share teleport jewellery (games necklaces, rings of dueling) so members without Magic levels can still get around.\n* Pool coins from early moneymaking methods so one member can buy runes, feathers, or other shop supplies in bulk.\n* The first member to obtain a rune axe or rune pickaxe can pass their old steel/mithril tools to others who are still on bronze.\n* Share grimy herbs with the designated Herblore specialist rather than cleaning and making potions individually.\n\nEstablish a group storage convention early. For example, herbs go in the chest; food and teleport items are traded directly.",
          subsections: [
          ],
        },
      ],
    },
    {
      title: "Mid Game Coordination",
      level: 2,
      content: "Once the team has completed early quests, built up basic gear, and started training Slayer, the mid-game focus shifts to coordinated bossing and efficient resource sharing. This is where the GIM advantage over solo Ironman becomes most pronounced.",
      subsections: [
        {
          title: "Group bossing advantages",
          level: 3,
          content: "GIM teams can fight bosses together, which is a massive advantage over solo Ironman play:\n\n* Group members can damage the same monster, meaning bosses die faster and supplies are used more efficiently per kill.\n* Tank-and-DPS strategies work well. One member in defensive gear takes aggro while others deal damage safely.\n* Bosses that are difficult or dangerous to solo (like Commander Zilyana or General Graardor) become much more accessible as a duo or trio.\n* All GIM members in the fight are eligible for the drop, which goes to whoever dealt the most damage. The recipient can then trade the item to the member who needs it most.\n\nGroup bossing also lets less experienced members learn boss mechanics in a safer environment, since they have teammates to carry them through early attempts.",
          subsections: [
          ],
        },
        {
          title: "Efficient drop distribution",
          level: 3,
          content: "When a valuable drop is received, decide who gets it based on team need rather than individual desire:\n\n* The first Abyssal whip should go to the melee specialist or the member doing the most Slayer.\n* The first Trident of the seas goes to the mage specialist.\n* Barrows equipment should be distributed based on who is doing what content. Guthan's set goes to whoever is doing the most AFK melee training. Karil's goes to whoever needs the ranged upgrade most.\n* Zenyte shards from Demonic gorillas should be crafted into the most impactful jewellery first: a Tormented bracelet for the mage or an Anguish for the ranger, depending on team priorities.\n* Dragon warhammer should go to whoever is doing the most bossing, as it is used for special attack specs across all combat styles.\n\nKeep a running list of who needs what so that drops are allocated efficiently rather than hoarded by individuals.",
          subsections: [
          ],
        },
        {
          title: "Coordinated diary completion",
          level: 3,
          content: "Achievement diaries provide powerful rewards, but not every member needs to complete every diary. Prioritize based on what rewards the team needs:\n\n* Morytania hard diary (50% more Barrows runes) should be completed by whoever is farming Barrows.\n* Kandarin hard diary (10% more marks of grace on Seers' course) benefits the member training Agility the most.\n* Falador hard diary (Mole locator) should be done by whoever is assigned to farm Giant Mole for bird nests.\n* Varrock medium/hard diary (battlestaff purchases) should be done by at least one member for consistent daily profit.\n* Western Provinces elite diary (unlimited Zulrah teleports) is essential for whoever is grinding Zulrah.\n\nSome diary rewards benefit the whole team indirectly. For example, the member with the Varrock diary can buy and alch daily battlestaves, then share the gold or buy supplies for the group.",
          subsections: [
          ],
        },
      ],
    },
    {
      title: "Raids & Late Game",
      level: 2,
      content: "GIM teams have a natural advantage in raids because they have a built-in team with established roles and communication. Raids are among the most rewarding content in the game, and GIM groups can tackle them more efficiently than solo Ironmen who must find pickup groups.",
      subsections: [
        {
          title: "Chambers of Xeric",
          level: 3,
          content: "Chambers of Xeric (CoX) scales to group size, and a coordinated GIM team can complete it efficiently:\n\n* Assign roles before entering: who scouts, who preps potions, who tanks Olm's melee hand.\n* A team of 3 or more GIM members can perform the standard \"4:1\" Olm method more easily than a solo player.\n* Share overload and prayer enhance potions within the raid. The Herblore specialist should be responsible for prepping supplies during the raid.\n* Uniques like the Dragon hunter crossbow, Dragon claws, and Ancestral robes should be distributed based on team need (see below).\n\nCoX is the most accessible raid for mid-level teams. Groups can start with entry-mode to learn mechanics before pushing for regular completions.",
          subsections: [
            {
              title: "CoX unique distribution",
              level: 4,
              content: "When a unique drop hits the team, distribute based on long-term value:\n\n* Twisted bow goes to the ranged specialist first. This is the single biggest upgrade in the game and should be used by whoever is doing the most bossing.\n* Dragon hunter crossbow goes to whoever is farming Vorkath or dragons. If no one is, hold it in group storage.\n* Ancestral robes go to the mage specialist.\n* Dragon claws go to whoever is doing PvM content where the special attack is most useful (Chambers of Xeric itself, Theatre of Blood).\n* Dexterous prayer scroll and Arcane prayer scroll should be used by whichever member benefits most from Rigour or Augury immediately.\n\nOnce the first recipient has moved on to better gear or the team has obtained duplicates, items rotate to the next member who needs them.",
              subsections: [
              ],
            },
          ],
        },
        {
          title: "Theatre of Blood",
          level: 3,
          content: "Theatre of Blood (ToB) is significantly easier as a team than solo and is well-suited to GIM groups:\n\n* A standard team of 4-5 GIM members matches the intended group size for ToB.\n* Assign roles for each room: who is the mage at Nylocas, who is the tank at Verzik, who handles Maiden's blood spawns.\n* ToB requires higher gear levels than CoX. The team should be equipped with at least Barrows-tier gear, Whip/Trident, and Toxic blowpipe before attempting.\n* The Scythe of Vitur should go to whoever does the most melee PvM, as it is the best melee weapon in the game but expensive to charge.\n* Justiciar armour pieces go to the designated tank.\n* Avernic defender hilt goes to the melee specialist.\n\nToB has a steep learning curve. Use story mode to learn mechanics before attempting regular completions. Having a consistent GIM team that learns together is far more effective than joining random groups.",
          subsections: [
          ],
        },
        {
          title: "Tombs of Amascut",
          level: 3,
          content: "Tombs of Amascut (ToA) is the most flexible raid and arguably the best starting point for GIM groups new to raiding:\n\n* Invocation levels can be adjusted freely, allowing the team to start at 0 invocations and gradually increase difficulty.\n* Supplies are provided within the raid at lower invocation levels, reducing the need for outside preparation.\n* Team sizes of 1-8 are supported, so the whole GIM group can participate regardless of size.\n* Fang of Osmumten (melee weapon) should go to whoever is doing the most bossing. It is effective nearly everywhere.\n* Lightbearer ring is universally useful and should go to whoever is doing the most special-attack-heavy content.\n* Masori armour goes to the ranged specialist.\n* Tumeken's shadow goes to the mage specialist and is transformative for magic-based PvM.\n\nToA is the most rewarding raid at higher invocation levels (300+), but the team should master lower levels first. The modular difficulty system makes it excellent for gradual progression.",
          subsections: [
          ],
        },
        {
          title: "Gear rotation strategy",
          level: 3,
          content: "In the late game, GIM teams should implement a gear rotation strategy rather than having one member hoard all the best items:\n\n* Track who is actively using which piece of gear. If the Twisted bow holder is not currently doing ranged PvM, pass it to someone who is.\n* Maintain a shared spreadsheet or list of who has what major item.\n* When a duplicate unique is obtained, the original holder keeps one and the duplicate goes to the next member in the rotation.\n* Set target completions for each member. For example, one member uses the Twisted bow for 500 Zulrah kills, then passes it to the next member.\n* Items that are universally useful (Dragon warhammer, Bandos godsword) should be stored in group storage when not actively in use, so any member can grab them for a bossing trip.\n\nThe end goal is for every member to eventually have their own set of end-game gear, but in the interim, sharing one copy efficiently across the team accelerates overall progression.",
          subsections: [
          ],
        },
      ],
    },
    {
      title: "Group Management",
      level: 2,
      content: "The social and organizational aspects of running a GIM team are just as important as the in-game strategy. Many GIM teams fall apart not because of the game's difficulty but because of coordination failures, inactive members, or misaligned goals.",
      subsections: [
        {
          title: "Handling inactive members",
          level: 3,
          content: "Player inactivity is the most common reason GIM teams struggle. When a member stops playing:\n\n* Redistribute their assigned roles and responsibilities to active members.\n* Retrieve any shared gear they are holding via trade if they log in, or wait for them to return.\n* If a member is permanently inactive, the group leader can kick them from the group. However, this has consequences for group prestige.\n* Consider recruiting a replacement member. New members can join an existing GIM group, but the group loses its prestige rating.\n* Plan for potential inactivity from the start by avoiding over-reliance on a single member for critical supplies.\n\nThe best defence against inactivity is choosing teammates you know well and who have compatible play schedules and commitment levels.",
          subsections: [
          ],
        },
        {
          title: "Leaving and joining groups",
          level: 3,
          content: "GIM group membership changes are possible but come with significant penalties:\n\n* Leaving a group: A member who leaves a GIM group becomes a regular Ironman (not a standard account). They keep all their items and stats but lose access to group storage and can no longer trade with former teammates.\n* Joining an existing group: New members can be invited to fill empty slots. However, adding a new member causes the group to lose its prestige status permanently.\n* Prestige: A GIM group has prestige if all original members remain. Prestige is displayed on the hiscores and is a mark of team integrity. Once lost, prestige cannot be regained.\n* Hardcore status: If a HCGIM member leaves, the group does not gain back the life slot. The remaining lives stay the same.\n* Cooldowns: There is a 7-day cooldown after a member leaves before a new member can be invited.\n\nBecause of the prestige system, teams should think carefully before making roster changes. Losing prestige is permanent and some players consider it a meaningful loss.",
          subsections: [
          ],
        },
        {
          title: "Communication and planning",
          level: 3,
          content: "Effective communication is critical for GIM teams:\n\n* Use Discord or a similar voice/text platform for coordinating outside the game. In-game chat is insufficient for planning.\n* Maintain a shared document (spreadsheet, shared note, or Discord channel) tracking each member's current goals, gear, and assigned responsibilities.\n* Schedule regular group bossing sessions so that all members can participate in raids and boss trips.\n* Use the in-game group chat for quick coordination during play sessions.\n* Set short-term and long-term goals as a team. For example: \"This week we all get Barrows Gloves\" or \"This month we start learning CoX.\"\n\nClear communication prevents the most common GIM frustrations: duplicated effort, gear disputes, and feeling like the team is not progressing.",
          subsections: [
          ],
        },
        {
          title: "Different play schedules",
          level: 3,
          content: "GIM teams rarely have all members online at the same time, especially if members are in different time zones or have different real-life commitments. Strategies to handle this:\n\n* Assign solo-friendly tasks to members who play at off-hours. Skilling, Slayer, and solo bossing can all be done independently.\n* Reserve group content (raids, group bossing, gear distribution) for times when most members are online.\n* Use group storage as an asynchronous trading mechanism. A gatherer can deposit materials during their session, and the artisan can process them during theirs.\n* Avoid gating team progress on any single member's availability. If the Herblore specialist is unavailable, others should be able to progress independently.\n* Keep a log of what was deposited into group storage and by whom, so members who play at different times stay informed.\n\nThe group storage chest and the ability to trade items make GIM uniquely suited to asynchronous play. Take advantage of this rather than insisting everyone plays at the same time.",
          subsections: [
          ],
        },
        {
          title: "Setting group goals",
          level: 3,
          content: "Teams that set and track goals together tend to stay motivated longer:\n\n* Break progression into phases: early game (questing, base 50 stats), mid game (Slayer, Barrows, diaries), late game (raids, boss logs).\n* Set both individual milestones (\"Everyone gets a Fire Cape\") and team milestones (\"First CoX completion\").\n* Celebrate group achievements. Getting the team's first Twisted bow or completing a boss collection log together keeps morale high.\n* Be flexible. If a member discovers they enjoy a different aspect of the game, adjust roles and goals accordingly.\n* Revisit goals periodically. What seemed important early on may be less relevant as the team progresses.\n\nThe most successful GIM teams are those where members genuinely enjoy playing together and view the group's success as their own. The shared journey is the point.",
          subsections: [
          ],
        },
      ],
    },
  ],
};

/**
 * Maps wiki location strings (from quest/boss infoboxes) to our region IDs.
 *
 * The OSRS Wiki uses specific location names ("Lumbridge Castle", "God Wars Dungeon")
 * that must map to our 14 canonical region IDs defined in osrs-regions.ts.
 */

const LOCATION_KEYWORDS: [string, string][] = [
  // Misthalin
  ["lumbridge", "misthalin"],
  ["varrock", "misthalin"],
  ["draynor", "misthalin"],
  ["edgeville", "misthalin"],
  ["barbarian village", "misthalin"],
  ["champions' guild", "misthalin"],
  ["cooks' guild", "misthalin"],
  ["digsite", "misthalin"],
  ["dig site", "misthalin"],
  ["grand exchange", "misthalin"],
  ["abyss", "misthalin"],
  ["abyssal nexus", "misthalin"],
  ["misthalin", "misthalin"],

  // Karamja
  ["karamja", "karamja"],
  ["brimhaven", "karamja"],
  ["tai bwo wannai", "karamja"],
  ["shilo village", "karamja"],
  ["tzhaar", "karamja"],
  ["musa point", "karamja"],
  ["crandor", "karamja"],
  ["fight cave", "karamja"],
  ["inferno", "karamja"],
  ["tzkal", "karamja"],
  ["tztok", "karamja"],

  // Asgarnia
  ["falador", "asgarnia"],
  ["port sarim", "asgarnia"],
  ["rimmington", "asgarnia"],
  ["taverley", "asgarnia"],
  ["burthorpe", "asgarnia"],
  ["dwarven mine", "asgarnia"],
  ["ice mountain", "asgarnia"],
  ["white wolf mountain", "asgarnia"],
  ["god wars dungeon", "asgarnia"],
  ["warriors' guild", "asgarnia"],
  ["death plateau", "asgarnia"],
  ["troll stronghold", "asgarnia"],
  ["asgarnia", "asgarnia"],
  ["mudskipper point", "asgarnia"],
  ["thurgo", "asgarnia"],
  ["black knights", "asgarnia"],
  ["monastery", "asgarnia"],
  ["cerberus' lair", "asgarnia"],
  ["key master", "asgarnia"],

  // Kandarin
  ["ardougne", "kandarin"],
  ["camelot", "kandarin"],
  ["catherby", "kandarin"],
  ["seers' village", "kandarin"],
  ["seers village", "kandarin"],
  ["yanille", "kandarin"],
  ["ranging guild", "kandarin"],
  ["tree gnome stronghold", "kandarin"],
  ["tree gnome village", "kandarin"],
  ["otto's grotto", "kandarin"],
  ["fishing guild", "kandarin"],
  ["legends' guild", "kandarin"],
  ["kandarin", "kandarin"],
  ["witchaven", "kandarin"],
  ["port khazard", "kandarin"],
  ["fight arena", "kandarin"],
  ["watchtower", "kandarin"],
  ["observatory", "kandarin"],
  ["underground pass", "kandarin"],
  ["khazard", "kandarin"],
  ["smoke devil", "kandarin"],
  ["thermonuclear", "kandarin"],

  // Fremennik
  ["rellekka", "fremennik"],
  ["neitiznot", "fremennik"],
  ["jatizso", "fremennik"],
  ["waterbirth", "fremennik"],
  ["lunar isle", "fremennik"],
  ["fremennik", "fremennik"],
  ["trollweiss", "fremennik"],
  ["weiss", "fremennik"],
  ["keldagrim", "fremennik"],
  ["miscellania", "fremennik"],
  ["ungael", "fremennik"],
  ["vorkath", "fremennik"],
  ["ghorrock", "fremennik"],
  ["dagannoth", "fremennik"],
  ["jormungand", "fremennik"],

  // Morytania
  ["canifis", "morytania"],
  ["port phasmatys", "morytania"],
  ["phasmatys", "morytania"],
  ["barrows", "morytania"],
  ["slayer tower", "morytania"],
  ["darkmeyer", "morytania"],
  ["ver sinhaza", "morytania"],
  ["morytania", "morytania"],
  ["theatre of blood", "morytania"],
  ["haunted mine", "morytania"],
  ["burgh de rott", "morytania"],
  ["slepe", "morytania"],
  ["meiyerditch", "morytania"],
  ["mort myre", "morytania"],
  ["mort'ton", "morytania"],
  ["nightmare zone", "morytania"],
  ["nightmare", "morytania"],
  ["phosani", "morytania"],
  ["grotesque guardians", "morytania"],
  ["sisterhood sanctuary", "morytania"],
  ["sisterhood", "morytania"],

  // Desert
  ["al kharid", "desert"],
  ["pollnivneach", "desert"],
  ["sophanem", "desert"],
  ["nardah", "desert"],
  ["kalphite", "desert"],
  ["desert", "desert"],
  ["kharidian", "desert"],
  ["bedabin", "desert"],
  ["shantay pass", "desert"],
  ["bandit camp", "desert"],
  ["menaphos", "desert"],
  ["jaldraocht", "desert"],
  ["agility pyramid", "desert"],
  ["ruins of ullek", "desert"],
  ["tombs of amascut", "desert"],
  ["uzer", "desert"],
  ["dominion tower", "desert"],
  ["lassar", "desert"],
  ["stranglewood", "desert"],
  ["ancient vault", "desert"],
  ["whisperer", "desert"],
  ["vardorvis", "desert"],

  // Tirannwn
  ["prifddinas", "tirannwn"],
  ["lletya", "tirannwn"],
  ["iorwerth", "tirannwn"],
  ["isafdar", "tirannwn"],
  ["tirannwn", "tirannwn"],
  ["elven", "tirannwn"],
  ["arandar", "tirannwn"],
  ["gauntlet", "tirannwn"],
  ["zalcano", "tirannwn"],
  ["zul-andra", "tirannwn"],
  ["zulrah", "tirannwn"],
  ["kraken cove", "tirannwn"],

  // Wilderness
  ["wilderness", "wilderness"],
  ["revenant cave", "wilderness"],
  ["revenant", "wilderness"],
  ["mage arena", "wilderness"],
  ["chaos temple", "wilderness"],
  ["ferox enclave", "wilderness"],
  ["deep wilderness", "wilderness"],
  ["lava maze", "wilderness"],
  ["corporeal beast", "wilderness"],
  ["resource area", "wilderness"],
  ["rogues' castle", "wilderness"],
  ["chaos altar", "wilderness"],
  ["scorpion pit", "wilderness"],
  ["callisto", "wilderness"],
  ["venenatis", "wilderness"],
  ["vet'ion", "wilderness"],
  ["king black dragon", "wilderness"],
  ["chaos fanatic", "wilderness"],
  ["scorpia", "wilderness"],
  ["crazy archaeologist", "wilderness"],
  ["chaos elemental", "wilderness"],

  // Kebos
  ["farming guild", "kebos"],
  ["mount karuulm", "kebos"],
  ["karuulm", "kebos"],
  ["kebos", "kebos"],
  ["battlefront", "kebos"],
  ["hydra", "kebos"],
  ["konar", "kebos"],
  ["molch", "kebos"],

  // Kourend
  ["arceuus", "kourend"],
  ["hosidius", "kourend"],
  ["lovakengj", "kourend"],
  ["piscarilius", "kourend"],
  ["shayzien", "kourend"],
  ["kourend", "kourend"],
  ["zeah", "kourend"],
  ["chambers of xeric", "kourend"],
  ["wintertodt", "kourend"],
  ["catacombs of kourend", "kourend"],
  ["catacomb", "kourend"],
  ["fortis colosseum", "varlamore"],
  ["great kourend", "kourend"],
  ["mount quidamortem", "kourend"],
  ["beneath kourend", "kourend"],
  ["forthos", "kourend"],
  ["sarachnis", "kourend"],
  ["duke sucellus", "kourend"],

  // Fossil Island
  ["fossil island", "fossil-island"],
  ["volcanic mine", "fossil-island"],
  ["mushroom forest", "fossil-island"],

  // Varlamore
  ["varlamore", "varlamore"],
  ["civitas illa fortis", "varlamore"],
  ["cam torum", "varlamore"],
  ["hunter guild", "varlamore"],
  ["colosseum", "varlamore"],
  ["tapoyauik", "varlamore"],
  ["ruins of tapoyauik", "varlamore"],
  ["the scar", "varlamore"],
  ["ralos' rise", "varlamore"],
  ["hueycoatl", "varlamore"],
  ["mokhaiotl", "varlamore"],
  ["shellbane", "varlamore"],

  // Zanaris / Other
  ["zanaris", "zanaris"],
  ["entrana", "zanaris"],
  ["ape atoll", "zanaris"],
  ["fairy ring", "zanaris"],
  ["cosmic altar", "zanaris"],
];

/**
 * Map a wiki location string to one of our region IDs.
 * Performs case-insensitive keyword matching.
 * Returns "misthalin" as fallback for unmatched locations.
 */
export function mapLocationToRegion(locationText: string): string {
  const lower = locationText.toLowerCase();

  for (const [keyword, regionId] of LOCATION_KEYWORDS) {
    if (lower.includes(keyword)) return regionId;
  }

  return "misthalin";
}

import { demonicPactsLeague } from "./demonic-pacts";
import { ragingEchoesLeague } from "./raging-echoes";
import { LeagueData } from "@/types/league";

export const leagues: LeagueData[] = [
  demonicPactsLeague,
  ragingEchoesLeague,
];

export function getLeague(id: string): LeagueData | undefined {
  return leagues.find((l) => l.id === id);
}

export function getCurrentLeague(): LeagueData {
  return demonicPactsLeague;
}

export function getPreviousLeagues(): LeagueData[] {
  return [ragingEchoesLeague];
}

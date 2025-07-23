import type { FixtureVisualizerMatch, WeballBaseEntity, TournamentClub, FixtureVacancy, TournamentMatch, FixtureVisualizer } from "./types";

/**
 * Generic fixture node type that combines FixtureVisualizerMatch with additional layout properties
 * 
 * @template T - Type for additional fixture data (can contain any additional properties)
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const node: WBFixtureNode = {
 *   id: 1,
 *   groupNumber: 1,
 *   stageNumberFromFinal: 2,
 *   nodeNumber: 1,
 *   parentRank: 0,
 *   clubHome: { clubInscription: { logo: "...", name: "Team A", color: "#fff" } },
 *   clubAway: { clubInscription: { logo: "...", name: "Team B", color: "#000" } }
 * };
 * 
 * // With custom data
 * const nodeWithCustomData: WBFixtureNode<{ customField: string }> = {
 *   id: 1,
 *   groupNumber: 1,
 *   stageNumberFromFinal: 2,
 *   nodeNumber: 1,
 *   parentRank: 0,
 *   clubHome: { clubInscription: { logo: "...", name: "Team A", color: "#fff" } },
 *   clubAway: { clubInscription: { logo: "...", name: "Team B", color: "#000" } },
 *   customField: "my custom data"
 * };
 * ```
 */
export type WBFixtureNode<T = any> = FixtureVisualizerMatch<T> & {
  /**
   * Group number for organizing fixtures
   */
  groupNumber: number;

  /**
   * Stage number counting from the final (final = 0, semi-final = 1, etc.)
   */
  stageNumberFromFinal: number;

  /**
   * Node number within the stage
   */
  nodeNumber: number;

  /**
   * Parent rank for determining positioning
   */
  parentRank: number;
};

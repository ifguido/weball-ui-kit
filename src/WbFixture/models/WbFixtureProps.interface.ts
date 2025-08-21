import type { FixtureVisualizer, MinClubInscription, TournamentMatch, WeballBaseEntity } from "./types";

/**
 * Minimum required properties for a cup winner
 * Users can pass any object that has at least these properties
 */
export type MinCupWinner = WeballBaseEntity & MinClubInscription;

/**
 * Props interface for WbFixture component with generic type support
 * Allows users to pass any data structures that extend the minimum requirements
 * 
 * @template TFixtureData - Type for fixture visualizer data (can contain any additional properties)
 * @template TCupWinnerData - Type for cup winner data (can contain any additional properties)
 */
export interface WbFixtureProps<
  TFixtureData = any,
  TCupWinnerData = any
> {
  /**
   * Cup winner data - can be any object that extends the minimum required properties:
   * - id: number
   * - logo: string
   * - name: string
   * - color: string
   * 
   * @example
   * ```tsx
   * // Basic usage
   * cupWinner={{ id: 1, logo: "...", name: "Team A", color: "#fff" }}
   * 
   * // With additional custom data
   * cupWinner={{ 
   *   id: 1, 
   *   logo: "...", 
   *   name: "Team A", 
   *   color: "#fff",
   *   customField: "my custom data",
   *   stats: { wins: 10, losses: 2 }
   * }}
   * ```
   */
  cupWinner?: MinCupWinner & TCupWinnerData;

  /**
   * URL or path to the cup logo image
   */
  cupLogo?: string;

  /**
   * Callback function triggered when a node is clicked
   * @param match - The fixture visualizer match data (with any additional properties)
   * @param position - The position clicked: "local", "visit", "resultLocal", or "resultVisit"
   */
  onClickNode?: (
    match: Partial<FixtureVisualizer<TFixtureData>>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => void;

  /**
   * Callback function triggered when a result is saved
   * @param fixtureVisualizerId - The ID of the fixture visualizer
   * @param scoreHome - Home team score
   * @param scoreAway - Away team score
   */
  onResultSaved?: (fixtureVisualizerId: number, scoreHome?: number, scoreAway?: number) => void;

  /**
   * Root fixture visualizer data - can be any object that extends the minimum required properties:
   * - id: number
   * - children: FixtureVisualizer[]
   * - matchesPlanning: FixtureVisualizerMatch[]
   * 
   * @example
   * ```tsx
   * // Basic usage
   * fixtureVisualizerRoot={{
   *   id: 1,
   *   children: [],
   *   matchesPlanning: []
   * }}
   * 
   * // With additional custom data
   * fixtureVisualizerRoot={{
   *   id: 1,
   *   children: [],
   *   matchesPlanning: [],
   *   customTournamentData: "...",
   *   metadata: { created: "2024-01-01", type: "knockout" }
   * }}
   * ```
   */
  fixtureVisualizerRoot?: FixtureVisualizer<TFixtureData>;

  /**
   * Function to fetch fixtureVisualizerMatch tournamentMatches
   * @param fixtureVisualizerMatchId 
   * @returns 
   */
  loadTournamentMatches?: (fixtureVisualizerMatchId: number) => Promise<TournamentMatch[]>;

  /**
   * Currently selected fixture visualizer node
   */
  nodeSelected?: FixtureVisualizer<TFixtureData>;

  /**
   * The stage number to start viewing from
   */
  viewFromStage?: number;

  /**
   * Enable or disable edit mode for results
   * When true, allows clicking on scores to edit them
   * When false, score editing is disabled (view-only mode)
   * @default false
   */
  editMode?: boolean;

  /**
   * Enable responsive behavior
   * When true, the fixture will scale to fit its container and occupy 100% width
   * When false, uses fixed dimensions based on content
   * @default true
   */
  responsive?: boolean;
}

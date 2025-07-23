import type { FixtureVisualizerMatch } from "./types";


/**
 * cambié el type de Match a MatchFixture para poder pasarle los teams a los nodos, @todo que revisar si no rompe en otro lado
 */
export interface WBFixtureNode extends FixtureVisualizerMatch {
  groupNumber: number;
  stageNumberFromFinal: number;
  nodeNumber: number;
  parentRank: number;
}

import type { Club, FixtureVisualizer } from "./types";

export interface WbFixtureProps {
  cupWinner?: Club;
  cupLogo?: string;
  onClickNode?: (
    match: Partial<FixtureVisualizer>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => void;
  onResultSaved?: (fixtureVisaulzierId: number, scoreHome?: number, scoreAway?: number) => void;
  fixtureVisualizerRoot?: FixtureVisualizer;
  nodeSelected?: FixtureVisualizer;
  viewFromStage?: number;
}

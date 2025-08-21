import { Flex, Divider, Collapse } from "../../components";
import { Modal, InputNumber } from "antd";
import React, { useState } from "react";
import {
  FIXTURE_NODE_HEIGHT,
  FIXTURE_NODE_WIDTH,
} from "../constants/fixture-measures.constants";
import { WbFixtureNodeClub } from "./WbFixtureNodeClub";
import { type WBFixtureNode } from "../models/FixtureNode.interface";
import { WbFixtureResult } from "./WbFixtureResult";
import { TournamentMatch, WbColors } from "../models/types";

interface WbFixtureNodeProps {
  match: WBFixtureNode;
  nodeSelected?: boolean;
  onClickMatch: (
    match: Partial<WBFixtureNode>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => void;

  onResultSaved: (fixtureVisaulzierId: number, scoreHome?: number, scoreAway?: number) => void;
  editMode?: boolean;
  loadTournamentMatches?: (fixtureVisualizerMatchId: number) => Promise<TournamentMatch[]>;
}

// eslint-disable-next-line react/display-name
export const WbFixtureNode = React.forwardRef<
  HTMLDivElement,
  WbFixtureNodeProps
>((props, ref) => {
  const { match, onClickMatch, nodeSelected, editMode = false, loadTournamentMatches } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [tournamentMatches, setTournamentMatches] = useState<TournamentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [editingResult, setEditingResult] = useState<{
    position: "resultLocal" | "resultVisit";
    visible: boolean;
  }>({ position: "resultLocal", visible: false });
  const [inputScore, setInputScore] = useState<number | null>(null);

  const loadAndShowDetails = async () => {
    if (tournamentMatches.length > 0) {
      setShowDetails(true);
      return;
    }
    
    if (!loadTournamentMatches || !match?.id) {
        setShowDetails(true);
        return;
    }

    setIsLoading(true);
    try {
      const matches = await loadTournamentMatches(match.id);
      setTournamentMatches(matches);
      setShowDetails(true);
    } catch (error) {
      console.error("Error al cargar los partidos del torneo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDetails = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      loadAndShowDetails();
    }
  };

  const handleClickMatch = (
    clickedMatch: Partial<WBFixtureNode>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => {
    if (position === "resultLocal" || position === "resultVisit") {
      if (editMode && tournamentMatches?.length >= 1) {
        setEditingResult({ position, visible: true });
      }
      return;
    }

    onClickMatch(clickedMatch, position);
    handleToggleDetails();
  };

  const handleModalOk = () => {
    setEditingResult({ ...editingResult, visible: false });
    if (inputScore !== null) {
      const scoreHome = editingResult.position === "resultLocal" ? +inputScore : match.valueScoreHome ? + match.valueScoreHome : 0;
      const scoreAway = editingResult.position === "resultVisit" ? +inputScore : match.valueScoreAway ? + match.valueScoreAway : 0;
      props.onResultSaved(match.id, scoreHome, scoreAway);
    }
    setInputScore(null);
  };

  const handleModalCancel = () => {
    setEditingResult({ ...editingResult, visible: false });
    setInputScore(null);
  };
  return (
    <>
      <Flex direction="column" cursor="pointer" ref={ref}>
        <Flex
          flexDirection="column"
          gap={2}
          px={4}
          py={3}
          borderRadius={12}
          width={FIXTURE_NODE_WIDTH + "px"}
          height={FIXTURE_NODE_HEIGHT + "px"}
          onClick={handleToggleDetails}
          style={{
            backgroundColor: nodeSelected
              ? "gray"
              : WbColors.light.backgroundGrey,
          }}

        >
          <WbFixtureNodeClub
            nodeSelected={nodeSelected}
            local={true}
            onClickMatch={handleClickMatch}
            match={match}
            editMode={editMode}
          />
          <WbFixtureNodeClub
            nodeSelected={nodeSelected}
            local={false}
            onClickMatch={handleClickMatch}
            match={match}
            editMode={editMode}
          />
        </Flex>

        <Collapse in={showDetails} animateOpacity style={{ zIndex: 999 }}>
          <Flex
            direction="column"
            gap={1}
            mt={1}
            py={2}
            borderRadius={8}
            zIndex={999}
            backgroundColor={WbColors.light.darkGrey}
            width={FIXTURE_NODE_WIDTH + "px"}
          >
            {isLoading && <p style={{color: 'white', textAlign: 'center', padding: '8px'}}>Cargando...</p>}
            
            {!isLoading && tournamentMatches?.length > 1 && tournamentMatches.map((tm: any, index: number) => (
              <React.Fragment key={tm.id}>
                <WbFixtureResult fixtureMatch={match} tournamentMatch={tm} />
                {index !== (tournamentMatches.length - 1) && <Divider />}
              </React.Fragment>
            ))}
          </Flex>
        </Collapse>
      </Flex>
      <Modal
        title={
          editingResult.position === "resultLocal"
            ? "Editar resultado Local"
            : "Editar resultado Visitante"
        }
        open={editingResult.visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <InputNumber
          autoFocus
          min={0}
          style={{ width: "100%" }}
          value={inputScore ?? undefined}
          onChange={(value) => setInputScore(value ?? null)}
          placeholder="Ingresá el nuevo score"
        />
      </Modal></>

  );

});

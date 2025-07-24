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
import { WbColors } from "../models/types";

interface WbFixtureNodeProps {
  match: WBFixtureNode;
  nodeSelected?: boolean;
  onClickMatch: (
    match: Partial<WBFixtureNode>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => void;

  onResultSaved: (fixtureVisaulzierId: number, scoreHome?: number, scoreAway?: number) => void;
  editMode?: boolean;
}

export const WbFixtureNode = React.forwardRef<
  HTMLDivElement,
  WbFixtureNodeProps
>((props, ref) => {
  const { match, onClickMatch, nodeSelected, editMode = false } = props;
  const [showDetails, setShowDetails] = useState(false);

  const handleClickMatch = (
    match: Partial<WBFixtureNode>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => {
    if (position === "resultLocal" || position === "resultVisit") {
      // Only allow editing results if editMode is enabled
      if (editMode && match?.tournamentMatches?.length && match?.tournamentMatches?.length >= 1) {
        setEditingResult({ position, visible: true });
      }
      return;
    }

    onClickMatch(match, position);
    setShowDetails((prev) => !prev);
  };

  const [editingResult, setEditingResult] = useState<{
    position: "resultLocal" | "resultVisit";
    visible: boolean;
  }>({ position: "resultLocal", visible: false });

  const [inputScore, setInputScore] = useState<number | null>(null);


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

        <Collapse in={showDetails} animateOpacity style={{
          zIndex: 999
        }}>
          {match?.tournamentMatches?.length && match?.tournamentMatches?.length > 1 && (
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
              {match.tournamentMatches?.map((tm: any, index: number) => (
                <React.Fragment key={tm.id}>
                  <WbFixtureResult fixtureMatch={match} tournamentMatch={tm} />
                  {index !== match.tournamentMatches!.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Flex>
          )}
        </Collapse>
      </Flex>
      <Modal
        title={
          editingResult.position === "resultLocal"
            ? "Editar resultado Local"
            : "Editar resultado Visitante"
        }
        open={editingResult.visible}
        onOk={() => {
          setEditingResult({ ...editingResult, visible: false });
          if (inputScore !== null) {
            const scoreHome = editingResult.position === "resultLocal" ? +inputScore : match.valueScoreHome ? + match.valueScoreHome : 0;
            const scoreAway = editingResult.position === "resultVisit" ? +inputScore : match.valueScoreAway ? + match.valueScoreAway : 0;
            props.onResultSaved(match.id, scoreHome, scoreAway);
          }
          setInputScore(null);
        }}
        onCancel={() => {
          setEditingResult({ ...editingResult, visible: false });
          setInputScore(null);
        }}
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FIXTURE_BRACE_WIDTH,
  FIXTURE_HEIGHT_BETWEEN_GROUPS,
  FIXTURE_HEIGHT_BETWEEN_NODES,
  FIXTURE_LINE_WIDTH,
  FIXTURE_NODE_HEIGHT,
  FIXTURE_NODE_WIDTH,
  FIXTURE_SCROLL_SIZE,
  FIXTURE_STAGE_SIZE,
  FIXTURE_WIDTH_BETWEEN_WINGS,
  FIXTURE_WINNER_HEIGHT,
  FIXTURE_WINNER_STAGE_SIZE,
  FIXTURE_WINNER_WIDTH,
} from "../constants/fixture-measures.constants";
import { WbStages } from "../constants/fixture-stages.constants";
import { type WbFixtureProps } from "../models/WbFixtureProps.interface";
import { getOrderedMatchesByParentChildrenCount, SRC_IMG } from "../WbFixture.utils";
import { WbFixtureNode } from "./WbFixtureNode";
import { type WBFixtureNode } from "../models/FixtureNode.interface";
import { WbColors } from "../models/types";
import { WbAvatar } from "../ui/WbAvatar";

export const WbFixtureSymmetrical = (props: WbFixtureProps) => {
  const [nodes, setNodes] = useState<WBFixtureNode[]>([]);
  const [linesQuantity, setLinesQuantity] = useState<number>(0);
  const [startRootNodes, setStartRootNodes] = useState<number>(0);
  const [rootStageNumberToShow, setRootStageNumberToShow] = useState<number>(0);
  const [stagesTextQuantity, setStagesTextQuantity] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const refNodes = useRef<HTMLDivElement[]>([]);
  const refStages = useRef<HTMLDivElement[]>([]);
  const refGreaterBraces = useRef<HTMLDivElement[]>([]);
  const refLessBraces = useRef<HTMLDivElement[]>([]);
  const refLines = useRef<HTMLDivElement[]>([]);
  const refFinalStage = useRef<HTMLDivElement>(null);
  const refWinner = useRef<HTMLDivElement>(null);

  const stagesOnWing = props.fixtureVisualizerRoot?.children.length
    ? props.fixtureVisualizerRoot?.children.length - 1
    : 0;

  useEffect(() => {
    if (!props.fixtureVisualizerRoot) return;
    /** Ordena los nodos ingresados por stageNumberFromFinal y seguido de parentRank */
    const sorted = getOrderedMatchesByParentChildrenCount(
      props.fixtureVisualizerRoot,
      props.fixtureVisualizerRoot.children.length
    );
    const stages = props.fixtureVisualizerRoot.children.length;
    const totalExpectedNodes = 2 ** props.fixtureVisualizerRoot.children.length;

    setRootStageNumberToShow(stages);

    /** Calcula la cantidad de labels para los stages (2 por stage, sin contar el final) */
    setStagesTextQuantity((stages - 1) * 2);

    /** Calcula la cantidad total de nodos a renderizar */

    /** Ordena los nodos por orden de renderización */
    const nodesInStage = [];

    for (let i = 0; i < stages; i++) {
      nodesInStage.push(Math.round(Math.pow(2, i + 1) / 4));
    }

    let ascendingNodeNumber = 1;
    let descendingNodeNumber = totalExpectedNodes;

    for (let i = 0; i < totalExpectedNodes; i++) {
      if (!sorted[i]) continue;
      if (
        sorted[i].parentRank > nodesInStage[sorted[i].stageNumberFromFinal - 1]
      ) {
        sorted[i].nodeNumber = descendingNodeNumber;
        descendingNodeNumber--;
      } else {
        sorted[i].nodeNumber = ascendingNodeNumber;
        ascendingNodeNumber++;
      }
    }

    sorted.sort((a, b) => (a.nodeNumber! < b.nodeNumber! ? -1 : 1));

    /** Calcula la cantidad de nodos raíces a la izquierda */

    const leftRootNodes = nodesInStage[nodesInStage.length - 1];
    setStartRootNodes(leftRootNodes);

    /** Calcula el width y el height del contenedor del fixture */
    const width =
      (stagesOnWing * FIXTURE_NODE_WIDTH +
        (stagesOnWing - 1) * (FIXTURE_LINE_WIDTH + FIXTURE_BRACE_WIDTH)) *
      2 +
      FIXTURE_WIDTH_BETWEEN_WINGS +
      FIXTURE_SCROLL_SIZE;

    const height =
      leftRootNodes * FIXTURE_NODE_HEIGHT +
      (leftRootNodes - 1) * FIXTURE_HEIGHT_BETWEEN_NODES +
      (leftRootNodes / 2 - 1) * FIXTURE_HEIGHT_BETWEEN_GROUPS +
      (FIXTURE_STAGE_SIZE + FIXTURE_HEIGHT_BETWEEN_NODES) +
      (stages > 2
        ? 0
        : FIXTURE_NODE_HEIGHT +
        FIXTURE_HEIGHT_BETWEEN_GROUPS +
        FIXTURE_HEIGHT_BETWEEN_NODES +
        FIXTURE_STAGE_SIZE) +
      FIXTURE_SCROLL_SIZE;

    if (containerRef.current) {
      containerRef.current.style.width = width + "px";
      containerRef.current.style.height = height + "px";
    }

    const auxLinesQuantity = 2 * (2 ** (stagesOnWing - 1) - 1);
    setLinesQuantity(auxLinesQuantity);
    setNodes(sorted);
  }, [props.fixtureVisualizerRoot, stagesOnWing]);

  useEffect(() => {
    const middleNode = (nodes.length - 1) / 2;

    if (
      refNodes.current &&
      refNodes.current.length === nodes.length &&
      nodes &&
      nodes.length > 0
    ) {
      const wingWidth =
        stagesOnWing * FIXTURE_NODE_WIDTH +
        (stagesOnWing - 1) * (FIXTURE_LINE_WIDTH + FIXTURE_BRACE_WIDTH);

      const nodesHeight =
        startRootNodes * (FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES);

      const nodesMargin =
        Math.floor(startRootNodes / 2) * FIXTURE_HEIGHT_BETWEEN_GROUPS;
      const wingHeight = nodesHeight + nodesMargin;

      const containerEnd =
        wingWidth * 2 + FIXTURE_WIDTH_BETWEEN_WINGS - FIXTURE_NODE_WIDTH;

      const linesEndPositions = Array(linesQuantity / 2);
      let calcBraceTop: number = 0;
      let lineIndex: number = 0;
      let lastNodeTop: number = 0;
      let lastNodeLeft: number = 0;
      let lastStageIndex: number = 0;
      let lastStageNumber: number = nodes[0].stageNumberFromFinal;

      // ========= LEFT WING ==========

      for (let i = 0; i < middleNode; i++) {
        /** Crea el posicionamiento de la primera fase */
        if (nodes[i].stageNumberFromFinal === rootStageNumberToShow) {
          const nodeExtendedHeight =
            (nodes[i].parentRank - 1) *
            (FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES);
          const marginSpace =
            Math.floor((nodes[i].parentRank - 1) / 2) *
            FIXTURE_HEIGHT_BETWEEN_GROUPS;
          const top =
            nodeExtendedHeight +
            marginSpace +
            +FIXTURE_STAGE_SIZE +
            FIXTURE_HEIGHT_BETWEEN_NODES;

          if (refNodes.current[i]) {
            refNodes.current[i].style.left = "0";
            refNodes.current[i].style.top = top + "px";
          }
          lastNodeTop = top;
        } else {
          /** Crea el posicionamiento de las fases subsiguientes */
          const lineNodeIndex = i - startRootNodes;
          const linePosition = linesEndPositions[lineNodeIndex];
          const calcNodeTop = linePosition.top - FIXTURE_NODE_HEIGHT / 2;

          if (refNodes.current[i]) {
            refNodes.current[i].style.left = linePosition.left + "px";
            refNodes.current[i].style.top = calcNodeTop + "px";
          }
          lastNodeTop = calcNodeTop;
          lastNodeLeft = linePosition.left;
        }

        /** Texto al principio de la fase */
        if (i === 0 || nodes[i].stageNumberFromFinal !== lastStageNumber) {
          lastStageNumber = nodes[i].stageNumberFromFinal;

          if (refStages.current[lastStageIndex]) {
            refStages.current[lastStageIndex].style.left = lastNodeLeft + "px";
            refStages.current[lastStageIndex].style.top =
              lastNodeTop -
              FIXTURE_STAGE_SIZE -
              FIXTURE_HEIGHT_BETWEEN_NODES +
              "px";
            refStages.current[lastStageIndex].innerText =
              WbStages[lastStageNumber - 1];
          }
          lastStageIndex++;
        }

        /** Crea la dimension y posicionamiento de las lineas */
        if (i % 2 === 0) {
          calcBraceTop = FIXTURE_NODE_HEIGHT / 2 + lastNodeTop;
          lineIndex = i / 2;
        } else {
          const calcBraceHeight = Number(
            (FIXTURE_NODE_HEIGHT / 2 + lastNodeTop - calcBraceTop).toFixed()
          );
          const calcBraceLeft = lastNodeLeft + FIXTURE_NODE_WIDTH;

          if (refGreaterBraces.current[lineIndex]) {
            refGreaterBraces.current[lineIndex].style.top = calcBraceTop + "px";
            refGreaterBraces.current[lineIndex].style.left =
              calcBraceLeft + "px";
            refGreaterBraces.current[lineIndex].style.height =
              calcBraceHeight + "px";
          }

          const calcLineTop = Number(
            (calcBraceHeight / 2 + calcBraceTop).toFixed()
          );
          const calcLineLeft = calcBraceLeft + FIXTURE_BRACE_WIDTH;

          if (refLines.current[lineIndex]) {
            refLines.current[lineIndex].style.top = calcLineTop + "px";
            refLines.current[lineIndex].style.left = calcLineLeft + "px";
          }

          linesEndPositions[lineIndex] = {
            top: calcLineTop,
            left: calcLineLeft + FIXTURE_LINE_WIDTH,
          };
        }
      }

      lastNodeTop = 0;
      lastNodeLeft = containerEnd;
      let calcBraceBottom = 0;
      // ========= RIGHT WING ==========
      for (let i = nodes.length - 1; i > middleNode; i--) {
        /** Crea el posicionamiento de la primera fase */
        if (nodes[i].stageNumberFromFinal === rootStageNumberToShow) {
          const nodeExtendedHeight =
            (nodes[i].parentRank - startRootNodes) *
            (FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES);
          const marginSpace =
            Math.floor((nodes[i].parentRank - startRootNodes + 1) / 2) *
            FIXTURE_HEIGHT_BETWEEN_GROUPS;
          const top =
            wingHeight -
            nodeExtendedHeight -
            marginSpace +
            FIXTURE_STAGE_SIZE +
            FIXTURE_HEIGHT_BETWEEN_NODES;
          const left = containerEnd;

          if (refNodes.current[i]) {
            refNodes.current[i].style.left = left + "px";
            refNodes.current[i].style.top = top + "px";
          }
          lastNodeTop = top;
        } else {
          /** Crea el posicionamiento de las fases subsiguientes */
          const lineNodeIndex =
            nodes.length - 1 - i - startRootNodes + linesQuantity / 2;
          const linePosition = linesEndPositions[lineNodeIndex];
          const calcNodeTop = linePosition.top - FIXTURE_NODE_HEIGHT / 2;
          const calcNodeLeft = linePosition.left - FIXTURE_NODE_WIDTH;

          if (refNodes.current[i]) {
            refNodes.current[i].style.left = calcNodeLeft + "px";
            refNodes.current[i].style.top = calcNodeTop + "px";
          }
          lastNodeTop = calcNodeTop;
          lastNodeLeft = calcNodeLeft;
        }

        /** Texto al principio de la fase */
        if (
          nodes[i].parentRank === Math.pow(2, nodes[i].stageNumberFromFinal - 1)
        ) {
          lastStageNumber = nodes[i].stageNumberFromFinal;

          if (refStages.current[lastStageIndex]) {
            refStages.current[lastStageIndex].style.left = lastNodeLeft + "px";
            refStages.current[lastStageIndex].style.top =
              lastNodeTop -
              FIXTURE_STAGE_SIZE -
              FIXTURE_HEIGHT_BETWEEN_NODES +
              "px";
            refStages.current[lastStageIndex].innerText =
              WbStages[lastStageNumber - 1];
          }
          lastStageIndex++;
        }

        /** Crea la dimension y posicionamiento de las lineas */

        if (i % 2 === 0) {
          calcBraceBottom = lastNodeTop + FIXTURE_NODE_HEIGHT / 2;
          lineIndex =
            linesQuantity / 2 + Number(((nodes.length - 1 - i) / 2).toFixed());
        } else {
          const calcBraceTop = Number(
            (lastNodeTop + FIXTURE_NODE_HEIGHT / 2).toFixed()
          );
          const calcBraceHeight = Number(calcBraceBottom - calcBraceTop);
          const calcBraceLeft = lastNodeLeft - FIXTURE_BRACE_WIDTH;

          const braceIndex = lineIndex - linesQuantity / 2;

          if (refLessBraces.current[braceIndex]) {
            refLessBraces.current[braceIndex].style.top = calcBraceTop + "px";
            refLessBraces.current[braceIndex].style.left = calcBraceLeft + "px";
            refLessBraces.current[braceIndex].style.height =
              calcBraceHeight + "px";
          }

          const calcLineTop =
            calcBraceTop + Number((calcBraceHeight / 2).toFixed());
          const calcLineLeft = calcBraceLeft - FIXTURE_LINE_WIDTH;

          if (refLines.current[lineIndex]) {
            refLines.current[lineIndex].style.top = calcLineTop + "px";
            refLines.current[lineIndex].style.left = calcLineLeft + "px";
          }

          linesEndPositions[lineIndex] = {
            top: calcLineTop,
            left: calcLineLeft,
          };
        }
      }
      // ======= MIDDLE NODE ========
      /** Crea el posicionamiento del nodo ganador y los items que lo acompañan */
      const finalNodeTop =
        wingHeight / 2 -
        FIXTURE_NODE_HEIGHT / 2 -
        FIXTURE_NODE_HEIGHT -
        FIXTURE_HEIGHT_BETWEEN_GROUPS;
      const finalNodeLeft =
        wingWidth + FIXTURE_WIDTH_BETWEEN_WINGS / 2 - FIXTURE_NODE_WIDTH / 2;
      if (refNodes.current[middleNode]) {
        refNodes.current[middleNode].style.top = finalNodeTop + "px";
        refNodes.current[middleNode].style.left = finalNodeLeft + "px";
      }

      if (refFinalStage.current) {
        refFinalStage.current.style.top =
          finalNodeTop -
          FIXTURE_HEIGHT_BETWEEN_NODES -
          FIXTURE_WINNER_STAGE_SIZE +
          "px";
        refFinalStage.current.style.left = finalNodeLeft + "px";
      }

      if (refWinner.current) {
        refWinner.current.style.top =
          finalNodeTop + FIXTURE_NODE_HEIGHT * 2 + FIXTURE_WINNER_HEIGHT + "px";
        refWinner.current.style.left = finalNodeLeft + "px";
      }
    }
  }, [refNodes.current, nodes]);

  if (!props.fixtureVisualizerRoot || !nodes.length) return;

  return (
    <Box>
      <Box position="relative" ref={containerRef}>
        {nodes.map((node: WBFixtureNode, index: number) => (
          <Box
            key={index}
            ref={(el: any) => {
              refNodes.current[index] = el!;
            }}
            position="absolute"
            width={FIXTURE_NODE_WIDTH + "px"}
            height={FIXTURE_NODE_HEIGHT + "px"}
          >
            <WbFixtureNode match={node} onClickMatch={props.onClickNode ?? (() => { })} onResultSaved={props.onResultSaved ?? (() => { })} editMode={props.editMode} />
          </Box>
        ))}

        {[...Array(linesQuantity / 2)].map((_, index: number) => (
          <Box
            key={index}
            ref={(el: any) => {
              refGreaterBraces.current[index] = el!;
            }}
            position="absolute"
            borderWidth={1}
            borderTopRightRadius={6}
            borderBottomRightRadius={6}
            borderLeftWidth={0}
            width={FIXTURE_BRACE_WIDTH + "px"}
            borderColor={WbColors.light.inputBorder}
          />
        ))}

        {[...Array(linesQuantity / 2)].map((_, index: number) => (
          <Box
            key={index}
            ref={(el: any) => {
              refLessBraces.current[index] = el!;
            }}
            position="absolute"
            borderWidth={1}
            borderTopLeftRadius={6}
            borderBottomLeftRadius={6}
            borderRightWidth={0}
            width={FIXTURE_BRACE_WIDTH + "px"}
            borderColor={WbColors.light.inputBorder}
          />
        ))}

        {[...Array(linesQuantity)].map((_, index: number) => (
          <Box
            key={index}
            ref={(el: any) => {
              refLines.current[index] = el!;
            }}
            position="absolute"
            width={FIXTURE_LINE_WIDTH + "px"}
            height={1}
            borderWidth={0}
            borderTopWidth={1}
            borderColor={WbColors.light.inputBorder}
          />
        ))}

        {[...Array(stagesTextQuantity)].map((_, index: number) => (
          <Text
            key={index}
            ref={(el: any) => {
              refStages.current[index] = el!;
            }}
            position="absolute"
            textAlign="center"
            pointerEvents="none"
            width={FIXTURE_NODE_WIDTH + "px"}
            color={WbColors.light.darkGrey}
            fontWeight={600}
            fontSize={FIXTURE_STAGE_SIZE + "px"}
            px={1}
          />
        ))}

        <Flex
          ref={refFinalStage}
          position="absolute"
          direction="row"
          alignItems="center"
          justifyContent="center"
          color={WbColors.light.darkGrey}
          fontWeight={600}
          gap={2}
          width={FIXTURE_NODE_WIDTH + "px"}
        >
          <WbAvatar
            borderColor={WbColors.light.inputBorder}
            size={`${FIXTURE_WINNER_STAGE_SIZE}px`}
            src={props.cupLogo || SRC_IMG}
            new
          />
          <Text>Final</Text>
        </Flex>

        <Flex
          ref={refWinner}
          position="absolute"
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={2}
          width={FIXTURE_WINNER_WIDTH + "px"}
        >
          <WbAvatar
            borderColor={WbColors.light.inputBorder}
            size={`${FIXTURE_WINNER_HEIGHT}px`}
            src={props.cupWinner?.logo || SRC_IMG}
            new
          />
          <Box>
            <Text fontWeight="bold">Campeón</Text>
            <Text style={{ fontSize: 12, color: WbColors.light.grey }}>
              {props.cupWinner?.name || "Aún no definido."}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

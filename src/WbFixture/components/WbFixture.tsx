/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from "../../components";
import { useState, useRef, useEffect } from "react";

import { WbFixtureNode } from "./WbFixtureNode";
import {
  FIXTURE_NODE_WIDTH,
  FIXTURE_BRACE_WIDTH,
  FIXTURE_LINE_WIDTH,
  FIXTURE_WINNER_WIDTH,
  FIXTURE_NODE_HEIGHT,
  FIXTURE_HEIGHT_BETWEEN_NODES,
  FIXTURE_HEIGHT_BETWEEN_GROUPS,
  FIXTURE_STAGE_SIZE,
  FIXTURE_WINNER_STAGE_SIZE,
  FIXTURE_WINNER_HEIGHT,
  FIXTURE_SCROLL_SIZE,
  FIXTURE_FINAL_LINE_WIDTH,
} from "../constants/fixture-measures.constants";
import { WbStages } from "../constants/fixture-stages.constants";
import { type WbFixtureProps } from "../models/WbFixtureProps.interface";
import { getOrderedMatchesByParentChildrenCount, SRC_IMG } from "../WbFixture.utils";
import { type WBFixtureNode } from "../models/FixtureNode.interface";
import { WbAvatar } from "../ui/WbAvatar";
import { WbColors } from "../models/types";

const KEY_PREFIX = {
  BRACE: "brace-",
  LINE: "line-",
  STAGE: "stage-",
};

// ======================================================
// 2) Componente principal: WbFixture
// ======================================================

/**
 * WbFixture component - displays tournament bracket/fixture visualization
 * 
 * @template TFixtureData - Type for fixture visualizer data (can contain any additional properties)  
 * @template TCupWinnerData - Type for cup winner data (can contain any additional properties)
 * 
 * @example
 * ```tsx
 * // Basic usage with minimum required properties
 * <WbFixture
 *   fixtureVisualizerRoot={{
 *     id: 1,
 *     children: [],
 *     matchesPlanning: [
 *       {
 *         id: 1,
 *         clubHome: { clubInscription: { logo: "...", name: "Team A", color: "#fff" } },
 *         clubAway: { clubInscription: { logo: "...", name: "Team B", color: "#000" } }
 *       }
 *     ]
 *   }}
 *   cupWinner={{ id: 1, logo: "...", name: "Winner", color: "#gold" }}
 *   onClickNode={(match, position) => console.log(match, position)}
 * />
 * 
 * // Usage with extended custom data
 * <WbFixture
 *   fixtureVisualizerRoot={{
 *     id: 1,
 *     children: [],
 *     matchesPlanning: [],
 *     customTournamentName: "World Cup 2024",
 *     metadata: { season: "2024", region: "Global" }
 *   }}
 *   cupWinner={{ 
 *     id: 1, 
 *     logo: "...", 
 *     name: "Winner", 
 *     color: "#gold",
 *     stats: { wins: 15, goals: 45 },
 *     country: "Argentina"
 *   }}
 * />
 * ```
 */
export const WbFixture = <TFixtureData = any, TCupWinnerData = any>(
  props: WbFixtureProps<TFixtureData, TCupWinnerData>
) => {
  const {
    fixtureVisualizerRoot,
    cupWinner,
    cupLogo,
    nodeSelected,
    onClickNode,
    onResultSaved,
    editMode = false,
    responsive = true,
    ...restProps
  } = props;
  // Estado con la lista final de nodos a renderizar (partidos)
  const [matches, setMatches] = useState<WBFixtureNode[]>([]);
  // Cantidad de líneas que se dibujan entre partidos
  const [linesQuantity, setLinesQuantity] = useState<number>(0);
  // Cantidad de “stages” (rondas)
  const [rootStageNumberToShow, setRootStageNumberToShow] = useState<number>(0);
  // Cantidad de textos de etapas que dibujaremos
  const [stagesTextQuantity, setStagesTextQuantity] = useState<number>(0);

  // Referencia al contenedor principal
  const containerRef = useRef<HTMLDivElement>(null);

  // Referencias para cada parte del fixture
  const refStages = useRef<HTMLDivElement[]>([]);
  const refmatches = useRef<HTMLDivElement[]>([]);
  const refBraces = useRef<HTMLDivElement[]>([]);
  const refLines = useRef<HTMLDivElement[]>([]);
  const refFinalStage = useRef<HTMLDivElement>(null);
  const refWinner = useRef<HTMLDivElement>(null);

  // Estado para responsive scaling
  const [scale, setScale] = useState<number>(1);
  const [isResponsiveActive, setIsResponsiveActive] = useState<boolean>(false);
  
  // Refs para debouncing y control
  const scaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCalculatedScale = useRef<number>(1);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // ------------------------------------------------------
  // useEffect: cuando cambia el fixtureVisualizerRoot
  // ------------------------------------------------------
  useEffect(() => {
    if (!fixtureVisualizerRoot) return;

    // Interpretamos 'stages' como la cantidad de hijos directos de la raíz
    const stages = fixtureVisualizerRoot.children.length;
    const maxChildren = 8;

    setRootStageNumberToShow(stages);
    setStagesTextQuantity((stages - 1) * 2);

    // Obtenemos y ordenamos los partidos
    const orderedMatches = getOrderedMatchesByParentChildrenCount(
      fixtureVisualizerRoot,
      stages
    );

    // Calculamos ancho y alto del contenedor
    const containerWidth =
      stages * FIXTURE_NODE_WIDTH +
      (stages - 1) * FIXTURE_BRACE_WIDTH +
      (stages - 2) * FIXTURE_LINE_WIDTH +
      FIXTURE_FINAL_LINE_WIDTH +
      (FIXTURE_WINNER_WIDTH - FIXTURE_NODE_WIDTH) / 2;

    const containerHeight =
      maxChildren * FIXTURE_NODE_HEIGHT +
      (maxChildren - 1) * FIXTURE_HEIGHT_BETWEEN_NODES +
      (maxChildren / 2 - 1) * FIXTURE_HEIGHT_BETWEEN_GROUPS +
      (FIXTURE_STAGE_SIZE + FIXTURE_HEIGHT_BETWEEN_NODES) * 2 +
      FIXTURE_SCROLL_SIZE;

    if (containerRef.current) {
      // Solo establecer dimensiones fijas si no es responsive
      if (!responsive) {
        containerRef.current.style.width = containerWidth + "px";
        containerRef.current.style.height = containerHeight + "px";
      } else {
        // En modo responsive, establecer mínimas dimensiones
        containerRef.current.style.minWidth = containerWidth + "px";
        containerRef.current.style.minHeight = containerHeight + "px";
      }
    }

    // Cantidad de “llaves” (líneas)
    const auxLinesQuantity = Math.pow(2, stages - 1) - 1;
    setLinesQuantity(auxLinesQuantity);

    // Mapeamos los FixtureVisualizerMatch -> FixtureNode
    // (para que WbFixtureNode los reciba con la misma estructura esperada)
    setMatches(orderedMatches);
  }, [fixtureVisualizerRoot]);

  // ------------------------------------------------------
  // useEffect: responsive scaling - SIMPLIFIED  
  // ------------------------------------------------------
  useEffect(() => {
    if (!responsive) {
      setScale(1);
      setIsResponsiveActive(false);
      return;
    }

    const calculateAndApplyScale = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get parent container dimensions
      const parentElement = container.parentElement;
      if (!parentElement) return;

      const parentWidth = parentElement.clientWidth;
      
      // Calculate total fixture width based on stages
      const totalFixtureWidth = (rootStageNumberToShow * (FIXTURE_NODE_WIDTH + FIXTURE_BRACE_WIDTH)) + FIXTURE_WINNER_WIDTH;

      let newScale = 1;
      let shouldBeResponsive = false;

      if (parentWidth > 0 && totalFixtureWidth > parentWidth) {
        newScale = Math.max(0.3, Math.min(1, (parentWidth - 40) / totalFixtureWidth)); // 40px margin
        shouldBeResponsive = true;
      }

      // Only update if there's a significant change (prevents render loops)
      const scaleDifference = Math.abs(newScale - lastCalculatedScale.current);
      if (scaleDifference > 0.01) {
        lastCalculatedScale.current = newScale;
        
        // Clear any existing timeout
        if (scaleTimeoutRef.current) {
          clearTimeout(scaleTimeoutRef.current);
        }

        // Debounce the update
        scaleTimeoutRef.current = setTimeout(() => {
          setScale(newScale);
          setIsResponsiveActive(shouldBeResponsive);
        }, 50);
      }
    };

    // Initial calculation
    calculateAndApplyScale();

    // Setup ResizeObserver with proper cleanup
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Throttle resize events
        if (scaleTimeoutRef.current) {
          clearTimeout(scaleTimeoutRef.current);
        }
        scaleTimeoutRef.current = setTimeout(calculateAndApplyScale, 100);
      });

      // Observe the parent container, not the fixture itself
      const parentElement = containerRef.current.parentElement;
      if (parentElement) {
        resizeObserverRef.current.observe(parentElement);
      }
    }

    // Cleanup function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (scaleTimeoutRef.current) {
        clearTimeout(scaleTimeoutRef.current);
        scaleTimeoutRef.current = null;
      }
    };
  }, [responsive, rootStageNumberToShow]); // Removed scale from dependencies to prevent loops

  // ------------------------------------------------------
  // useEffect: posicionar y dibujar nodos/lines una vez
  // que `matches` y las refs están listas
  // ------------------------------------------------------
  useEffect(() => {
    if (!matches || matches.length === 0) return;
    if (!refmatches.current || refmatches.current.length !== matches.length)
      return;

    const linesEndPositions: Array<{ top: number; left: number }> = [];
    let braceTop = 0;
    let lineIndex = 0;
    let lastNodeTop = 0;
    let lastNodeLeft = 0;
    let lastStageIndex = 0;
    let lastStageNumber = matches[0].stageNumberFromFinal;

    for (let i = 0; i < matches.length; i++) {
      // ------------------------------
      // ETAPA NUEVA: Texto al final de la fase anterior
      // ------------------------------
      if (matches[i].stageNumberFromFinal !== lastStageNumber) {
        if (refStages.current[lastStageIndex]) {
          const stageTop =
            lastNodeTop + FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES;
          refStages.current[lastStageIndex].innerText =
            WbStages[lastStageNumber - 1];
          refStages.current[lastStageIndex].style.top = stageTop + "px";
          refStages.current[lastStageIndex].style.left = lastNodeLeft + "px";
        }
        lastStageIndex++;
      }

      // ------------------------------
      // POSICIONAMIENTO DE LA PRIMERA FASE
      // ------------------------------
      if (matches[i].stageNumberFromFinal === rootStageNumberToShow) {
        const extendedHeight =
          (matches[i].groupNumber - 1) *
          (FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES);
        const marginSpace =
          Math.floor((matches[i].groupNumber - 1) / 2) *
          FIXTURE_HEIGHT_BETWEEN_GROUPS;
        const nodeTop =
          extendedHeight +
          marginSpace +
          FIXTURE_STAGE_SIZE +
          FIXTURE_HEIGHT_BETWEEN_NODES;

        refmatches.current[i].style.top = nodeTop + "px";
        refmatches.current[i].style.left = "0px";

        lastNodeTop = nodeTop;
      } else {
        // ------------------------------
        // POSICIONAMIENTO DE OTRAS FASES
        // ------------------------------
        const lineNodeIndex = i - (matches.length - linesQuantity);
        const linePosition = linesEndPositions[lineNodeIndex];
        const nodeTop = linePosition.top - FIXTURE_NODE_HEIGHT / 2;

        refmatches.current[i].style.top = nodeTop + "px";
        refmatches.current[i].style.left = linePosition.left + "px";

        lastNodeTop = nodeTop;
        lastNodeLeft = linePosition.left;
      }

      // ------------------------------
      // ETAPA NUEVA: Texto al principio de la fase
      // ------------------------------
      if (i === 0 || matches[i].stageNumberFromFinal !== lastStageNumber) {
        lastStageNumber = matches[i].stageNumberFromFinal ?? 0;
        const stageTop =
          lastNodeTop - FIXTURE_HEIGHT_BETWEEN_NODES - FIXTURE_STAGE_SIZE;

        if (refStages.current[lastStageIndex]) {
          refStages.current[lastStageIndex].innerText =
            WbStages[lastStageNumber - 1];
          refStages.current[lastStageIndex].style.top = stageTop + "px";
          refStages.current[lastStageIndex].style.left = lastNodeLeft + "px";
        }
        lastStageIndex++;
      }

      // ------------------------------
      // CREAR LÍNEAS (cada 2 nodos)
      // ------------------------------
      if (i % 2 === 0) {
        // Guardamos la mitad de la altura para la línea superior
        braceTop = lastNodeTop + FIXTURE_NODE_HEIGHT / 2;
        lineIndex = i / 2;
      } else {
        const braceHeight = Number(
          (lastNodeTop + FIXTURE_NODE_HEIGHT / 2 - braceTop).toFixed()
        );
        const braceLeft = lastNodeLeft + FIXTURE_NODE_WIDTH;

        // “Braces”: línea vertical que une dos nodos
        if (refBraces.current[lineIndex]) {
          refBraces.current[lineIndex].style.top = braceTop + "px";
          refBraces.current[lineIndex].style.left = braceLeft + "px";
          refBraces.current[lineIndex].style.width = FIXTURE_BRACE_WIDTH + "px";
          refBraces.current[lineIndex].style.height = braceHeight + "px";
        }

        // Línea horizontal que sale de la “brace”
        const lineTop = Number((braceHeight / 2 + braceTop).toFixed());
        const lineLeft = braceLeft + FIXTURE_BRACE_WIDTH;
        const lineWidth =
          lineIndex === linesQuantity - 1
            ? FIXTURE_FINAL_LINE_WIDTH
            : FIXTURE_LINE_WIDTH;

        if (refLines.current[lineIndex]) {
          refLines.current[lineIndex].style.top = lineTop + "px";
          refLines.current[lineIndex].style.left = lineLeft + "px";
          refLines.current[lineIndex].style.width = lineWidth + "px";
        }

        const newLeft = lineLeft + lineWidth;
        linesEndPositions[lineIndex] = { top: lineTop, left: newLeft };
      }

      // ------------------------------
      // FINAL STAGE Y WINNER
      // ------------------------------
      if (i === refmatches.current.length - 1) {
        const finalStageTop =
          lastNodeTop -
          FIXTURE_HEIGHT_BETWEEN_NODES -
          FIXTURE_WINNER_STAGE_SIZE;
        if (refFinalStage.current) {
          refFinalStage.current.style.top = finalStageTop + "px";
          refFinalStage.current.style.left = lastNodeLeft + "px";
        }

        const winnerTop =
          lastNodeTop + FIXTURE_NODE_HEIGHT + FIXTURE_HEIGHT_BETWEEN_NODES;
        const winnerLeft =
          lastNodeLeft - (FIXTURE_WINNER_WIDTH - FIXTURE_NODE_WIDTH) / 2;
        if (refWinner.current) {
          refWinner.current.style.top = winnerTop + "px";
          refWinner.current.style.left = winnerLeft + "px";
        }
      }
    }
  }, [matches, linesQuantity, rootStageNumberToShow]);

  // ======================================================
  // Render principal
  // ======================================================
  return (
    <Box
      className="relative"
      ref={containerRef}
      style={{
        transform: responsive && isResponsiveActive ? `scale(${scale})` : undefined,
        transformOrigin: 'top center', // Center the scaling
        width: '100%',
        height: 'auto',
        overflow: 'visible',
        transition: responsive ? 'transform 0.3s ease-out' : undefined,
        willChange: responsive ? 'transform' : undefined,
      }}
    >
      {/* Render de cada partido (nodo) */}
      {matches.map((node: WBFixtureNode, index: number) => (
        <Box
          key={index}
          ref={(el: any) => {
            if (el) refmatches.current[index] = el;
          }}
          position="absolute"
          width={FIXTURE_NODE_WIDTH + "px"}
          height={FIXTURE_NODE_HEIGHT + "px"}
          backgroundColor={WbColors.light.backgroundGrey}
          borderTopLeftRadius={12}
          borderTopRightRadius={12}
          borderBottomRightRadius={12}
          borderBottomLeftRadius={12}

        >
          <WbFixtureNode
            match={node}
            nodeSelected={nodeSelected?.id === node.id}
            onClickMatch={onClickNode ?? (() => { })}
            onResultSaved={onResultSaved ?? (() => { })}
            editMode={editMode}
          />
        </Box>
      ))}

      {/* Render “braces” verticales */}
      {[...Array(linesQuantity)].map((_, index: number) => (
        <Box
          key={`${KEY_PREFIX.BRACE}${index}`}
          ref={(el: any) => {
            if (el) refBraces.current[index] = el;
          }}
          position="absolute"
          borderWidth={1}
          borderStyle="solid"
          borderTopRightRadius={6}
          borderBottomRightRadius={6}
          borderLeftWidth={0}
          width={FIXTURE_BRACE_WIDTH + "px"}
          borderColor={WbColors.light.inputBorder}
        />
      ))}

      {/* Render líneas horizontales */}
      {[...Array(linesQuantity)].map((_, index: number) => (
        <Box
          key={`${KEY_PREFIX.LINE}${index}`}
          ref={(el: any) => {
            if (el) refLines.current[index] = el;
          }}
          position="absolute"
          height="1px"
          width={FIXTURE_LINE_WIDTH + "px"}
          borderTopWidth={1}
          borderStyle="solid"
          borderColor={WbColors.light.inputBorder}
          backgroundColor={WbColors.light.inputBorder}
        />
      ))}

      {/* Texto de etapas intermedias */}
      {[...Array(stagesTextQuantity)].map((_, index: number) => (
        <Text
          key={`${KEY_PREFIX.STAGE}${index}`}
          ref={(el: any) => {
            if (el) refStages.current[index] = el;
          }}
          pointerEvents="none"
          position="absolute"
          textAlign="center"
          width={FIXTURE_NODE_WIDTH + "px"}
          fontSize={FIXTURE_STAGE_SIZE + "px"}
          fontWeight={600}
          color={WbColors.light.darkGrey}
          px={1}
        />
      ))}

      {/* Etapa Final */}
      <Flex
        ref={refFinalStage}
        position="absolute"
        direction="row"
        alignItems="center"
        justifyContent="center"
        color={WbColors.light.darkGrey}
        fontWeight={600}
        gap={1}
        width={FIXTURE_NODE_WIDTH + "px"}
      >
        <WbAvatar
          borderColor={WbColors.light.inputBorder}
          size={FIXTURE_WINNER_STAGE_SIZE + "px"}
          src={cupLogo || SRC_IMG}
          new
        />
        <Text>Final</Text>
      </Flex>

      {/* Ganador */}
      <Flex
        ref={refWinner}
        position="absolute"
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
        width={FIXTURE_WINNER_WIDTH + "px"}
        height={FIXTURE_WINNER_HEIGHT + "px"}
      >
        <WbAvatar
          borderColor={WbColors.light.inputBorder}
          size={FIXTURE_WINNER_HEIGHT + "px"}
          src={cupWinner?.logo || SRC_IMG}
          new
        />
        <Box>
          <Text fontWeight="bold">Campeón</Text>
          <Text fontSize="12px" color={WbColors.light.grey}>
            {cupWinner?.name || "Aún no definido."}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

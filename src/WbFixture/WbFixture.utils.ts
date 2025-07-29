import { ClubInscription, FixtureVisualizer, FixtureVisualizerMatch } from "./models/types";
import { WBFixtureNode } from "./models/FixtureNode.interface";

export const SRC_IMG =
    "https://img.freepik.com/vector-gratis/balon-futbol-aislado_1284-41812.jpg?size=338&ext=jpg&ga=GA1.1.1788614524.1719187200&semt=ais_user";


export const KEY_PREFIX = {
    BRACE: "brace-",
    LINE: "line-",
    STAGE: "stage-",
};

export function getOrderedMatchesByParentChildrenCount(
    tree: FixtureVisualizer,
    stages: number,
    fromStage?: number
): WBFixtureNode[] {
    // 1) Recolectamos datos en un array auxiliar
    const matches: Array<{
        match: FixtureVisualizerMatch;
        parentChildrenCount: number;
        parentId: number | undefined;
    }> = [];

    let parentIdCounter = 1;

    function traverse(node: FixtureVisualizer, parentId?: number): number {
        // Si no hay hijos
        if (!node.children || node.children.length === 0) {
            node.matchesPlanning.forEach((m) => {
                if (m.tournamentMatches?.length) {
                    matches.push({
                        match: m,
                        parentChildrenCount: 0,
                        parentId,
                    });
                }
            });
            return 0;
        }

        const childrenCount = node.children.length;

        // Recolectamos del nodo actual
        node.matchesPlanning?.forEach((m) => {
            matches.push({
                match: m,
                parentChildrenCount: childrenCount,
                parentId,
            });
        });

        // Recorremos recursivamente
        for (const child of node.children) {
            traverse(child, parentIdCounter);
            parentIdCounter++;
        }

        return childrenCount;
    }

    // 2) Iniciar la recursividad
    traverse(tree);

    // 3) Orden descendente según hijos
    matches.sort((a, b) => b.parentChildrenCount - a.parentChildrenCount);

    // 4) Variables para la lógica de "stageNumberFromFinal" y "parentRank"
    let currentRank = 1;
    let previousParentId = matches[0]?.parentId;

    let lastStageNumberFromFinal: number | undefined;
    let parentRankCounter = 1;

    // 5) Creamos el array de WBFixtureNode (sin mutar match)
    const wbFixtureNodes: WBFixtureNode[] = matches.map((item, index) => {
        // Si cambió el parentId, subimos la “ronda”
        if (item.parentId !== previousParentId) {
            currentRank++;
            previousParentId = item.parentId;
        }

        const stageNumber = stages - currentRank + 1;

        // Si cambió la ronda, reseteamos parentRankCounter a 1
        if (stageNumber !== lastStageNumberFromFinal) {
            lastStageNumberFromFinal = stageNumber;
            parentRankCounter = 1;
        }

        // Construimos un nuevo objeto con las props que SÍ tiene FixtureVisualizerMatch
        // (por ejemplo, 'id', 'score', 'participants', etc.),
        // y agregamos las 5 propiedades que definiste en WBFixtureNode.
        const parentRank = parentRankCounter;
        const wbNode: WBFixtureNode = {

            ...item.match,
            stageNumberFromFinal: stageNumber,  // Calculado
            nodeNumber: index + 1,

            parentRank: parentRank,   // Se incrementa por cada item en la ronda
            groupNumber: parentRank           // O la lógica que tú quieras
        };
        parentRankCounter++;

        return wbNode;
    });

    return wbFixtureNodes.filter((m) => m.stageNumberFromFinal >= (fromStage || 0));
}

export function getShortestNameClubInscription(
    clubInscription: ClubInscription | undefined,
    slice: number = 11
) {
    return (
        clubInscription?.tableName ||
        clubInscription?.name ||
        clubInscription?.club?.tableShortName ||
        clubInscription?.club?.tableName ||
        clubInscription?.club?.name ||
        ""
    ).slice(0, slice)
}

export function getShortestNameClub(
    clubInscription: ClubInscription | undefined,
    slice: number = 11
) {
    return (
        clubInscription?.tableName ||
        clubInscription?.club?.tableShortName ||
        clubInscription?.club?.tableName ||
        clubInscription?.club?.name ||
        clubInscription?.name ||
        ""
    ).slice(0, slice)
}

import { Tooltip } from "antd";
import { Flex, Text, Image } from "../../components";
import { FIXTURE_NODE_HEIGHT, FIXTURE_NODE_WIDTH } from "../constants/fixture-measures.constants";
import { type FixtureVisualizerMatch, type TournamentMatch } from "../models/types";
import { getShortestNameClubInscription, SRC_IMG } from "../WbFixture.utils";

/**
 * Props interface for WbFixtureResult component
 * Uses generic types to allow users to pass any data structure that extends the minimum requirements
 */
interface WbFixtureNodeTeamProps<
  TournamentMatchData = any,
  FixtureMatchData = any
> {
  /**
   * Tournament match data - can be any object that extends the minimum required properties:
   * - id: number
   * - scoreHome: number
   * - scoreAway: number
   * - scoreHomePenalty?: number
   * - scoreAwayPenalty?: number
   * - category: { categoryInstance: { name: string } }
   * - matchInfo: { vacancyHome: object | null, vacancyAway: object | null }
   */
  tournamentMatch: TournamentMatch<TournamentMatchData>;

  /**
   * Fixture match data - can be any object that extends the minimum required properties:
   * - id: number
   * - clubHome: { clubInscription: { logo: string, name: string, color: string } } | null
   * - clubAway: { clubInscription: { logo: string, name: string, color: string } } | null
   */
  fixtureMatch: FixtureVisualizerMatch<FixtureMatchData>;
}

/**
 * WbFixtureResult component - displays tournament match results with team information
 * 
 * @example
 * ```tsx
 * // Basic usage with minimum required properties
 * <WbFixtureResult 
 *   tournamentMatch={{
 *     id: 1,
 *     scoreHome: 2,
 *     scoreAway: 1,
 *     category: { categoryInstance: { name: "Final" } },
 *     matchInfo: { vacancyHome: null, vacancyAway: null }
 *   }}
 *   fixtureMatch={{
 *     id: 1,
 *     clubHome: { clubInscription: { logo: "...", name: "Team A", color: "#fff" } },
 *     clubAway: { clubInscription: { logo: "...", name: "Team B", color: "#000" } }
 *   }}
 * />
 * 
 * // Usage with extended data
 * <WbFixtureResult 
 *   tournamentMatch={{
 *     id: 1,
 *     scoreHome: 2,
 *     scoreAway: 1,
 *     customField: "my custom data",
 *     category: { categoryInstance: { name: "Final", customCategoryData: "..." } },
 *     matchInfo: { vacancyHome: null, vacancyAway: null, customMatchInfo: "..." }
 *   }}
 *   fixtureMatch={{
 *     id: 1,
 *     clubHome: { clubInscription: { logo: "...", name: "Team A", color: "#fff", customClubData: "..." } },
 *     clubAway: { clubInscription: { logo: "...", name: "Team B", color: "#000" } },
 *     customFixtureData: "my custom fixture data"
 *   }}
 * />
 * ```
 */
export const WbFixtureResult = <TournamentMatchData = any, FixtureMatchData = any>(
  props: WbFixtureNodeTeamProps<TournamentMatchData, FixtureMatchData>
) => {
  const {
    tournamentMatch
  } = props;


  const showPenalty = (tournamentMatch.scoreHomePenalty !== undefined && tournamentMatch.scoreHomePenalty !== null) ||
    (tournamentMatch.scoreAwayPenalty !== undefined && tournamentMatch.scoreAwayPenalty !== null);
  if (!tournamentMatch) return null;


  return (
    <Flex
      flexDirection="column"
      gap={2}
      px={4}
      py={3}
      borderRadius={12}
      width={FIXTURE_NODE_WIDTH + 10 + "px"}
      height={FIXTURE_NODE_HEIGHT + 20 + "px"}
      maxWidth={"100%"}
    >
      <Text className="text-white text-xs p-0">{tournamentMatch.category?.categoryInstance?.name}</Text>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >

        <Flex
          direction="row"
          alignItems="center"
          className="flex-1 max-w-[80%] text-white transition-all duration-400"
          gap={2}
        >
          {tournamentMatch.clubHome?.clubInscription?.logo ? (
            <>
              <Image
                src={tournamentMatch.clubHome?.clubInscription?.logo || SRC_IMG}
                width={"20px"}
                height={"20px"}
              />
            </>
          ) : (
            <div
              className="block h-4 aspect-square rounded-md"
              style={{
                backgroundColor:
                  tournamentMatch.clubHome?.clubInscription?.color || tournamentMatch.matchInfo.vacancyHome?.color,
              }}
            />
          )}


          <Tooltip
            title={getShortestNameClubInscription(tournamentMatch?.clubHome?.clubInscription) || tournamentMatch.matchInfo.vacancyHome?.name || ""}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
            placement="topLeft"
            trigger="hover"
          >
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {getShortestNameClubInscription(tournamentMatch?.clubHome?.clubInscription) || tournamentMatch.matchInfo.vacancyHome?.name || ""}
            </Text>
          </Tooltip>
        </Flex>
        <div
          className="text-white transition-all duration-400 min-w-[40px] flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1">
            <Text fontWeight="bold" height={6}>{tournamentMatch.scoreHome || 0}</Text>
            {(tournamentMatch.scoreHomePenalty !== undefined && tournamentMatch.scoreHomePenalty !== null) && (
              <Text fontSize="10px" className="text-gray-300">
                ({tournamentMatch.scoreHomePenalty})
              </Text>
            )}
          </div>
        </div>
      </Flex>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"

      >
        <Flex
          direction="row"
          alignItems="center"
          className="flex-1 max-w-[80%] text-white transition-all duration-400"
          gap={2}
        >
          {tournamentMatch.clubAway?.clubInscription?.logo ? (
            <>
              <Image
                src={tournamentMatch.clubAway?.clubInscription?.logo || SRC_IMG}
                width={"20px"}
                height={"20px"}
              />
            </>
          ) : (
            <div
              className="block h-4 aspect-square rounded-md"
              style={{
                backgroundColor:
                  tournamentMatch.clubAway?.clubInscription?.color || tournamentMatch.matchInfo.vacancyAway?.color,
              }}
            />
          )}

          <Tooltip
            title={getShortestNameClubInscription(tournamentMatch.clubAway?.clubInscription) || tournamentMatch.matchInfo.vacancyAway?.name || ""}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
            placement="topLeft"
            trigger="hover"
          >
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {getShortestNameClubInscription(tournamentMatch.clubAway?.clubInscription) || tournamentMatch.matchInfo.vacancyAway?.name || ""}
            </Text>
          </Tooltip>
        </Flex>
        <div
          className="text-white transition-all duration-400 min-w-[40px] flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1">
            <Text fontWeight="bold" height={6}>{tournamentMatch.scoreAway || 0}</Text>
            {(tournamentMatch.scoreAwayPenalty !== undefined && tournamentMatch.scoreAwayPenalty !== null) && (
              <Text fontSize="10px" className="text-gray-300">
                ({tournamentMatch.scoreAwayPenalty})
              </Text>
            )}
          </div>
        </div>
      </Flex>
    </Flex >

  )



};

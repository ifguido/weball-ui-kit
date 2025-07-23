import { Flex, Text, Image, Tooltip } from "@chakra-ui/react";
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
    tournamentMatch,
    fixtureMatch
  } = props;


  const showPenalty = tournamentMatch.scoreHomePenalty !== undefined || tournamentMatch.scoreAwayPenalty !== undefined;

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
          className=" flex-1 max-w-[80%]  text-white  transition-all duration-400 "
          gap={2}
        >
          {fixtureMatch.clubHome?.clubInscription?.logo ? (
            <>
              <Image
                src={fixtureMatch.clubHome?.clubInscription?.logo || SRC_IMG}
                width={"20px"}
                height={"20px"}
              />
            </>
          ) : (
            <div
              className="block h-4 aspect-square rounded-md"
              style={{
                backgroundColor:
                  fixtureMatch.clubHome?.clubInscription?.color || tournamentMatch.matchInfo.vacancyHome?.color,
              }}
            />
          )}


          <Tooltip label={getShortestNameClubInscription(fixtureMatch?.clubHome?.clubInscription) || tournamentMatch.matchInfo.vacancyHome?.name || ""} >
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {getShortestNameClubInscription(fixtureMatch?.clubHome?.clubInscription) || tournamentMatch.matchInfo.vacancyHome?.name || ""}
            </Text>
          </Tooltip>
        </Flex>
        <div
          className="  text-white  transition-all duration-400 w-[20px] flex justify-center gap-[2px] align-middle"
        >
          <Text fontWeight="bold" height={6}>{tournamentMatch.scoreHome || 0}
          </Text>
          <span>{showPenalty ? (<span className="text-[10px]">({tournamentMatch.scoreHomePenalty || 0})</span>) : null}</span>
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
          className=" flex-1 max-w-[80%]  text-white  transition-all duration-400 "
          gap={2}
        >
          {fixtureMatch.clubAway?.clubInscription?.logo ? (
            <>
              <Image
                src={fixtureMatch.clubAway?.clubInscription?.logo || SRC_IMG}
                width={"20px"}
                height={"20px"}
              />
            </>
          ) : (
            <div
              className="block h-4 aspect-square rounded-md"
              style={{
                backgroundColor:
                  fixtureMatch.clubAway?.clubInscription?.color || tournamentMatch.matchInfo.vacancyAway?.color,
              }}
            />
          )}

          <Tooltip label={getShortestNameClubInscription(fixtureMatch.clubAway?.clubInscription) || tournamentMatch.matchInfo.vacancyAway?.name || ""}>
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {getShortestNameClubInscription(fixtureMatch.clubAway?.clubInscription) || tournamentMatch.matchInfo.vacancyAway?.name || ""}
            </Text>
          </Tooltip>
        </Flex>
        <div
          className="  text-white  transition-all duration-400 w-[20px] flex justify-center gap-[2px] align-middle"
        >
          <Text fontWeight="bold" height={6}>{tournamentMatch.scoreAway || 0}</Text>

          <span>{showPenalty ? (<span className="text-[10px]">({tournamentMatch.scoreHomePenalty || 0})</span>) : null}</span>

        </div>
      </Flex>
    </Flex >

  )



};

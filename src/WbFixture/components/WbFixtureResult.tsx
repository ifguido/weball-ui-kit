import { Flex, Text, Image, Tooltip } from "@chakra-ui/react";
import { FIXTURE_NODE_HEIGHT, FIXTURE_NODE_WIDTH } from "../constants/fixture-measures.constants";
import { type FixtureVisualizerMatch, type TournamentMatch } from "../models/types";
import { SRC_IMG } from "../WbFixture.utils";

interface WbFixtureNodeTeamProps {
  tournamentMatch: TournamentMatch;
  fixtureMatch: FixtureVisualizerMatch
}

export const WbFixtureResult = (props: WbFixtureNodeTeamProps) => {
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

          <Tooltip label={fixtureMatch.clubHome?.clubInscription.name || tournamentMatch.matchInfo.vacancyHome?.name || ""}>
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {fixtureMatch.clubHome?.clubInscription?.name || tournamentMatch.matchInfo.vacancyHome?.name || ""}
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

          <Tooltip label={fixtureMatch.clubAway?.clubInscription?.name || tournamentMatch.matchInfo.vacancyAway?.name || ""}>
            <Text
              className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
              fontWeight="bold"
            >
              {fixtureMatch.clubAway?.clubInscription?.name || tournamentMatch.matchInfo.vacancyAway?.name || ""}
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
    </Flex>

  )



};

import { Flex, Text, Image } from "../../components";
import { type WBFixtureNode } from "../models/FixtureNode.interface";
import { useMemo } from "react";
import { getShortestNameClubInscription, SRC_IMG } from "../WbFixture.utils";
import { Tooltip } from "antd";

interface WbFixtureNodeTeamProps {
  local?: boolean;
  match: WBFixtureNode;
  nodeSelected?: boolean;
  onClickMatch: (
    match: Partial<WBFixtureNode>,
    position: "local" | "visit" | "resultLocal" | "resultVisit"
  ) => void;
  editMode?: boolean;
}

export const WbFixtureNodeClub = (props: WbFixtureNodeTeamProps) => {
  const {
    onClickMatch,
    match: visualizerMatch,
    local,
    nodeSelected,
    editMode = false
  } = props;

  const match = visualizerMatch;



  const { clubScore } = useMemo(() => {
    if (!match) return {};

    const hasOnlyOneMAtch = match?.tournamentMatches?.length === 1;
    if (hasOnlyOneMAtch) {
      return {
        clubScore: local ? match?.tournamentMatches?.[0].scoreHome : match?.tournamentMatches?.[0].scoreAway
      }
    }

    return {
      clubScore: local ? match?.valueScoreHome : match.valueScoreAway
    };
  }, [match, local])

  const hasLost = match.teamWon && (local ? match.teamWon?.id !== match.clubHome?.id : match.teamWon?.id !== match.clubAway?.id);
  const club = local ? match.clubHome : match.clubAway;
  const vacancy = local ? match?.vacancyHome : match?.vacancyAway;


  if (!match) return null;

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      style={{
        opacity: nodeSelected ? 1 : hasLost ? 0.5 : 1,
        backgroundColor: nodeSelected ? "gray" : "unset",
      }}
    >
      <Flex
        direction="row"
        alignItems="center"
        className=" flex-1 max-w-[80%] hover:bg-gray-300  transition-all duration-400 "
        gap={2}
        onClick={editMode ? () => onClickMatch(match, local ? "local" : "visit") : undefined}
      >
        {club?.clubInscription?.logo ? (
          <>
            <Image
              src={club?.clubInscription?.logo || SRC_IMG}
              width={"20px"}
              height={"20px"}
            />
          </>
        ) : (
          <div
            className="block h-4 aspect-square rounded-md"
            style={{
              backgroundColor:
                club?.clubInscription?.color || vacancy?.color,
            }}
          />
        )}

        <Tooltip
          title={getShortestNameClubInscription(club?.clubInscription) || vacancy?.name}
          getPopupContainer={() => document.body}
          mouseEnterDelay={0.5}
          placement="top"
          styles={{ root: { zIndex: 9999 } }}
        >
          <Text
            className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis "
            fontWeight="bold"
          >
            {getShortestNameClubInscription(club?.clubInscription) || vacancy?.name || ""}
          </Text>
        </Tooltip>
      </Flex>
      <div
        className={`transition-all duration-400 w-[20px] flex justify-center ${editMode ? "hover:bg-gray-300 cursor-pointer" : "cursor-default"
          }`}
        onClick={editMode ? () => onClickMatch(match, local ? "resultLocal" : "resultVisit") : undefined}
      >
        <Text fontWeight="bold" height={6}>{clubScore}</Text>
      </div>
    </Flex>
  );
};

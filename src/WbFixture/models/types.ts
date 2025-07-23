const tintColorLight = "#2f95dc";

export const WbColors = {
    light: {
        /** @todo gradient */
        primary: "#2EC7A6",
        secondary: "#05BACF",
        text: "#000",
        placeholder: "#0000002F",
        background: "#fff",
        backgroundGrey: "#e9e9e9",
        tint: tintColorLight,
        tabIconDefault: "#ccc",
        tabIconSelected: tintColorLight,
        inputBorder: "#0000001F",
        inputLabel: "#000",
        inputText: "#000000A1",
        helperText: "#000000DE",
        disabled: "#909090",
        error: "#ef5350",
        darkGrey: "#464646",
        grey: "#707070",
        success: "#66bb6a",
        successLight: "#81c784",
        warning: "#ffa726",
        warningLight: "#ffb74d",
    },
    dark: {
        /** @todo gradient */
        primary: "#1BB18B",
        secondary: "#039BA4",
        text: "#FFF",
        placeholder: "#FFFFFF4D",
        background: "#121212",
        backgroundGrey: "#1E1E1E",
        tint: "#4DFFFF", // Adaptación del tintColorLight para dark mode
        tabIconDefault: "#666",
        tabIconSelected: "#4DFFFF", // Manteniendo el contraste para iconos seleccionados
        inputBorder: "#FFFFFF1F",
        inputLabel: "#FFF",
        inputText: "#FFFFFFB3",
        helperText: "#FFFFFFDE",
        disabled: "#5A5A5A",
        error: "#CF4442",
        darkGrey: "#373737",
        grey: "#8A8A8A",
        success: "#4CAF50",
        successLight: "#66BB6A",
        warning: "#FF8A33",
        warningLight: "#FFA54D",
    },
};


export interface TournamentMatch extends WeballBaseEntity {
    label?: string;
    clubHome: TournamentClub | null;
    clubAway: TournamentClub | null;
    clubWon: TournamentClub | null;
    scoreHome: number;
    scoreAway: number;
    scoreHomePenalty?: number;
    scoreAwayPenalty?: number;
    status: CustomStatus;
    matchInfo: TournamentMatchInfo;
    tournament: Tournament;
    category: TournamentCategory;
    phase: FixturePhase;
    fixtureVisualizer: FixtureVisualizer | null;
    instanceUUID: string;
    homeEvents: TournamentMatchEvent[] | null;
    awayEvents: TournamentMatchEvent[] | null;
    refereeReport: string | null;

    /**
     * Agregados desde backend en ciertas circuistancias
     */
    containerItemsId?: number[];

    fixtureVisualizerMatch: FixtureVisualizerMatch;

}

export interface WeballBaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    active: boolean;
}
export interface FixtureVisualizerMatch extends WeballBaseEntity {
    fixtureVisualizer: FixtureVisualizer | null;

    matchDate: string;
    matchTime: string;

    valueScoreAway?: string;
    valueScoreHome?: string;
    teamWon?: TournamentClub | null;
    status?: CustomStatus;

    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;

    vacancyHome: FixtureVacancy | null;
    vacancyAway: FixtureVacancy | null;

    clubHome: TournamentClub | null;
    clubAway: TournamentClub | null;

    orderIndex: number;

    homeAway: boolean;
    neutral: boolean;
    rest: boolean;

    tournamentMatches?: TournamentMatch[];


    instanceUUID: string;
}

export interface TournamentClub extends WeballBaseEntity {
    idx: number;
    tournament?: Tournament;
    clubInscription: ClubInscription;
    instanceUUID: string;
}

export interface FixtureVacancy extends WeballBaseEntity {
    internalId: string;
    name: string;
    color: string;
    instanceUUID: string;
    club?: TournamentClub;
}

export interface Tournament extends WeballBaseEntity {
    name: string;
    segmentationNode: Segmentation;
    competition: Competition;
    tournamentFixture: TournamentFixture;
    categories: TournamentCategory[];
    matches: TournamentMatch[];
    clubs: TournamentClub[];
    instanceUUID: string;
    privacity: Privacity;
    fixedPlayerList: boolean;
    fixedPlayerListPublicOpened: boolean;
    maxFixedPlayerList: number;
    maxYellowCards: number;
    publicLabel?: TournamentPublicLabel;
}
export interface TournamentFixture extends WeballBaseEntity {
    fixturePhases: FixturePhase[];
    fixturePhasesOrder: number[];
    tournament: Tournament;
    type: TournamentFixtureType;
    instanceUUID: string;
}
export enum Visibility {
    VISIBLE = "VISIBLE",
    HIDDEN = "HIDDEN",
}

export enum Privacity {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}
export enum TournamentFixtureType { }


export interface TournamentPublicLabel extends WeballBaseEntity {
    label: string;
    tournament: Tournament;
    instanceUUID: string;
}
export interface FixturePhase extends WeballBaseEntity {
    name: string;
    tournamentFixture: TournamentFixture;
    fixtureVisualizerRoot: FixtureVisualizer[];
    containers: FixtureContainer[];
    vacancies: FixtureVacancy[];
    matches: TournamentMatch[];
    type: FixturePhaseType;
    instanceUUID: string;
    status: "PENDING" | "IN_PROGRESS" | "FINISHED";
    privacity: Privacity;
    startDate?: Date;
    endDate?: Date;
    activePhase?: boolean;
    pointsForWin?: number;
    pointsForDraw?: number;
    pointsForLoss?: number;
}


export interface FixtureVisualizer extends WeballBaseEntity {
    value: string;
    internalId: string;
    parent?: FixtureVisualizer;
    children: FixtureVisualizer[];
    categoryId?: number;
    type: FixtureVisualizerType;
    allowChildren: boolean;
    containerReference: FixtureContainerItem;
    matchesPlanning: FixtureVisualizerMatch[];
    orderMatches: number[];
    orderIndex: number;
    fixturePhase: FixturePhase;
    instanceUUID: string;
}

export interface FixtureContainer {
    id: number;
    items: FixtureContainerItem[];
    fixturePhase: FixturePhase;
    title: string;
    type: string;
    description: string;
}

export interface FixtureContainerItem extends WeballBaseEntity {
    value: string;
    fixtureContainer: FixtureContainer;
    dateStart?: string;
    dateEnd?: string;
}

export enum FixtureVisualizerType {
    Container = "container",
    Root = "root",
}

export enum FixturePhaseType {
    Group = "Group",
    League = "League",
    Cup = "Cup",
    Flex = "Flex",
}


export interface FixtureClasificationGroup extends WeballBaseEntity {
    category: TournamentCategory;
    value: string;
    tournament: Tournament;
    phase: FixturePhase;
    instanceUUID: string;
}
export interface Segmentation extends WeballBaseEntity {
    competition: Competition;
    value: string;
    internalId: string;
    parent?: Segmentation;
    children: Segmentation[];
    orderIndex: number;
    tournament: Tournament;
    seasonId: number;
    instanceUUID: string;
    type: SegmentationType;
}


export enum SegmentationType {
    Element = "element",
    Root = "root",
}
export interface Competition extends WeballBaseEntity {
    name: string;
    logo: string;
    seasonsOrder: number[];
    activeSeasonId: number;
    sponsorOrder: number[];

    private: boolean;
    segmentations: Segmentation[];
    segmentation: Segmentation;
    tournaments: Tournament[];
    privacity: Privacity;
    instanceUUID: string;

    // configuración de planillas
    spreadsheetLeftLogo: string | null;
    spreadsheetRightLogo: string | null;
    spreadsheetRefereesToShow: number | null;
    spreadsheetShowQR: boolean | null;
}

export interface TournamentCategory extends WeballBaseEntity {
    categoryInstance: CategoryInstance;
    tournament: Tournament;
    instanceUUID: string;
}

export enum TOURNAMENT_MATCH_EVENT {
    GOAL = "goal",
    YELLOW = "yellow",
    RED = "red",
    DOBLE_YELLOW = "dobleYellow",
    PENALTY_DEFINITION = "penalty",
}

export type TournamentMatchEventType = TOURNAMENT_MATCH_EVENT;

export type TournamentMatchEventSourceType = TOURNAMENT_MATCH_EVENT;

export interface TournamentMatchEvent extends WeballBaseEntity {

    manualPlayer?: {
        name: string;
        lastName: string;
        dni: string;
        message: string;
    };
    match?: TournamentMatch;
    matchId?: number;
    tournamentId?: number;
    categoryId?: number;
    clubInscriptionId?: number;
    competitionId?: number;
    penaltyGoals?: number;
    goals: number;
    red: boolean;
    yellow: number;
    doubleYellow: boolean;
    tournament: Tournament;
    club: TournamentClub;
}
export interface CategoryInstance extends WeballBaseEntity {
    name: string;
    internalName: string;
    segmentationCriteria: string;
    dateStart: string;
    dateEnd: string;
    minAge: number;
    maxAge: number;
    gender: string;
    discipline?: Discipline;
    instanceUUID: string;
    labels: string[];
    showPersonLogo?: boolean;
}
export interface Discipline extends WeballBaseEntity {
    name: string;
    description?: string;
    categories?: CategoryInstance[];
}
export interface ClubInscription extends WeballBaseEntity {
    logo: string;
    name: string;
    color: string;
    tableName?: string;
    tableShortName?: string;


    instanceUUID: string;
    club: Club;
}

export interface Club extends WeballBaseEntity {
    name: string;
    color: string;
    logo: string;
    tableName: string;
    tableShortName: string;
    foundationDate: string;
    clubInscription: ClubInscription[];
    instanceUUID?: string;
    allowChangesByInstance: boolean;
}

export interface TournamentMatchInfo extends WeballBaseEntity {
    matchDate: string; // Fecha del partido específica
    matchTime: string; // Hora del partido específica
    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;
    customStatus?: string;
    matchNotes?: string;
    formUrl?: string;
    vacancyHome: FixtureVacancy | null;
    vacancyAway: FixtureVacancy | null;
    homeAway: boolean;
    neutral: boolean;
    rest: boolean;
    match: TournamentMatch | null;

    refereeInformSent: boolean | null;
    refereeInformUrl: string | null;
    spreadsheetPhotos: string[] | null;
    refereeInformNotRequired: boolean | null;
}
export interface CustomStatus extends WeballBaseEntity {
    label: string;
    color: string;

    publicLabel: string;
    publicColor: string;

    description: string;

    canUpdateResultsByReferee: boolean | null;
    refereeCanSend: boolean | null;

    shouldApplyReds: boolean;
    shouldAddToTablePosition: boolean;
    shouldShowSheets: boolean;

    finalized: boolean;
    instanceUUID: string;
}
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

// ========================================
// FLEXIBLE BASE TYPES - MINIMUM REQUIRED PROPERTIES
// ========================================

/**
 * Base entity with minimum required properties
 * Users can extend this with any additional properties they need
 */
export interface WeballBaseEntity {
    id: number;
}

/**
 * Minimum required properties for club inscription
 * Users can pass objects with additional properties
 */
export interface MinClubInscription {
    logo: string;
    name: string;
    color: string;
}

/**
 * Minimum required properties for fixture vacancy
 * Users can pass objects with additional properties
 */
export interface MinFixtureVacancy {
    name: string;
    color: string;
}

/**
 * Minimum required properties for category instance
 * Users can pass objects with additional properties
 */
export interface MinCategoryInstance {
    name: string;
}

// ========================================
// FLEXIBLE GENERIC TYPES
// ========================================

/**
 * Generic club inscription type that accepts any object extending minimum requirements
 */
export type ClubInscription<T = {}> = WeballBaseEntity & MinClubInscription & T;

/**
 * Generic tournament club type that accepts any object extending minimum requirements
 */
export type TournamentClub<T = {}, U = {}> = WeballBaseEntity & {
    clubInscription: ClubInscription<U>;
} & T;

/**
 * Generic fixture vacancy type that accepts any object extending minimum requirements
 */
export type FixtureVacancy<T = {}> = WeballBaseEntity & MinFixtureVacancy & T;

/**
 * Generic category instance type that accepts any object extending minimum requirements
 */
export type CategoryInstance<T = {}> = WeballBaseEntity & MinCategoryInstance & T;

/**
 * Generic tournament match info type that accepts any object extending minimum requirements
 */
export type TournamentMatchInfo<T = {}, U = {}, V = {}> = WeballBaseEntity & {
    vacancyHome: FixtureVacancy<U> | null;
    vacancyAway: FixtureVacancy<V> | null;
} & T;

/**
 * Generic tournament category type that accepts any object extending minimum requirements
 */
export type TournamentCategory<T = {}, U = {}> = WeballBaseEntity & {
    categoryInstance: CategoryInstance<U>;
} & T;

/**
 * Generic tournament match type that accepts any object extending minimum requirements
 */
export type TournamentMatch<T = {}, U = {}, V = {}, W = {}> = WeballBaseEntity & {
    scoreHome: number;
    scoreAway: number;
    scoreHomePenalty?: number;
    scoreAwayPenalty?: number;
    category: TournamentCategory<U, V>;
    matchInfo: TournamentMatchInfo<W>;
} & T;

/**
 * Generic fixture visualizer match type that accepts any object extending minimum requirements
 */
export type FixtureVisualizerMatch<T = {}, U = {}, V = {}, W = {}, X = {}, Y = {}> = WeballBaseEntity & {
    fixtureVisualizer: FixtureVisualizer<any> | null;
    valueScoreAway?: string;
    valueScoreHome?: string;
    teamWon?: TournamentClub<U> | null;
    vacancyHome: FixtureVacancy<V> | null;
    vacancyAway: FixtureVacancy<W> | null;
    clubHome: TournamentClub<X> | null;
    clubAway: TournamentClub<Y> | null;
    tournamentMatches?: TournamentMatch<any>[];
} & T;

/**
 * Generic fixture visualizer type that accepts any object extending minimum requirements
 */
export type FixtureVisualizer<T = {}> = WeballBaseEntity & {
    children: FixtureVisualizer<any>[];
    matchesPlanning: FixtureVisualizerMatch<any>[];
} & T;

/**
 * Helper function to convert an array of fixtures into a FixtureVisualizer object
 * 
 * @param fixtures - Array of fixture data
 * @param options - Optional configuration
 * @returns FixtureVisualizer object
 * 
 * @example
 * ```typescript
 * const fixtures = [/* your fixture array *\/];
 * const fixtureRoot = createFixtureRoot(fixtures);
 * 
 * // Use in your component:
 * // <WbFixture fixtureVisualizerRoot={fixtureRoot} />
 * ```
 */
export function createFixtureRoot<T = any>(
    fixtures: T[], 
    options: { id?: number; matchesPlanning?: FixtureVisualizerMatch<any>[] } = {}
): FixtureVisualizer<{ fixtures: T[] }> {
    return {
        id: options.id ?? 1,
        children: [],
        matchesPlanning: options.matchesPlanning ?? [],
        fixtures
    };
}

// ========================================
// LEGACY INTERFACES FOR BACKWARD COMPATIBILITY
// ========================================

/**
 * @deprecated Use the generic types above for better flexibility
 */
export interface Club extends WeballBaseEntity {
    name: string;
    color: string;
    logo: string;
    tableName: string;
    tableShortName: string;
    clubInscription: ClubInscription[];
}
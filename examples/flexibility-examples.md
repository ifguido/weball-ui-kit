# Ejemplos de Flexibilidad de Tipos - Weball UI Kit

Este documento muestra diferentes formas de usar **weball-ui-kit** con datos de diversas fuentes y estructuras.

## 🔧 Principio Fundamental

Los componentes de **weball-ui-kit** requieren **propiedades mínimas** pero aceptan **cualquier estructura de datos** que las contenga.

## 📝 Propiedades Mínimas Requeridas

### Para FixtureVisualizer:
```typescript
{
  id: number;
  children: FixtureVisualizer[];
  matchesPlanning: FixtureVisualizerMatch[];
}
```

### Para ClubInscription:
```typescript
{
  id: number;
  logo: string;
  name: string;
  color: string;
}
```

### Para TournamentClub:
```typescript
{
  id: number;
  clubInscription: ClubInscription;
}
```

## 💻 Ejemplos Prácticos

### Ejemplo 1: Datos desde una API REST

```typescript
// Tu API devuelve esto:
const apiResponse = {
  tournament_id: 123,
  tournament_name: "Champions League 2024",
  status: "active",
  created_at: "2024-01-15",
  updated_at: "2024-03-20",
  settings: {
    allow_extra_time: true,
    penalty_shootouts: true
  },
  children: [],
  matches: [
    {
      match_id: 456,
      home_team: {
        team_id: 789,
        team_details: {
          team_name: "FC Barcelona",
          team_logo: "https://api.example.com/logos/barca.png",
          primary_color: "#004d98",
          // Datos adicionales de tu API
          founded_year: 1899,
          stadium: "Camp Nou",
          country: "Spain",
          league: "La Liga"
        }
      },
      away_team: {
        team_id: 101,
        team_details: {
          team_name: "Real Madrid",
          team_logo: "https://api.example.com/logos/madrid.png",
          primary_color: "#ffffff",
          founded_year: 1902,
          stadium: "Santiago Bernabéu",
          country: "Spain",
          league: "La Liga"
        }
      },
      // Datos adicionales del partido
      scheduled_date: "2024-04-15T20:00:00Z",
      venue: "Camp Nou",
      referee: "Antonio Mateu Lahoz",
      attendance: 99354
    }
  ]
};

// Mapea tus datos al formato mínimo requerido:
const fixtureData = {
  id: apiResponse.tournament_id,
  children: apiResponse.children,
  matchesPlanning: apiResponse.matches.map(match => ({
    id: match.match_id,
    clubHome: {
      id: match.home_team.team_id,
      clubInscription: {
        id: match.home_team.team_id,
        name: match.home_team.team_details.team_name,
        logo: match.home_team.team_details.team_logo,
        color: match.home_team.team_details.primary_color
      }
    },
    clubAway: {
      id: match.away_team.team_id,
      clubInscription: {
        id: match.away_team.team_id,
        name: match.away_team.team_details.team_name,
        logo: match.away_team.team_details.team_logo,
        color: match.away_team.team_details.primary_color
      }
    },
    // ✨ Conserva todos tus datos adicionales
    ...match
  })),
  // ✨ Conserva todos tus datos adicionales
  ...apiResponse
};

// ¡Listo para usar!
<WbFixture fixtureVisualizerRoot={fixtureData} />
```

### Ejemplo 2: Datos desde GraphQL

```typescript
// Tu query GraphQL devuelve esto:
const graphqlData = {
  getTournament: {
    __typename: "Tournament",
    id: "tournament_123",
    name: "UEFA Champions League",
    season: "2024-25",
    format: "KNOCKOUT",
    region: "EUROPE",
    sponsor: "Mastercard",
    children: [],
    fixtures: [
      {
        __typename: "Fixture",
        id: "fixture_456",
        round: "FINAL",
        status: "SCHEDULED",
        venue: {
          name: "Wembley Stadium",
          city: "London",
          capacity: 90000
        },
        homeClub: {
          __typename: "Club",
          id: "club_789",
          profile: {
            displayName: "Manchester City",
            logoUrl: "https://graphql.api.com/logos/city.svg",
            primaryColor: "#6CABDD",
            founded: 1880,
            country: "England",
            league: {
              name: "Premier League",
              tier: 1
            }
          }
        },
        awayClub: {
          __typename: "Club", 
          id: "club_101",
          profile: {
            displayName: "Inter Milan",
            logoUrl: "https://graphql.api.com/logos/inter.svg",
            primaryColor: "#0068B5",
            founded: 1908,
            country: "Italy",
            league: {
              name: "Serie A",
              tier: 1
            }
          }
        },
        broadcastInfo: {
          networks: ["CBS", "ESPN"],
          languages: ["en", "es", "it"]
        }
      }
    ]
  }
};

// Mapea tus datos GraphQL:
const fixtureData = {
  id: parseInt(graphqlData.getTournament.id.split('_')[1]),
  children: graphqlData.getTournament.children,
  matchesPlanning: graphqlData.getTournament.fixtures.map(fixture => ({
    id: parseInt(fixture.id.split('_')[1]),
    clubHome: {
      id: parseInt(fixture.homeClub.id.split('_')[1]),
      clubInscription: {
        id: parseInt(fixture.homeClub.id.split('_')[1]),
        name: fixture.homeClub.profile.displayName,
        logo: fixture.homeClub.profile.logoUrl,
        color: fixture.homeClub.profile.primaryColor
      }
    },
    clubAway: {
      id: parseInt(fixture.awayClub.id.split('_')[1]),
      clubInscription: {
        id: parseInt(fixture.awayClub.id.split('_')[1]),
        name: fixture.awayClub.profile.displayName,
        logo: fixture.awayClub.profile.logoUrl,
        color: fixture.awayClub.profile.primaryColor
      }
    },
    // ✨ Mantén toda la estructura GraphQL
    ...fixture
  })),
  // ✨ Mantén todos los metadatos del torneo
  ...graphqlData.getTournament
};

<WbFixture fixtureVisualizerRoot={fixtureData} />
```

### Ejemplo 3: Datos desde Firebase/Firestore

```typescript
// Tu documento de Firestore:
const firestoreDoc = {
  tournamentId: "tournament_abc123",
  title: "Copa América 2024",
  organizer: "CONMEBOL",
  startDate: firebase.firestore.Timestamp.fromDate(new Date('2024-06-01')),
  endDate: firebase.firestore.Timestamp.fromDate(new Date('2024-07-15')),
  location: {
    country: "Argentina",
    cities: ["Buenos Aires", "Córdoba", "Mendoza"]
  },
  prizePool: {
    currency: "USD",
    amount: 10000000
  },
  children: [],
  matchSchedule: [
    {
      matchId: "match_def456",
      round: "final",
      scheduledTime: firebase.firestore.Timestamp.fromDate(new Date('2024-07-15T21:00:00')),
      homeTeam: {
        teamId: "team_arg",
        teamInfo: {
          fullName: "Selección Argentina",
          shortName: "ARG",
          flagUrl: "https://firebase.example.com/flags/argentina.png",
          jerseyColor: "#74ACDF",
          // Datos específicos de selecciones
          confederation: "CONMEBOL",
          fifaRanking: 1,
          coachName: "Lionel Scaloni",
          captain: "Lionel Messi"
        }
      },
      visitorTeam: {
        teamId: "team_bra",
        teamInfo: {
          fullName: "Seleção Brasileira",
          shortName: "BRA", 
          flagUrl: "https://firebase.example.com/flags/brazil.png",
          jerseyColor: "#FFDA00",
          confederation: "CONMEBOL",
          fifaRanking: 3,
          coachName: "Dorival Júnior",
          captain: "Casemiro"
        }
      },
      statistics: {
        prediction: {
          homeWin: 45,
          draw: 25,
          awayWin: 30
        },
        weather: {
          temperature: 15,
          condition: "clear",
          humidity: 60
        }
      }
    }
  ],
  // Metadatos de Firestore
  createdAt: firebase.firestore.Timestamp.now(),
  updatedAt: firebase.firestore.Timestamp.now(),
  createdBy: "admin_user_123"
};

// Mapea tus datos de Firebase:
const fixtureData = {
  id: parseInt(firestoreDoc.tournamentId.split('_')[1], 36), // Convert string to number
  children: firestoreDoc.children,
  matchesPlanning: firestoreDoc.matchSchedule.map(match => ({
    id: parseInt(match.matchId.split('_')[1], 36),
    clubHome: {
      id: match.homeTeam.teamId.split('_')[1].charCodeAt(0), // Creative ID generation
      clubInscription: {
        id: match.homeTeam.teamId.split('_')[1].charCodeAt(0),
        name: match.homeTeam.teamInfo.fullName,
        logo: match.homeTeam.teamInfo.flagUrl,
        color: match.homeTeam.teamInfo.jerseyColor
      }
    },
    clubAway: {
      id: match.visitorTeam.teamId.split('_')[1].charCodeAt(0),
      clubInscription: {
        id: match.visitorTeam.teamId.split('_')[1].charCodeAt(0),
        name: match.visitorTeam.teamInfo.fullName,
        logo: match.visitorTeam.teamInfo.flagUrl,
        color: match.visitorTeam.teamInfo.jerseyColor
      }
    },
    // ✨ Preserva todos los datos de Firebase
    ...match,
    // Convierte Timestamps si es necesario
    scheduledTime: match.scheduledTime.toDate().toISOString()
  })),
  // ✨ Preserva metadatos del torneo
  ...firestoreDoc,
  startDate: firestoreDoc.startDate.toDate().toISOString(),
  endDate: firestoreDoc.endDate.toDate().toISOString(),
  createdAt: firestoreDoc.createdAt.toDate().toISOString(),
  updatedAt: firestoreDoc.updatedAt.toDate().toISOString()
};

<WbFixture fixtureVisualizerRoot={fixtureData} />
```

## 🎯 Consejos Clave

1. **Mapea solo lo mínimo**: Solo transforma las propiedades que no coinciden con los nombres esperados
2. **Preserva datos adicionales**: Usa el spread operator (`...`) para mantener todos tus datos personalizados
3. **Type Safety**: TypeScript te avisará si faltan propiedades requeridas
4. **Reutilizable**: Crea funciones de mapeo reutilizables para diferentes fuentes de datos

## 🔗 Funciones de Mapeo Reutilizables

```typescript
// Función helper para APIs REST
function mapRestApiToFixture(apiData: any) {
  return {
    id: apiData.tournament_id,
    children: apiData.children || [],
    matchesPlanning: (apiData.matches || []).map(match => ({
      id: match.match_id,
      clubHome: {
        id: match.home_team.team_id,
        clubInscription: {
          id: match.home_team.team_id,
          name: match.home_team.team_details.team_name,
          logo: match.home_team.team_details.team_logo,
          color: match.home_team.team_details.primary_color
        }
      },
      clubAway: {
        id: match.away_team.team_id,
        clubInscription: {
          id: match.away_team.team_id,
          name: match.away_team.team_details.team_name,
          logo: match.away_team.team_details.team_logo,
          color: match.away_team.team_details.primary_color
        }
      },
      ...match
    })),
    ...apiData
  };
}

// Función helper para GraphQL
function mapGraphQLToFixture(graphqlData: any) {
  const tournament = graphqlData.getTournament;
  return {
    id: parseInt(tournament.id.split('_')[1]),
    children: tournament.children || [],
    matchesPlanning: (tournament.fixtures || []).map(fixture => ({
      id: parseInt(fixture.id.split('_')[1]),
      clubHome: {
        id: parseInt(fixture.homeClub.id.split('_')[1]),
        clubInscription: {
          id: parseInt(fixture.homeClub.id.split('_')[1]),
          name: fixture.homeClub.profile.displayName,
          logo: fixture.homeClub.profile.logoUrl,
          color: fixture.homeClub.profile.primaryColor
        }
      },
      clubAway: {
        id: parseInt(fixture.awayClub.id.split('_')[1]),
        clubInscription: {
          id: parseInt(fixture.awayClub.id.split('_')[1]),
          name: fixture.awayClub.profile.displayName,
          logo: fixture.awayClub.profile.logoUrl,
          color: fixture.awayClub.profile.primaryColor
        }
      },
      ...fixture
    })),
    ...tournament
  };
}

// Uso:
const fixtureFromRest = mapRestApiToFixture(apiResponse);
const fixtureFromGraphQL = mapGraphQLToFixture(graphqlResponse);

<WbFixture fixtureVisualizerRoot={fixtureFromRest} />
<WbFixture fixtureVisualizerRoot={fixtureFromGraphQL} />
```

¡Con esta flexibilidad, **weball-ui-kit** se adapta a cualquier backend o fuente de datos que uses! 🚀

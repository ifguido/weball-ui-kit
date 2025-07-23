# Ejemplo de Modo de Edición - Weball UI Kit

Este ejemplo demuestra cómo usar el prop `editMode` para controlar la capacidad de editar resultados en los fixtures.

## 🔧 Modo Solo Lectura (Predeterminado)

```tsx
import { WbFixture, WeballUIProvider } from '@weball/ui-kit';

const fixtureData = {
  id: 1,
  children: [],
  matchesPlanning: [
    {
      id: 1,
      clubHome: {
        id: 1,
        clubInscription: {
          id: 1,
          logo: 'https://example.com/team-a.png',
          name: 'Equipo A',
          color: '#ff0000'
        }
      },
      clubAway: {
        id: 2,
        clubInscription: {
          id: 2,
          logo: 'https://example.com/team-b.png',
          name: 'Equipo B',
          color: '#0000ff'
        }
      },
      tournamentMatches: [
        {
          id: 1,
          scoreHome: 2,
          scoreAway: 1,
          category: { categoryInstance: { name: 'Final' } },
          matchInfo: { vacancyHome: null, vacancyAway: null }
        }
      ]
    }
  ]
};

function ReadOnlyExample() {
  return (
    <WeballUIProvider>
      {/* Por defecto, editMode es false */}
      <WbFixture fixtureVisualizerRoot={fixtureData} />
      
      {/* Explícitamente en modo solo lectura */}
      <WbFixture 
        fixtureVisualizerRoot={fixtureData} 
        editMode={false}
      />
    </WeballUIProvider>
  );
}
```

## ✏️ Modo de Edición Habilitado

```tsx
import { WbFixture, WeballUIProvider } from '@weball/ui-kit';
import { useState } from 'react';

function EditModeExample() {
  const [fixtureData, setFixtureData] = useState({
    id: 1,
    children: [],
    matchesPlanning: [
      {
        id: 1,
        clubHome: {
          id: 1,
          clubInscription: {
            id: 1,
            logo: 'https://example.com/team-a.png',
            name: 'Equipo A',
            color: '#ff0000'
          }
        },
        clubAway: {
          id: 2,
          clubInscription: {
            id: 2,
            logo: 'https://example.com/team-b.png',
            name: 'Equipo B',
            color: '#0000ff'
          }
        },
        tournamentMatches: [
          {
            id: 1,
            scoreHome: 2,
            scoreAway: 1,
            category: { categoryInstance: { name: 'Final' } },
            matchInfo: { vacancyHome: null, vacancyAway: null }
          }
        ]
      }
    ]
  });

  const handleResultSaved = (fixtureId, scoreHome, scoreAway) => {
    console.log('Actualizando resultado:', { fixtureId, scoreHome, scoreAway });
    
    // Actualizar el estado local
    setFixtureData(prevData => ({
      ...prevData,
      matchesPlanning: prevData.matchesPlanning.map(match => 
        match.id === fixtureId
          ? {
              ...match,
              tournamentMatches: match.tournamentMatches?.map(tm => ({
                ...tm,
                scoreHome,
                scoreAway
              }))
            }
          : match
      )
    }));

    // Opcional: Enviar a una API
    // await fetch('/api/fixtures', {
    //   method: 'PUT',
    //   body: JSON.stringify({ fixtureId, scoreHome, scoreAway })
    // });
  };

  return (
    <WeballUIProvider>
      <WbFixture 
        fixtureVisualizerRoot={fixtureData} 
        editMode={true}
        onResultSaved={handleResultSaved}
      />
    </WeballUIProvider>
  );
}
```

## 🔄 Comparación Visual

### Modo Solo Lectura:
- ❌ No se puede hacer clic en los marcadores
- ❌ No aparecen efectos hover en los resultados
- ❌ No se abre modal de edición
- ✅ Interfaz limpia para solo visualización

### Modo de Edición:
- ✅ Marcadores son clickeable (cursor pointer)
- ✅ Efectos hover en los marcadores
- ✅ Modal de edición al hacer clic
- ✅ Callback `onResultSaved` para manejar cambios

## 🚀 Casos de Uso

### Para aplicaciones web públicas:
```tsx
<WbFixture 
  fixtureVisualizerRoot={data} 
  editMode={false} // Solo visualización
/>
```

### Para paneles de administración:
```tsx
<WbFixture 
  fixtureVisualizerRoot={data} 
  editMode={userRole === 'admin'} // Edición según rol
  onResultSaved={saveToDatabase}
/>
```

### Para modo desarrollo/testing:
```tsx
<WbFixture 
  fixtureVisualizerRoot={data} 
  editMode={process.env.NODE_ENV === 'development'}
/>
```

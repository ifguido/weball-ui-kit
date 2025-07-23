# @weball/ui-kit

Una librería de componentes React para aplicaciones deportivas que incluye componentes flexibles para la visualización de fixtures y torneos.

[![npm version](https://badge.fury.io/js/@weball%2Fui-kit.svg)](https://badge.fury.io/js/@weball%2Fui-kit)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Instalación

```bash
npm install @weball/ui-kit
# o
yarn add @weball/ui-kit
# o
pnpm add @weball/ui-kit
```

### Dependencias Peer (Requeridas)
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion antd react react-dom
```

## ✨ Características

- ✅ **Flexibilidad Máxima**: Acepta cualquier estructura de datos que contenga las propiedades mínimas
- ✅ **TypeScript**: Completamente tipado con genéricos flexibles
- ✅ **Provider integrado**: Incluye ChakraProvider con tema Weball personalizado
- ✅ **Tree-shakeable**: Solo importa lo que necesitas
- ✅ **Documentación**: Storybook integrado y ejemplos de uso
- ✅ **Compatibilidad Universal**: Funciona con REST APIs, GraphQL, Firebase, etc.

## 📦 Componentes Disponibles

### WbFixture
Componente principal para mostrar fixtures de torneos con todas las funcionalidades.

### WbFixtureSymmetrical  
Variante simétrica del componente fixture para layouts balanceados.

### WbFixtureNode
Nodo individual de un fixture para uso granular.

### WeballUIProvider
Proveedor que envuelve ChakraProvider con el tema Weball personalizado.

### createFixtureRoot
Función helper para convertir arrays de fixtures en el formato esperado por los componentes.

## 🎯 Uso Básico

### Trabajando con Arrays de Datos

Si tienes un array de datos de fixtures, usa la función `createFixtureRoot`:

```jsx
import { WbFixture, WeballUIProvider, createFixtureRoot } from '@weball/ui-kit';

function App() {
  const fixturesArray = [
    // Tu array de datos de fixtures
    { /* datos del fixture */ }
  ];

  const fixtureRoot = createFixtureRoot(fixturesArray);

  return (
    <WeballUIProvider>
      <WbFixture fixtureVisualizerRoot={fixtureRoot} />
    </WeballUIProvider>
  );
}
```

### Opción 1: Con Provider Integrado (Recomendado)

```jsx
import { WbFixture, WeballUIProvider } from '@weball/ui-kit';

function App() {
  return (
    <WeballUIProvider>
      <WbFixture />
    </WeballUIProvider>
  );
}
```

### Opción 2: Con Tu Propio ChakraProvider

```jsx
import { ChakraProvider } from '@chakra-ui/react';
import { WbFixture } from 'weball-ui-kit';

function App() {
  return (
    <ChakraProvider>
      <WbFixture />
    </ChakraProvider>
  );
}
```

### Modo de Edición

El componente incluye un prop `editMode` que controla si los usuarios pueden editar los resultados de los partidos:

```jsx
import { WbFixture, WeballUIProvider } from 'weball-ui-kit';

function App() {
  const handleResultSaved = (fixtureId, scoreHome, scoreAway) => {
    console.log('Resultado guardado:', { fixtureId, scoreHome, scoreAway });
    // Aquí puedes actualizar tu estado o enviar a una API
  };

  return (
    <WeballUIProvider>
      {/* Modo solo lectura (por defecto) */}
      <WbFixture 
        fixtureVisualizerRoot={fixtureData} 
        editMode={false}
      />
      
      {/* Modo de edición habilitado */}
      <WbFixture 
        fixtureVisualizerRoot={fixtureData} 
        editMode={true}
        onResultSaved={handleResultSaved}
      />
    </WeballUIProvider>
  );
}
```

**Características del modo de edición:**
- `editMode={false}` (por defecto): Solo visualización, no se pueden editar resultados
- `editMode={true}`: Permite hacer clic en los marcadores para editarlos
- Cuando está habilitado, aparece un cursor pointer y efectos hover en los resultados
- Se abre un modal para editar el marcador cuando se hace clic en un resultado

### Uso con Props Personalizadas

```jsx
import { WbFixture, WeballUIProvider } from 'weball-ui-kit';

const fixtureData = {
  id: 1,
  name: 'Copa del Mundo',
  children: [],
  matchesPlanning: [
    {
      id: 1,
      clubHome: {
        id: 1,
        clubInscription: {
          id: 1,
          logo: 'https://example.com/team-a-logo.png',
          name: 'Equipo A',
          color: '#ff0000'
        }
      },
      clubAway: {
        id: 2,
        clubInscription: {
          id: 2,
          logo: 'https://example.com/team-b-logo.png',
          name: 'Equipo B',
          color: '#0000ff'
        }
      }
    }
  ]
};

function App() {
  return (
    <WeballUIProvider>
      <WbFixture fixtureVisualizerRoot={fixtureData} />
    </WeballUIProvider>
  );
}
```

## 🔧 Flexibilidad de Tipos

Una de las características más poderosas de **weball-ui-kit** es su flexibilidad de tipos. Puedes pasar cualquier estructura de datos que contenga **como mínimo** las propiedades requeridas:

### ✨ Ejemplo con Datos Mínimos

```tsx
import { WbFixture, WeballUIProvider } from 'weball-ui-kit';

// Solo las propiedades mínimas requeridas
const minimalData = {
  id: 1,
  children: [],
  matchesPlanning: [
    {
      id: 1,
      clubHome: {
        id: 1,
        clubInscription: {
          id: 1,
          logo: 'https://example.com/logo.png',
          name: 'Equipo A',
          color: '#ff0000'
        }
      },
      clubAway: {
        id: 2,
        clubInscription: {
          id: 2,
          logo: 'https://example.com/logo.png',
          name: 'Equipo B',
          color: '#0000ff'
        }
      }
    }
  ]
};

<WbFixture fixtureVisualizerRoot={minimalData} />
```

### 🚀 Ejemplo con Datos Extendidos

```tsx
// Puedes agregar cualquier propiedad adicional a tus datos
const extendedData = {
  id: 1,
  children: [],
  matchesPlanning: [
    {
      id: 1,
      // Propiedades mínimas requeridas
      clubHome: {
        id: 1,
        clubInscription: {
          id: 1,
          logo: 'https://example.com/logo.png',
          name: 'Barcelona FC',
          color: '#004d98'
        }
      },
      clubAway: {
        id: 2,
        clubInscription: {
          id: 2,
          logo: 'https://example.com/logo.png',
          name: 'Real Madrid',
          color: '#ffffff'
        }
      },
      // ✨ Propiedades adicionales personalizadas
      customMatchData: {
        stadium: 'Camp Nou',
        attendance: 99354,
        weather: 'sunny',
        referee: 'John Doe'
      },
      analytics: {
        possession: { home: 65, away: 35 },
        shots: { home: 12, away: 8 }
      },
      broadcastInfo: {
        network: 'ESPN',
        commentators: ['John Smith', 'Jane Doe']
      }
    }
  ],
  // ✨ Propiedades adicionales del torneo
  tournamentMetadata: {
    season: '2024-25',
    region: 'Europe',
    format: 'knockout',
    prize: '€50M'
  },
  customSettings: {
    theme: 'dark',
    showStats: true,
    animationSpeed: 'fast'
  }
};

<WbFixture fixtureVisualizerRoot={extendedData} />
```

### 💡 Ventajas de esta Flexibilidad

1. **Compatibilidad**: Funciona con cualquier API o base de datos existente
2. **Extensibilidad**: Agrega campos personalizados sin problemas
3. **Type Safety**: TypeScript garantiza que tengas las propiedades mínimas
4. **Escalabilidad**: Adapta los datos según crezcan tus necesidades
```

## 🎨 Tema Personalizado

El `WeballUIProvider` incluye un tema personalizado de Weball. Si quieres extenderlo:

```jsx
import { WeballUIProvider } from 'weball-ui-kit';

const customTheme = {
  colors: {
    brand: {
      500: '#tu-color-personalizado',
    },
  },
};

function App() {
  return (
    <WeballUIProvider theme={customTheme}>
      <WbFixture />
    </WeballUIProvider>
  );
}
```

## 📚 Documentación Interactiva

Ejecuta Storybook para explorar todos los componentes:

```bash
npm run storybook
```

Esto abrirá una interfaz interactiva en `http://localhost:6006` donde puedes explorar todos los componentes, sus props y casos de uso.

## 🛠️ Desarrollo

### Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Construir la librería
npm run build

# Verificar tipos
npm run type-check

# Ejecutar Storybook
npm run storybook

# Construir Storybook para producción
npm run build-storybook
```

### Estructura del Proyecto

```
weball-ui-kit/
├── src/
│   ├── WeballUIProvider.tsx     # Provider con tema Weball
│   ├── WbFixture/              # Componentes de fixtures
│   │   ├── index.ts
│   │   ├── WbFixture.tsx
│   │   ├── WbFixtureSymmetrical.tsx
│   │   ├── WbFixtureNode.tsx
│   │   └── models/
│   │       └── types.ts        # Tipos TypeScript optimizados
│   └── index.ts               # Exportaciones principales
├── .storybook/                # Configuración de Storybook
├── dist/                      # Build de la librería
└── stories/                   # Historias de Storybook
```

## 📋 Peer Dependencies

Esta librería requiere las siguientes dependencias en tu proyecto:

```json
{
  "react": ">=18.0.0",
  "@chakra-ui/react": ">=2.0.0",
  "@emotion/react": ">=11.0.0",
  "@emotion/styled": ">=11.0.0",
  "framer-motion": ">=6.0.0"
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por el equipo de Weball
      />
    </WeballUIProvider>
  );
}

export default App;
```

The WeballUIProvider automatically includes ChakraProvider with a custom Weball theme, so you don't need to install or configure Chakra UI separately.

### WBFixture Component

The main component for displaying tournament brackets.

#### Props

- `fixtureVisualizerRoot?: FixtureVisualizer` - The root fixture data
- `cupWinner?: Club` - The tournament winner information
- `cupLogo?: string` - URL to the cup/tournament logo
- `onClickNode?: (match, position) => void` - Callback when a match node is clicked
- `onResultSaved?: (id, scoreHome, scoreAway) => void` - Callback when a result is saved
- `nodeSelected?: FixtureVisualizer` - Currently selected node
- `viewFromStage?: number` - Starting stage for visualization

### WeballUIProvider Component

A provider component that wraps your app with necessary providers for Weball UI Kit.

#### Props

- `children: React.ReactNode` - Your application components
- `theme?: Record<string, any>` - Optional custom Chakra UI theme (defaults to Weball theme)

#### Example with custom theme

```tsx
import { WeballUIProvider, WbFixture } from 'weball-ui-kit';
import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    },
  },
});

function App() {
  return (
    <WeballUIProvider theme={customTheme}>
      <WbFixture {...props} />
    </WeballUIProvider>
  );
}
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start Storybook: `npm run dev`
4. Build the library: `npm run build`

### Scripts

- `npm run dev` - Start Storybook development server
- `npm run build` - Build the library for distribution
- `npm run build:watch` - Build in watch mode
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions and support, please open an issue on the GitHub repository.

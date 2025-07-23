# WbFixture

## Modo de uso

 ```html
<WbFixture fixtureNodes={fixtureNodes} cupWinner={cupWinner} cupLogo={cupLogo} />
 ```

 ```html
<WbFixtureSymmetrical fixtureNodes={fixtureNodes} cupWinner={cupWinner} cupLogo={cupLogo} />
 ```
 
 ```ts
/**
 Esto es lo mínimo que se necesita para su uso:
[{
    stageNumberFromFinal: 3,
    groupNumber: 1
}]

 Un array con 1 sólo objeto que tenga stageNumberFromFinal y groupNumber.
*/

/**
    @param fixtureNodes
    @type FixtureNode[]
    @required
*/
const fixtureNodes = [
    {
        /** 
            @param stageNumberFromFinal
            @type number
            @required
            El número del stage empezando por el nodo "Final".
            Final = 1
            Semi Final = 2
            (...) = n
        */
        stageNumberFromFinal: 4,

        /** 
            @param groupNumber
            @type number
            @required
            La posición del nodo en un stage, siendo 1 el de más arriba (debe existir un objeto con groupNumber en 1 dentro de los que tienen mayor stageNumberFromFinal)
         */
        groupNumber: 1,


        /** Propiedades de WBMatchesType (ajustar a necesidad) */

        /**
            @param local
            @type Team
            @optional
        */
        local: {
            id: 1,
            name: 'Boca',
            logo: SRC_IMAGE,
            abbreviatedName: 'BOC'
        },
        /**
            @param visitor
            @type Team
            @optional
        */
        visitor: {
            id: 2,
            name: 'River',
            logo: SRC_IMAGE,
            abbreviatedName: 'RIV'
        },
        /**
            @param results
            @type Team
            @optional
        */
        results: {
            localGoals: 2,
            visitorGoals: 0
        }
    }
];

/** 
@param cupWinner
@type Team
@optional
 */
const cupWinner = {
    id: 1,
    name: 'Boca',
    logo: SRC_IMAGE,
    abbreviatedName: 'BOC'
}

/** 
@param cupLogo
@type string (image src)
@optional
 */
const cupLogo = "https://weball.me/image.jpg";
 ```
- Si no se le pasa results a un nodo, se lo tomará como un partido aún no jugado pero con equipos definidos.

- Si no se le pasa algún team se lo dejará vacío el nombre del equipo.

- Si no se le pasa un nodo, dejando que lo complete el componente, se lo armará como un si fuese un stage futuro, sin definición de equipos ni resultados.

- Si posee resultados, el componente ``WbFixtureNode`` calcula qué equipo ganó y al perdedor lo pinta más claro.

A partir del stageNumberFromFinal más alto en el array se va calculando los nodos que se van a visualizar.

Si se quiere cambiar el contenido de los nodos, se debe cambiar en ``WbFixtureNodeTeam``. Si se viera afectada las dimensiones, ajustar las medidas en ``constants/fixture-measures.constants.ts``.

Se puede tener infinita cantidad de stages, sólo se debe indicar el stageNumberFromFinal que se desee. Para que tenga sus labels se deben seguir agregando los nombres de los stages en el array de ``constants/fixture-stages.constants.ts``.

El contenedor del fixture calcula el width y height justo para los nodos y todo lo demás. Queda fuera de su responsabilidad los márgenes que se le quieran agregar.
Sugerencia de uso:

```html
<View className="m-2">
    <WbFixture fixtureNodes={fixtureNodes}>
</View>
```

#
## Funcionamiento de WbFixture
#
  
El primer ``useEffect`` calcula los nodos ``refNodes`` (los rectángulos con los partidos), las llaves, ``refBraces``, que conectan los nodos de un mismo stage, las líneas, ``refLines``, que es la línea que conecta el centro de la llave con el nodo del siguiente stage y los textos de los stages ``refStages``.

El segundo ``useEffect`` calcula el posicionamiento dentro del div de los componentes antes mencionados, además de los componentes que acompañan al nodo Final, que son el nombre del stage **refFinalStage** y el que indica el equipo ganador **refWinner**.

En este último ``useEffect`` se calcula (pasos explicado según cómo se va iterando y entrando en los if):
1. En el *if* del <b><u>segundo *if-else*</u></b>, se calcula la posición de los nodos raíces. Las primera iteraciones van a caer todas en este if.
2. En el <b><u>cuarto *if-else*</u></b> el *if* va calculando dónde empieza la llave (centro derecha del nodo de índice par) y el else cierra la llave  (centro derecha del nodo de índice impar) y coloca la línea en el centro de la llave.
3. En el *else* del <b><u>segundo *if-else*</u></b>, calcula la posición de los nodos no raíces, basándose en la ubicación de la línea anterior. 
4. En el <b><u>primer *if*</u> </b>, se calcula la posición del label del stage que va en la parte inferior de los nodos del stage, basándose en la ubicación del último nodo del stage. Se ingresa a este if al cambiar de stage.
5. En el <b><u>tercer *if*</u></b>, se calcula la posición del label de stage que va en la parte superior de los nodos del stage, basándose en la posición del primer nodo del stage. Se ingresa a este if si se cambió de stage.
6. En el <b><u>quinto y último *if*</u></b>, se calcula la posición del nombre del stage y el nodo ganador según la posición del último nodo.

#
## Funcionamiento de WbFixtureSymmetrical
#

Este componente parte de la misma base de WbFixture, con las siguientes salvedades:

1. Hay dos ``for`` en vez de 1 en el segundo ``useEffect``.
2. El <b><u>primer *for*</u></b> es igual que el WbFixture. Calcula la posición de los nodos con las raíces a la izquierda. 
3. El <b><u>segundo *for*</u></b> , hace lo mismo pero con los nodos de la derecha. Calculando primero la posición de las raíces desde el final del componente (previamente calculado).
4. Para posicionar los nodos el cálculo es sobre ***stages - 1***. El nodo final, y los componentes que la acompañan, se calculan por fuera de las iteraciones.
5. Debido a que hay llaves (antes ``refBraces``) ahora son distintas (con la apertura a la derecha, ``refLessBraces``, o a la izquierda, ``refGreaterBraces``), éstas ya no coinciden con el número de ``refLines``, sino que equivale a ***linesQuantity - 1***.
6. En el primer ``useEffect``, se itera y calcula el nodeNumber para cada uno de los nodos, este es sobre el total de los nodos (desde 1 a N, siendo N la cantidad total de nodos), dependiendo del order de visualización de los nodos, de arriba a abajo y de izquierda a derecha. 
/**
 * Implementação de um grafo não pesado para representar o sistema do Metro de Lisboa
 * Utiliza uma estrutura de lista de adjacências para armazenar as conexões entre estações
 */

// Importando os dados das estações e das linhas
import { stationMappings } from './stationMappings';
import { lines } from './staticData';
import TinyQueue from 'tinyqueue';

/**
 * Interface para representar um nó do grafo (uma estação)
 */
export interface GraphNode {
  id: string; // ID da estação (ex: "SS" para São Sebastião)
  lines: string[]; // Linhas que passam pela estação
  adjacent: string[]; // IDs das estações adjacentes
}

/**
 * Interface para representar um segmento de caminho formatado para UI
 */
export interface PathSegment {
  tipo: 'viagem' | 'transbordo';
  de: string;
  para: string;
  linha?: string;
  tempo: number;
  estacoes: number;
}

/**
 * Interface para representar o resultado formatado para UI
 */
export interface FormattedPath {
  segments: PathSegment[];
  transbordos: number;
  tempoTotal: number;
  estacoes: number;
}

/**
 * Classe que representa o Grafo do Metro de Lisboa
 */
export class MetroGraph {
  private nodes: Map<string, GraphNode>;
  
  constructor() {
    this.nodes = new Map();
    this.buildGraph();
  }
  
  /**
   * Constrói o grafo a partir dos dados estáticos do metro
   */
  private buildGraph(): void {
    // Primeiro, criar todos os nós (estações)
    for (const [id, station] of Object.entries(stationMappings)) {
      this.nodes.set(id, {
        id,
        lines: Array.isArray(station.lines) ? station.lines : [station.lines],
        adjacent: []
      });
    }
    
    // Agora, adicionar as arestas (conexões entre estações)
    for (const lineName of Object.keys(lines)) {
      const stations = lines[lineName].stations;
      
      // Para cada par de estações consecutivas na linha, adicionar conexão
      for (let i = 0; i < stations.length - 1; i++) {
        const current = stations[i];
        const next = stations[i+1];
        
        // Adicionar conexão em ambas as direções (grafo não direcionado)
        this.addEdge(current, next);
        this.addEdge(next, current);
      }
    }
  }
  
  /**
   * Adiciona uma aresta entre dois nós do grafo
   */
  private addEdge(from: string, to: string): void {
    const node = this.nodes.get(from);
    if (node && !node.adjacent.includes(to)) {
      node.adjacent.push(to);
    }
  }
  
  /**
   * Retorna todos os nós do grafo
   */
  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }
  
  /**
   * Obtém um nó específico pelo seu ID
   */
  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }
  
  /**
   * Retorna os vizinhos de um nó
   */
  getNeighbors(id: string): GraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    
    return node.adjacent
      .map(adjId => this.nodes.get(adjId))
      .filter((node): node is GraphNode => node !== undefined);
  }
  
  /**
   * Verifica se dois nós são adjacentes
   */
  areAdjacent(id1: string, id2: string): boolean {
    const node = this.nodes.get(id1);
    return node ? node.adjacent.includes(id2) : false;
  }
  
  
  /**
   * Encontra o caminho mais curto entre duas estações usando uma variação do algoritmo de Dijkstra
   * que penaliza as trocas de linha com um custo adicional.
   * 
   * @param fromId ID da estação de origem
   * @param toId ID da estação de destino
   * @returns Um objeto contendo o caminho, informações detalhadas
   */
  shortestPath(fromId: string, toId: string): string[] {
   const distances = new Map<string, [number, string[]]>(); // [distância, linhas[]]
   const previous = new Map<string, string[] | null>;
   const visited = new Set<string>();
   // Queue with priority based on distance [distance, nodeId]
   const queue = new TinyQueue<[number, string]>([], (a, b) => a[0] - b[0]);

   for (const node of this.nodes.values()) {
     distances.set(node.id, [Infinity, ['']]); // [distância, linha]
     previous.set(node.id, null);
   }

   distances.set(fromId, [0, this.nodes.get(fromId)!.lines]); // [distância, linha]
   queue.push([0, fromId]);

   while (queue.length > 0) {
      const [currentDistance, currentId] = queue.pop()!;
      const currentNode = this.nodes.get(currentId);

      if (!currentNode || visited.has(currentId)) continue;
      visited.add(currentId);

      if (currentId === toId) {
         break;
      }

      for (const neighbor of currentNode.adjacent) {
         // There is at max one line in common between the two stations
         const commonLine = this.nodes.get(neighbor)!.lines.filter(line => distances.get(currentId)![1].includes(line));
         const weight = commonLine.length > 0 ? 1 : 3; // Penaliza troca de linha
         const newDistance = currentDistance + weight;
         if (newDistance < distances.get(neighbor)![0]) {
            distances.set(neighbor, [newDistance, commonLine]);
            previous.set(neighbor, [currentId]);
            queue.push([newDistance, neighbor]);
         } else if (newDistance === distances.get(neighbor)![0]) {	
            // Se a distância for a mesma, adiciona as linhas e os predecessores
            const existingLines = distances.get(neighbor)![1];
            const newLines = [...existingLines, ...commonLine.filter(line => !existingLines.includes(line))];
            distances.set(neighbor, [newDistance, newLines]);
            previous.set(neighbor, [...previous.get(neighbor)!, currentId]);
         }
      }
   }

   // Recupera o caminho mais curto
   const path: string[] = [];
   let currentNodeId = toId;

   while (currentNodeId !== fromId) {
      const prev = previous.get(currentNodeId)!;
      path.unshift(currentNodeId);
      currentNodeId = prev[0]; // Pega o primeiro predecessor
   }

   // Adicionar a estação de origem ao início do caminho
   path.unshift(fromId);

   // Existe sempre um caminho entre as estações, então não precisamos verificar se o caminho é vazio
   return path;
  }
  
  /**
   * Formata o caminho para exibição na UI, agrupando por linhas e identificando trocas de linha
   * 
   * @param path Array de IDs das estações no caminho
   * @param tempoEstacaoMin Tempo estimado em minutos para viagem entre estações (padrão: 2)
   * @param tempoTransbordoMin Tempo estimado em minutos para transbordo (padrão: 4)
   * @returns Um objeto contendo segmentos de viagem e informações para UI
   */
  formatPathForUI(path: string[], tempoEstacaoMin: number = 2, tempoTransbordoMin: number = 4): FormattedPath {
    // Se não há caminho ou só tem uma estação, retornar vazio
    if (!path || path.length === 0) {
      return { segments: [], transbordos: 0, tempoTotal: 0, estacoes: 0 };
    }
    
    if (path.length === 1) {
      return { 
        segments: [], 
        transbordos: 0, 
        tempoTotal: 0, 
        estacoes: 0 
      };
    }
    
    // Processar o caminho manualmente
    return this.processPathManually(path, tempoEstacaoMin, tempoTransbordoMin);
  }
  
  /**
   * Processa manualmente o caminho para exibição na UI quando não temos informações de segmentos
   * 
   * @param path Array com IDs de estações no caminho
   * @param tempoEstacaoMin Tempo estimado em minutos para viagem entre estações
   * @param tempoTransbordoMin Tempo estimado em minutos para transbordo
   * @returns Objeto formatado com segmentos e informações para UI
   */
  private processPathManually(
    path: string[],
    tempoEstacaoMin: number,
    tempoTransbordoMin: number
  ): FormattedPath {
    const segments: PathSegment[] = [];
    let transbordos = 0;
    
    // Precisamos determinar a linha para cada parte do percurso
    let currentLine = '';
    let segmentStartIdx = 0;
    
    // Para cada par de estações no caminho, determinar a linha mais apropriada
    for (let i = 0; i < path.length - 1; i++) {
      const currentId = path[i];
      const nextId = path[i + 1];
      
      const currentNode = this.nodes.get(currentId)!;
      const nextNode = this.nodes.get(nextId)!;
      
      // Encontrar linha em comum (se existir)
      const commonLines = currentNode.lines.filter(line => nextNode.lines.includes(line));
      const lineBetweenStations = commonLines.length > 0 ? commonLines[0] : '';
      
      // Se mudar de linha ou for a primeira iteração, definir a linha atual
      if (i === 0 || lineBetweenStations !== currentLine) {
        // Se não for a primeira iteração, finalizar o segmento atual
        if (i > 0) {
          // Adicionar segmento de viagem
          const segmentStart = this.nodes.get(path[segmentStartIdx])!;
          const segmentEnd = this.nodes.get(path[i])!;
          const stationCount = i - segmentStartIdx + 1;
          
          // Obter os nomes das estações do stationMappings
          const startName = stationMappings[segmentStart.id]?.name || segmentStart.id;
          const endName = stationMappings[segmentEnd.id]?.name || segmentEnd.id;
          
          segments.push({
            tipo: 'viagem',
            de: startName,
            para: endName,
            linha: currentLine,
            tempo: (stationCount - 1) * tempoEstacaoMin, // -1 porque contamos conexões, não estações
            estacoes: stationCount
          });
          
          // Se mudou de linha, adicionar transbordo
          if (lineBetweenStations !== currentLine) {
            transbordos++;
            segments.push({
              tipo: 'transbordo',
              de: currentLine,
              para: lineBetweenStations,
              tempo: tempoTransbordoMin,
              estacoes: 0
            });
          }
          
          // Iniciar novo segmento
          segmentStartIdx = i;
        }
        
        currentLine = lineBetweenStations;
      }
      
      // Para o último par de estações
      if (i === path.length - 2) {
        const segmentStart = this.nodes.get(path[segmentStartIdx])!;
        const segmentEnd = this.nodes.get(nextId)!;
        const stationCount = (i + 1) - segmentStartIdx + 1;
        
        // Obter os nomes das estações do stationMappings
        const startName = stationMappings[segmentStart.id]?.name || segmentStart.id;
        const endName = stationMappings[segmentEnd.id]?.name || segmentEnd.id;
        
        segments.push({
          tipo: 'viagem',
          de: startName,
          para: endName,
          linha: currentLine,
          tempo: (stationCount - 1) * tempoEstacaoMin,
          estacoes: stationCount
        });
      }
    }
    
    // Calcular tempo total e número de estações
    const tempoTotal = segments.reduce((total, segment) => total + segment.tempo, 0);
    const estacoes = segments
      .filter(segment => segment.tipo === 'viagem')
      .reduce((total, segment) => total + segment.estacoes, 0) - transbordos; // Corrigir contagem duplicada
    
    return {
      segments,
      transbordos,
      tempoTotal,
      estacoes
    };
  }
  
  /**
   * Encontra todas as estações onde é possível fazer trocas de linha
   */
  getTransferStations(): GraphNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.lines.length > 1);
  }
  
  /**
   * Retorna todas as estações de uma linha específica
   */
  getStationsByLine(lineName: string): GraphNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.lines.includes(lineName));
  }
  
  /**
   * Encontra todas as estações terminais (com apenas uma estação adjacente)
   */
  getTerminalStations(): GraphNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.adjacent.length === 1);
  }
}

// Exporta uma instância já inicializada do grafo para uso em toda a aplicação
export const metroGraph = new MetroGraph();


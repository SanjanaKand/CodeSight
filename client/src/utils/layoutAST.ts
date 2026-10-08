import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 190;
const NODE_HEIGHT = 80;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 100;

export function layoutAST(nodes: Node[], edges: Edge[]): Node[] {
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  // Build parent-child relationships from the edges
  edges.forEach((edge) => {
    const children = childrenMap.get(edge.source) ?? [];
    children.push(edge.target);
    childrenMap.set(edge.source, children);

    parentMap.set(edge.target, edge.source);
  });

  // Calculate the width needed by each subtree
  const subtreeWidths = new Map<string, number>();

  function calculateWidth(nodeId: string): number {
    const children = childrenMap.get(nodeId) ?? [];

    if (children.length === 0) {
      subtreeWidths.set(nodeId, NODE_WIDTH);
      return NODE_WIDTH;
    }

    const childrenWidth = children.reduce(
      (total, childId) => total + calculateWidth(childId),
      0
    );

    const gapsWidth = (children.length - 1) * HORIZONTAL_GAP;
    const width = Math.max(NODE_WIDTH, childrenWidth + gapsWidth);

    subtreeWidths.set(nodeId, width);
    return width;
  }

  // Find the root node
  const root = nodes.find((node) => !parentMap.has(node.id));

  if (!root) {
    return nodes;
  }

  calculateWidth(root.id);

  // Assign positions recursively
  const positionedNodes = new Map<string, Node>();

  function positionNode(nodeId: string, left: number, depth: number) {
    const node = nodes.find((node) => node.id === nodeId);

    if (!node) return;

    const subtreeWidth = subtreeWidths.get(nodeId) ?? NODE_WIDTH;

    positionedNodes.set(nodeId, {
      ...node,
      position: {
        x: left + (subtreeWidth - NODE_WIDTH) / 2,
        y: depth * (NODE_HEIGHT + VERTICAL_GAP),
      },
    });

    const children = childrenMap.get(nodeId) ?? [];
    let childLeft = left;

    children.forEach((childId) => {
      const childWidth = subtreeWidths.get(childId) ?? NODE_WIDTH;

      positionNode(childId, childLeft, depth + 1);
      childLeft += childWidth + HORIZONTAL_GAP;
    });
  }

  positionNode(root.id, 0, 0);

  return nodes.map((node) => positionedNodes.get(node.id) ?? node);
}
import type { Node, Edge } from "@xyflow/react";

export interface ASTNode {
  type: string;
  name?: string;
  value?: string | number | boolean;
  children?: ASTNode[];
}

export interface ASTGraph {
  nodes: Node[];
  edges: Edge[];
}

export function transformAST(ast: ASTNode): ASTGraph {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let nodeCounter = 0;

  function visit(
    current: ASTNode,
    parentId: string | null = null,
    depth = 0,
    index = 0
  ) {
    const id = `ast-${nodeCounter++}`;

    const label =
      current.name !== undefined
        ? `${current.type}: ${current.name}`
        : current.value !== undefined
        ? `${current.type}: ${current.value}`
        : current.type;

    nodes.push({
      id,
      type: "astNode",
      position: {
        x: index * 220,
        y: depth * 150,
      },
      data: {
        label,
        astType: current.type,
        value: current.value,
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${id}`,
        source: parentId,
        target: id,
      });
    }

    current.children?.forEach((child, childIndex) => {
      visit(child, id, depth + 1, childIndex);
    });
  }

  visit(ast);

  return { nodes, edges };
}
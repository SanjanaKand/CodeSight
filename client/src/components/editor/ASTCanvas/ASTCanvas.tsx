import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import ASTNode from "./ASTNode";
import {
  transformAST,
  type ASTNode as ASTData,
} from "../../../utils/astTransformer";

import { layoutAST } from "../../../utils/layoutAST";

interface ASTCanvasProps {
  ast?: ASTData;
}

const nodeTypes = {
  astNode: ASTNode,
};

const sampleAST: ASTData = {
  type: "Program",
  children: [
    {
      type: "VariableDeclaration",
      children: [
        {
          type: "VariableDeclarator",
          children: [
            {
              type: "Identifier",
              name: "age",
            },
            {
              type: "NumericLiteral",
              value: 20,
            },
          ],
        },
      ],
    },
  ],
};

export default function ASTCanvas({ ast = sampleAST }: ASTCanvasProps) {
  const graph = transformAST(ast);

  const nodes: Node[] = layoutAST(
    graph.nodes,
    graph.edges
  );

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
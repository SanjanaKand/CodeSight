import { Handle, Position, type NodeProps } from "@xyflow/react";
import { getNodeStyle } from "../../../utils/nodeStyles";

interface ASTNodeData {
  label: string;
  astType?: string;
  value?: string | number | boolean;
}

export default function ASTNode({ data }: NodeProps) {
  const nodeData = data as unknown as ASTNodeData;

  return (
    <div style={getNodeStyle(nodeData.astType)}>
      <Handle
        type="target"
        position={Position.Top}
      />

      <div>{nodeData.label}</div>

      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}
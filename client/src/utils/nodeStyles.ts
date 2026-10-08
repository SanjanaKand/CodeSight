import type { CSSProperties } from "react";

export function getNodeStyle(astType?: string): CSSProperties {
  const baseStyle: CSSProperties = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#1e293b",
    minWidth: "150px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: 500,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
  };

  switch (astType) {
    case "Program":
      return {
        ...baseStyle,
        fontWeight: 700,
      };

    case "VariableDeclaration":
      return {
        ...baseStyle,
        fontWeight: 600,
      };

    case "VariableDeclarator":
      return {
        ...baseStyle,
      };

    case "Identifier":
      return {
        ...baseStyle,
      };

    case "NumericLiteral":
      return {
        ...baseStyle,
      };

    case "StringLiteral":
      return {
        ...baseStyle,
      };

    case "BooleanLiteral":
      return {
        ...baseStyle,
      };

    case "FunctionDeclaration":
      return {
        ...baseStyle,
        fontWeight: 700,
      };

    case "CallExpression":
      return {
        ...baseStyle,
        fontWeight: 600,
      };

    case "BinaryExpression":
      return {
        ...baseStyle,
        fontWeight: 600,
      };

    default:
      return baseStyle;
  }
}
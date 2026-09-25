import tree_sitter_python as ts_python
import tree_sitter_javascript as ts_javascript
import tree_sitter_typescript as ts_typescript
import tree_sitter_cpp as ts_cpp
import tree_sitter_java as ts_java
import tree_sitter_go as ts_go
import tree_sitter_rust as ts_rust

from tree_sitter import Language, Parser, Query, QueryCursor


LANGUAGE_CONFIG = {
    "python": {
        "language": Language(ts_python.language()),
        "query": """
            (function_definition
                name: (identifier) @function_name
            )
            (class_definition
                name: (identifier) @class_name
            )
        """
    },

    "javascript": {
        "language": Language(ts_javascript.language()),
        "query": """
            (function_declaration
                name: (identifier) @function_name
            )
            (method_definition
                name: (property_identifier) @function_name
            )
            (class_declaration
                name: (identifier) @class_name
            )
        """
    },

    "typescript": {
        "language": Language(ts_typescript.language_typescript()),
        "query": """
            (function_declaration
                name: (identifier) @function_name
            )
            (method_definition
                name: (property_identifier) @function_name
            )
            (class_declaration
                name: (type_identifier) @class_name
            )
        """
    },

    "cpp": {
    "language": Language(ts_cpp.language()),
    "query": """
        (function_definition
            declarator: (function_declarator
                declarator: [
                    (identifier) @function_name
                    (field_identifier) @function_name
                ]
            )
        )
        (class_specifier
            name: (type_identifier) @class_name
        )
        (struct_specifier
            name: (type_identifier) @class_name
        )
    """
},

    "java": {
        "language": Language(ts_java.language()),
        "query": """
            (method_declaration
                name: (identifier) @function_name
            )
            (class_declaration
                name: (identifier) @class_name
            )
        """
    },

    "go": {
        "language": Language(ts_go.language()),
        "query": """
            (function_declaration
                name: (identifier) @function_name
            )
            (method_declaration
                name: (field_identifier) @function_name
            )
            (type_spec
                name: (type_identifier) @class_name
            )
        """
    },

    "rust": {
    "language": Language(ts_rust.language()),
    "query": """
        (function_item
            name: (identifier) @function_name
        )
        (struct_item
            name: (type_identifier) @class_name
        )
    """
}
    
}


def get_declaration_node(node, language: str, declaration_type: str):
    """
    Returns the enclosing declaration node for a captured name node.

    Example:

        function_definition
        └── identifier   <-- captured node

    This function returns the function_definition node.
    """

    current = node

    while current is not None:
        if current.type == declaration_type:
            return current

        current = current.parent

    return node


def node_position(node):
    """
    Converts a Tree-sitter node position into the API schema format.
    """

    return {
        "row": node.start_point.row,
        "column": node.start_point.column
    }


def node_end_position(node):
    """
    Converts a Tree-sitter node end position into the API schema format.
    """

    return {
        "row": node.end_point.row,
        "column": node.end_point.column
    }


def get_declaration_type(language: str, node, declaration_kind: str):
    """
    Determines the declaration node type for each supported language.

    This is kept separate because different languages use different
    Tree-sitter grammar node names.
    """

    if language == "python":

        if declaration_kind == "function":
            return "function_definition"

        if declaration_kind == "class":
            return "class_definition"

    elif language in ("javascript", "typescript"):

        if declaration_kind == "function":
            parent_types = {
                "function_declaration",
                "method_definition"
            }

            current = node

            while current is not None:
                if current.type in parent_types:
                    return current.type

                current = current.parent

        if declaration_kind == "class":
            return "class_declaration"

    elif language == "cpp":

        if declaration_kind == "function":
            return "function_definition"

        if declaration_kind == "class":
            current = node

            while current is not None:
                if current.type in (
                    "class_specifier",
                    "struct_specifier"
                ):
                    return current.type

                current = current.parent

    elif language == "java":

        if declaration_kind == "function":
            return "method_declaration"

        if declaration_kind == "class":
            return "class_declaration"

    elif language == "go":

        if declaration_kind == "function":
            current = node

            while current is not None:
                if current.type in (
                    "function_declaration",
                    "method_declaration"
                ):
                    return current.type

                current = current.parent

        if declaration_kind == "class":
            return "type_spec"

    elif language == "rust":

        if declaration_kind == "function":
            return "function_item"

        if declaration_kind == "class":
            current = node

            while current is not None:
                if current.type in (
                    "struct_item",
                    "enum_item"
                ):
                    return current.type

                current = current.parent

    return node.type


def get_declaration_node_for_kind(
    node,
    language: str,
    declaration_kind: str
):
    """
    Finds the actual enclosing declaration node.
    """

    declaration_types = {

        "python": {
            "function": {
                "function_definition"
            },
            "class": {
                "class_definition"
            }
        },

        "javascript": {
            "function": {
                "function_declaration",
                "method_definition"
            },
            "class": {
                "class_declaration"
            }
        },

        "typescript": {
            "function": {
                "function_declaration",
                "method_definition"
            },
            "class": {
                "class_declaration"
            }
        },

        "cpp": {
            "function": {
                "function_definition"
            },
            "class": {
                "class_specifier",
                "struct_specifier"
            }
        },

        "java": {
            "function": {
                "method_declaration"
            },
            "class": {
                "class_declaration"
            }
        },

        "go": {
            "function": {
                "function_declaration",
                "method_declaration"
            },
            "class": {
                "type_spec"
            }
        },

        "rust": {
            "function": {
                "function_item"
            },
            "class": {
                "struct_item",
                "enum_item"
            }
        }
    }

    allowed_types = declaration_types.get(
        language,
        {}
    ).get(
        declaration_kind,
        set()
    )

    current = node

    while current is not None:

        if current.type in allowed_types:
            return current

        current = current.parent

    return node


def execute_parse(code: str, language: str):

    lang_key = language.lower()

    if lang_key not in LANGUAGE_CONFIG:
        raise ValueError(
            f"Unsupported language: {language}. "
            f"Supported: {list(LANGUAGE_CONFIG.keys())}"
        )

    config = LANGUAGE_CONFIG[lang_key]

    active_language = config["language"]

    source_bytes = code.encode("utf-8")

    parser = Parser(active_language)

    tree = parser.parse(source_bytes)

    if tree is None or tree.root_node is None:
        raise RuntimeError(
            "Failed to parse source code."
        )

    root_node = tree.root_node

    query = Query(
        active_language,
        config["query"]
    )

    cursor = QueryCursor(query)

    captures = cursor.captures(root_node)

    function_nodes = captures.get(
        "function_name",
        []
    )

    class_nodes = captures.get(
        "class_name",
        []
    )

    function_names = []
    function_details = []

    class_names = []
    class_details = []

    # -----------------------------------------
    # Functions
    # -----------------------------------------

    for node in function_nodes:

        func_name = source_bytes[
            node.start_byte:node.end_byte
        ].decode("utf-8")

        declaration_node = get_declaration_node_for_kind(
            node,
            lang_key,
            "function"
        )

        function_names.append(
            func_name
        )

        function_details.append(
            {
                "name": func_name,

                "node_type": declaration_node.type,

                "start": node_position(
                    declaration_node
                ),

                "end": node_end_position(
                    declaration_node
                ),
            }
        )

    # -----------------------------------------
    # Classes
    # -----------------------------------------

    for node in class_nodes:

        class_name = source_bytes[
            node.start_byte:node.end_byte
        ].decode("utf-8")

        declaration_node = get_declaration_node_for_kind(
            node,
            lang_key,
            "class"
        )

        class_names.append(
            class_name
        )

        class_details.append(
            {
                "name": class_name,

                "node_type": declaration_node.type,

                "start": node_position(
                    declaration_node
                ),

                "end": node_end_position(
                    declaration_node
                ),
            }
        )

    return {
        "language": lang_key,

        "syntax_tree_type": root_node.type,

        "has_syntax_errors": root_node.has_error,

        "functions_found": function_names,

        "function_details": function_details,

        "classes_found": class_names,

        "class_details": class_details,
    }
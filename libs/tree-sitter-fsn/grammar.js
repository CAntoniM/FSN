
module.exports = grammar({
    name: 'fsn',

    //Comments and whitespace treated as extras
    extras: $ => [/\s|\\\r?\n/, $.comment],

    rules: {
        source_file: $ => repeat($.defintion),

        //TODO: Pull out doc comments and treat them seperatly so we can pass that through to the user
        comment: $ => choice(
                seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
                seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
        ),

        // ================= Key Words =========================================
        struct_keyword: $ => field("keyword", "struct"),
        interface_keyword: $ => field("keyword", "interface"),
        namespace_keyword: $ => field("keyword", "namespace"),
        template_keyword: $ => field("keyword", "template"),
        enum_keyword: $ => field("keyword", "enum"),
        spread_operator: $ => field("operator","..."),

        // =============== Types/Litterals ==================================

        identifier: _ => /[a-zA-Z_][\w_]*/,

        litteral: $ => choice(
            $.int_literal,
            $.string_literal,
            $.char_literal,
            $.bool_literal,
        ),

        int_literal: $ => choice(
            $.deciaml_literal,
            $.hex_literal,
            $.octet_literal,
            $.floating_literal
        ),

        deciaml_literal: $ => seq(
            choice("1", "2", "3", "4", "5", "6", "7", "8", "9"),
            repeat(choice("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"))
        ),

        hex_literal: $ => seq(
            "0x",
            repeat1(choice("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "e", "f"))
        ),

        octet_literal: $ => seq(
            "0",
            repeat(choice("0", "1", "2", "3", "4", "5", "6", "7"))
        ),

        floating_literal: $ => seq($.deciaml_literal, ".", $.deciaml_literal),

        escape_sequence: _ => token(
            prec(
                1,
                seq(
                '\\',
                choice(
                    /[^xuU]/,
                    /\d{2,3}/,
                    /x[0-9a-fA-F]{2,}/,
                    /u[0-9a-fA-F]{4}/,
                    /U[0-9a-fA-F]{8}/,
                ),
                ),
            ),
        ),

        string_literal: $ => seq(
            '"',
            repeat(
            choice(
                alias(token.immediate(prec(1, /[^\\"\n]+/)), $.string_content),
                $.escape_sequence,
            ),
            ),
            '"',
        ),

        char_literal: $ => seq(
            "'",
            repeat1(
                choice(
                $.escape_sequence,
                alias(token.immediate(/[^\n']/), $.character),
                ),
            ),
            "'",
        ),

        bool_literal: $ => choice(
            "true", "false"
        ),

        type_ref: $ => seq(
            choice(
                $.template_type_ref,
                $.standard_type_ref,
            ),
            optional($.sequence_specifier),
        ),

        template_type_ref: $ => seq(
            $.scoped_name,
            "<",
            $.type_ref,
            repeat(seq(",", $.type_ref)),
            ">"
        ),

        standard_type_ref: $ => seq($.scoped_name),

        scoped_name: $ => choice(
            $.identifier,
            seq('::', $.identifier),
            seq($.scoped_name, '::', $.identifier),
        ),

        defintion: $ => choice(
            $.struct_forward_def,
            $.struct_def,
            $.interface_def,
            $.interface_forward_def,
            $.namespace_def,
            $.enum_def
        ),

        template_def: $ => seq($.template_keyword, "<", $.identifier, repeat(seq(",", $.identifier)), ">"),

        namespace_def: $ => seq(
            $.namespace_keyword,
            $.identifier,
            "{",
            repeat($.defintion),
            "}"
        ),

        struct_forward_def: $ => seq(
            $.struct_keyword,
            field("name", $.identifier),
            ";"
        ),

        struct_def: $ => seq(
            optional($.template_def),
            $.struct_keyword,
            field("name", $.identifier),
            "{",
            $.member,
            repeat(seq(",",$.member)),
            "}",
        ),

        sequence_specifier: $ => seq(
            "["
            ,choice(
                $.deciaml_literal,
                $.spread_operator
            ),
            "]"
        ),

        member: $ => seq(
            $.identifier,
            ":",
            $.type_ref,
            optional(seq("=", $.litteral)),
        ),

        interface_forward_def: $ => seq(
            $.interface_keyword,
            field("name", $.identifier),
            ";"
        ),

        interface_def: $ => seq(
            optional($.template_def),
            $.interface_keyword,
            field("name", $.identifier),
            optional(seq(":", $.interface_inheritance_params)),
            "{",
            repeat($.operation_def),
            "}"
        ),

        interface_inheritance_params: $ => seq(
            $.scoped_name,
            repeat(
                seq(",", $.scoped_name)
            ),
        ),

        operation_def: $ => seq(
            
            field("name", $.identifier),
            "(",
            optional(
                $.operation_params
            ),
            ")",
            optional(
                seq("->", $.type_ref)
            ),
            ";"
        ),

        operation_params: $ => seq(
            $.operation_param, repeat(seq(",", $.operation_param))
        ),

        operation_param: $ => seq(
            field("param_name", $.identifier),
            ":",
            $.type_ref,
            optional(seq("=", $.litteral))
        ),

        enum_def: $ => seq(
            optional($.template_def),
            $.enum_keyword,
            field("name", $.identifier),
            "{",
            $.enumeration,
            repeat(seq(",",$.enumeration)),
            "}"
        ),

        enumeration: $ => seq(
            $.identifier,
            optional(
                seq(
                    ":",
                    $.type_ref,
                )
            ),
            optional(
                seq(
                    "=",
                    $.int_literal,
                )
            )
        ),

    }
})

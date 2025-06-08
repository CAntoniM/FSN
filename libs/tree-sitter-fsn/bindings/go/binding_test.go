package tree_sitter_fsn_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_fsn "github.com/cantonim/fsn/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_fsn.Language())
	if language == nil {
		t.Errorf("Error loading Fing Simple Networking grammar")
	}
}

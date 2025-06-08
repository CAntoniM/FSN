import XCTest
import SwiftTreeSitter
import TreeSitterFsn

final class TreeSitterFsnTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_fsn())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Fing Simple Networking grammar")
    }
}

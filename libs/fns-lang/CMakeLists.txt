cmake_minimum_required(VERSION 3.20)

find_package(GTest REQUIRED)

file(GLOB fns_lang_src "src/*.cpp")
file(GLOB fns_lang_test_src "test/*.cpp")

add_library(fns_lang ${fns_lang_src})
target_include_directories(fns_lang PUBLIC "inc")

add_executable(fns_lang_test ${fns_lang_test_src})
target_link_libraries(fns_lang_test 
    fns_lang
    GTest::GTest
    GTest::Main
)

gtest_add_tests(TARGET fns_lang_test SOURCES ${fns_lang_test_src} TEST_LIST tests)

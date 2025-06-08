
#include "fns-lang.h"
#include <gtest/gtest.h>

class fns_lang_test : public testing::Test {

    fns_lang_test() {

    }

    ~fns_lang_test() override {

    }

    void SetUp() override {

    }

    void TearDown() override {

    }

};

TEST(fns_lang_test,add) {
    ASSERT_EQ(fns_lang::add(1,3),4);
}

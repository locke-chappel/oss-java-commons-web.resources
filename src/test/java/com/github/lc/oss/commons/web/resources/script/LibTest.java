package com.github.lc.oss.commons.web.resources.script;

import javax.script.Invocable;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class LibTest extends AbstractScriptTest {
    @Test
    public void test_default_bothNull() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", null, null);
        Assertions.assertNull(result);
    }

    @Test
    public void test_default_nullDefault() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", "v", null);
        Assertions.assertEquals("v", result);
    }

    @Test
    public void test_default_nullValue_string() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", null, "def");
        Assertions.assertEquals("def", result);
    }

    @Test
    public void test_default_nullValue_int() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", null, 128);
        Assertions.assertEquals(128, result);
    }

    @Test
    public void test_default_emptyValue() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", "", "def");
        Assertions.assertEquals("def", result);
    }

    @Test
    public void test_default_blankValue() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", " \t \r \n \t ", "def");
        Assertions.assertEquals("def", result);
    }

    @Test
    public void test_default_hasValue_string() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", "v", "def");
        Assertions.assertEquals("v", result);
    }

    @Test
    public void test_default_hasValue_int() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Default", 5, "def");
        Assertions.assertEquals(5, result);
    }

    @Test
    public void test_range_nullValue_nullDefault() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", null, 10, 20, null);
        Assertions.assertNull(result);
    }

    @Test
    public void test_range_noDefault() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", null, 10, 20);
        Assertions.assertNull(result);
    }

    @Test
    public void test_range_nullValue() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", null, 10, 20, 15);
        Assertions.assertEquals(15, result);
    }

    @Test
    public void test_range_belowMin() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", 9, 10, 20, 15);
        Assertions.assertEquals(10, result);
    }

    @Test
    public void test_range_aboveMax() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", 21, 10, 20, 15);
        Assertions.assertEquals(20, result);
    }

    @Test
    public void test_range_valid() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", 11, 10, 20);
        Assertions.assertEquals(11, result);
    }

    @Test
    public void test_range_String() {
        Invocable js = this.loadEngine("lib-text.js");
        Object result = this.call(js, "$$.Range", "a", 10, 20, 15);
        Assertions.assertEquals(15, result);
    }
}

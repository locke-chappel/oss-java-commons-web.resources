package io.github.lc.oss.commons.web.resources.script;

import javax.script.Invocable;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SortingTest extends AbstractScriptTest {
    @Test
    public void test_nullSort_bothNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", null, null);
        Assertions.assertEquals(0, result);
    }

    @Test
    public void test_nullSort_aNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", null, new Object());
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_nullSort_aNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", null, new Object(), true);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_nullSort_bNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", new Object(), null);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_nullSort_bNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", new Object(), null, true);
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_nullSort_notNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting._nullSort", new Object(), new Object());
        Assertions.assertEquals(0, result);
    }

    @Test
    public void test_numeric_same() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", 1, 1);
        Assertions.assertEquals(0, result);
    }

    @Test
    public void test_numeric_aNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", null, 1);
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_numeric_aNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", null, 1, true);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_numeric_bNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", 1, null);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_numeric_bNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", 1, null, true);
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_numeric() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", 2, 1);
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_numeric_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.Numeric", 2, 1, true);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_string_same() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", "a", "a");
        Assertions.assertEquals(0, result);
    }

    @Test
    public void test_string_aNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", null, "a");
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_string_aNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", null, "a", true);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_string_bNull() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", "a", null);
        Assertions.assertEquals(-1, result);
    }

    @Test
    public void test_string_bNull_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", "a", null, true);
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_string() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", "b", "a");
        Assertions.assertEquals(1, result);
    }

    @Test
    public void test_string_reverse() {
        Invocable js = this.loadEngine("lib-sorting.js");
        int result = this.call(js, "$$.Sorting.String", "b", "a", true);
        Assertions.assertEquals(-1, result);
    }
}

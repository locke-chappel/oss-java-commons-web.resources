package io.github.lc.oss.commons.web.resources;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.github.lc.oss.commons.web.resources.AbstractResourceResolver.Types;

public class FileResolverTest {
    @Test
    public void test_constructor() {
        FileResolver resolver = new FileResolver(null, 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new FileResolver("", 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new FileResolver(" \r \n \t ", 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new FileResolver("path", 2);
        Assertions.assertEquals("path/", resolver.getRoot());
        Assertions.assertEquals(2, resolver.getDepth());

        resolver = new FileResolver("/path/", 10);
        Assertions.assertEquals("/path/", resolver.getRoot());
        Assertions.assertEquals(10, resolver.getDepth());
    }

    @Test
    public void test_findFiles_noMatchers() {
        FileResolver resolver = new FileResolver("static-library", 2);

        List<String> result = resolver.findFiles(null);
        Assertions.assertNull(result);

        result = resolver.findFiles(new ArrayList<>());
        Assertions.assertNull(result);
    }

    @Test
    public void test_findFiles_withSub() {
        FileResolver resolver = new FileResolver("static-library", 2);

        List<String> result = resolver.findFiles(Types.js.name(), Arrays.asList(p -> {
            return p.toString().endsWith(".js");
        }));
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.stream().anyMatch(f -> f.endsWith("_lib.js")));
    }

    @Test
    public void test_findFiles_noSub() {
        FileResolver resolver = new FileResolver("static-library", 2);

        List<String> result = resolver.findFiles(Arrays.asList(p -> {
            return p.toString().endsWith(".js");
        }));
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.stream().anyMatch(f -> f.endsWith("_lib.js")));
    }

    @Test
    public void test_findFiles_earlyExit() {
        // null
        FileResolver resolver = new FileResolver(null, 2);
        List<String> result = resolver.findFiles(Arrays.asList(p -> {
            return p.toString().endsWith(".js");
        }));
        Assertions.assertNull(result);

        // empty
        resolver = new FileResolver("", 2);
        result = resolver.findFiles(Arrays.asList(p -> {
            return p.toString().endsWith(".js");
        }));
        Assertions.assertNull(result);

        // no matchers
        resolver = new FileResolver("static-library", 2);
        result = resolver.findFiles(null);
        Assertions.assertNull(result);

        // no matchers v2
        resolver = new FileResolver("static-library", 2);
        result = resolver.findFiles(new ArrayList<>());
        Assertions.assertNull(result);
    }
}

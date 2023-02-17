package io.github.lc.oss.commons.web.resources;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.github.lc.oss.commons.web.resources.AbstractResourceResolver.Types;

public class StaticResourceFileResolverTest {
    @Test
    public void test_constructor() {
        StaticResourceFileResolver resolver = new StaticResourceFileResolver(null, 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new StaticResourceFileResolver("", 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new StaticResourceFileResolver(" \r \n \t ", 2);
        Assertions.assertNull(resolver.getRoot());

        resolver = new StaticResourceFileResolver("path", 2);
        Assertions.assertEquals("path/", resolver.getRoot());
        Assertions.assertEquals(2, resolver.getDepth());

        resolver = new StaticResourceFileResolver("/path/", 10);
        Assertions.assertEquals("/path/", resolver.getRoot());
        Assertions.assertEquals(10, resolver.getDepth());
    }

    @Test
    public void test_findFiles_null() {
        StaticResourceFileResolver resolver = new StaticResourceFileResolver(null, 2);

        List<String> result = resolver.findFiles(Types.css);
        Assertions.assertNull(result);
    }

    @Test
    public void test_findFiles() {
        StaticResourceFileResolver resolver = new StaticResourceFileResolver("static-library", 2);

        List<String> result = resolver.findFiles(Types.css);
        Assertions.assertNotNull(result);
        Assertions.assertFalse(result.isEmpty());
        boolean hasReset = result.stream().filter(s -> s != null).anyMatch(s -> s.endsWith("reset.css"));
        Assertions.assertTrue(hasReset);

        result = resolver.findFiles(Types.css, p -> p.toString().endsWith("reset.css"));
        Assertions.assertNotNull(result);
        Assertions.assertFalse(result.isEmpty());
        hasReset = result.stream().filter(s -> s != null).anyMatch(s -> s.endsWith("reset.css"));
        Assertions.assertTrue(hasReset);
    }
}

package com.github.lc.oss.commons.web.resources;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.github.lc.oss.commons.l10n.L10N;
import com.github.lc.oss.commons.l10n.UserLocale;
import com.github.lc.oss.commons.web.resources.AbstractResourceResolver.TypedPathPredicate;
import com.github.lc.oss.commons.web.resources.AbstractResourceResolver.Types;

public class AbstractResourceResolverTest {
    private static class TestClass extends AbstractResourceResolver {

    }

    @Test
    public void test_replaceValues_defaults() {
        AbstractResourceResolver resolver = new TestClass();

        String src = "#context.timeout# #context.timeout.enabled# #context.path.resource# #context.path.url# #context.cookies.prefix# #id# #context.security.csrf.header# #context.logging.prefix#";
        String result = resolver.replaceValues(Types.css, src);
        Assertions.assertEquals("-1 false    #id#  ", result);

        src = "#context.timeout #context.timeout.enabled context.path.url# context.cookies.prefix# #id #context.logging.prefix";
        result = resolver.replaceValues(Types.css, src);
        Assertions.assertEquals("#context.timeout #context.timeout.enabled context.path.url# context.cookies.prefix# #id #context.logging.prefix", result);
    }

    @Test
    public void test_replaceValues() {
        final L10N l10n = Mockito.mock(L10N.class);

        AbstractResourceResolver resolver = new AbstractResourceResolver() {
            @Override
            protected String getConsoleLogPrefix() {
                return "[App]";
            }

            @Override
            protected String getContextPath() {
                return "/";
            }

            @Override
            protected String getCookiePrefix() {
                return "__Secure-";
            }

            @Override
            protected String getCsrfTokenHeaderId() {
                return "X-CSRF";
            }

            @Override
            protected L10N getL10N() {
                return l10n;
            }

            @Override
            protected int getSessionTimeout() {
                return 1800000;
            }
        };

        Mockito.when(l10n.getDefaultLocale()).thenReturn(Locale.ENGLISH);
        Mockito.when(l10n.getText(Locale.ENGLISH, "id")).thenReturn("text");

        Map<String, String> extra = new HashMap<>();
        extra.put("extra", "E-Value");
        extra.put("space", " ");

        String src = "#context.timeout# #context.timeout.enabled# #context.path.resource# #context.path.url# #context.cookies.prefix# #id# #extra# #context.security.csrf.header# #context.logging.prefix#";
        String result = resolver.replaceValues(Types.css, src);
        Assertions.assertEquals("1800000 true / / __Secure- text #extra# X-CSRF [App]", result);

        src = "#context.timeout# #context.timeout.enabled# #context.path.resource# #context.path.url# #context.cookies.prefix# #id# #extra# #space# #context.security.csrf.header# #context.logging.prefix#";
        result = resolver.replaceValues(Types.css, src, extra);
        Assertions.assertEquals("1800000 true / / __Secure- text E-Value  X-CSRF [App]", result);

        src = "#context.timeout #context.timeout.enabled context.path.url# context.cookies.prefix# #id  extra# #context.logging.prefix";
        result = resolver.replaceValues(Types.css, src);
        Assertions.assertEquals("#context.timeout #context.timeout.enabled context.path.url# context.cookies.prefix# #id  extra# #context.logging.prefix",
                result);
    }

    @Test
    public void test_getL10NText_defaults() {
        AbstractResourceResolver resolver = new TestClass();

        String result = resolver.getL10NText("id");
        Assertions.assertNull(result);
    }

    @Test
    public void test_getL10NTest_noLocale() {
        final L10N l10n = Mockito.mock(L10N.class);
        AbstractResourceResolver resolver = new AbstractResourceResolver() {
            @Override
            protected L10N getL10N() {
                return l10n;
            }
        };

        Mockito.when(l10n.getDefaultLocale()).thenReturn(Locale.ENGLISH);
        Mockito.when(l10n.getText(Locale.ENGLISH, "id")).thenReturn("value");

        String result = resolver.getL10NText("id");
        Assertions.assertEquals("value", result);
    }

    @Test
    public void test_getL10NTest_withLocale() {
        final L10N l10n = Mockito.mock(L10N.class);
        final UserLocale locale = new UserLocale(Locale.GERMAN);
        AbstractResourceResolver resolver = new AbstractResourceResolver() {
            @Override
            protected L10N getL10N() {
                return l10n;
            }

            @Override
            protected UserLocale getUserLocale() {
                return locale;
            }
        };

        Mockito.when(l10n.getText(locale.getLocale(), "id")).thenReturn("value");

        String result = resolver.getL10NText("id");
        Assertions.assertEquals("value", result);
    }

    @Test
    public void test_types() {
        Types[] values = AbstractResourceResolver.Types.values();
        Set<Types> all = AbstractResourceResolver.Types.all();
        Assertions.assertEquals(values.length, all.size());
        Assertions.assertSame(all, AbstractResourceResolver.Types.all());
        Arrays.stream(values).forEach(v -> Assertions.assertTrue(all.contains(v)));
        all.stream().forEach(ea -> {
            Assertions.assertTrue(AbstractResourceResolver.Types.hasName(ea.name()));
            Assertions.assertSame(ea, AbstractResourceResolver.Types.byName(ea.name()));
            Assertions.assertSame(ea, AbstractResourceResolver.Types.tryParse(ea.name()));
            ea.getFileExtensions().forEach(ext -> {
                Assertions.assertTrue(ea.hasFileExtension(ext));
                Assertions.assertFalse(ea.hasFileExtension("." + ext));
            });
            Assertions.assertNotNull(ea.getFileExtensionsPattern());
        });
    }

    @Test
    public void test_typedPathPredicate() {
        TypedPathPredicate predicate = new TypedPathPredicate(Types.img);

        Assertions.assertEquals(Types.img, predicate.getType());
        Types.img.getFileExtensions().forEach(ext -> {
            Assertions.assertTrue(predicate.test(Paths.get("./some/path/file." + ext)));
            Assertions.assertFalse(predicate.test(Paths.get("./some/path/file-" + ext)));
        });
    }

    @Test
    public void test_getFileResolvers() {
        AbstractResourceResolver resolver = new TestClass();

        List<StaticResourceFileResolver> a = resolver.getFileResolvers();
        List<StaticResourceFileResolver> b = resolver.getFileResolvers();
        Assertions.assertNotNull(a);
        Assertions.assertSame(a, b);
    }

    @Test
    public void test_compile_allFiles_js() {
        AbstractResourceResolver resolver = new TestClass();

        String result = resolver.compile(Types.js);
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.contains("$$.Find"));
    }

    @Test
    public void test_compile_allFiles_css() {
        AbstractResourceResolver resolver = new TestClass();

        String result = resolver.compile(Types.css);
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.contains("-touch.css"));
    }

    @Test
    public void test_compile_noFiles() {
        AbstractResourceResolver resolver = new AbstractResourceResolver() {
            @Override
            protected List<StaticResourceFileResolver> getFileResolvers() {
                return Arrays.asList(new StaticResourceFileResolver(null, 2));
            }
        };

        String result = resolver.compile(Types.js);
        Assertions.assertNotNull(result);
        Assertions.assertFalse(result.contains("$$.Find"));
    }
}

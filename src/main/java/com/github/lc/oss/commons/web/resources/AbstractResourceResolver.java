package com.github.lc.oss.commons.web.resources;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.github.lc.oss.commons.l10n.L10N;
import com.github.lc.oss.commons.l10n.UserLocale;
import com.github.lc.oss.commons.util.IoTools;
import com.github.lc.oss.commons.util.TypedEnumCache;

public abstract class AbstractResourceResolver {
    protected static final Comparator<String> CSS_TOUCH_COMPARATOR = new Comparator<String>() {
        @Override
        public int compare(String a, String b) {
            boolean aIsTouch = a.endsWith("-touch.css");
            boolean bIsTouch = b.endsWith("-touch.css");
            if (aIsTouch && !bIsTouch) {
                return 1;
            } else if (!aIsTouch && bIsTouch) {
                return -1;
            }
            return a.compareTo(b);
        }
    };

    public enum Types {
        css("css"),
        font("woff2"),
        img("gif", "ico", "jpg", "jpeg", "png", "svg", "svgz"),
        js("js");

        private static final TypedEnumCache<Types, Types> CACHE = new TypedEnumCache<>(Types.class);

        public static Set<Types> all() {
            return Types.CACHE.values();
        }

        public static Types byName(String name) {
            return Types.CACHE.byName(name);
        }

        public static boolean hasName(String name) {
            return Types.CACHE.hasName(name);
        }

        public static Types tryParse(String name) {
            return Types.CACHE.tryParse(name);
        }

        private final Set<String> fileExtensions;
        private final Pattern fileExtensionsPattern;

        private Types(String... filesExtensions) {
            this.fileExtensions = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(filesExtensions)));
            this.fileExtensionsPattern = Pattern.compile(".+\\.(" + this.fileExtensions.stream().collect(Collectors.joining("|")) + ")$");
        }

        public Set<String> getFileExtensions() {
            return this.fileExtensions;
        }

        public Pattern getFileExtensionsPattern() {
            return this.fileExtensionsPattern;
        }

        public boolean hasFileExtension(String ext) {
            return this.fileExtensions.contains(ext);
        }
    }

    public static class TypedPathPredicate implements Predicate<Path> {
        private final Types type;
        private final Pattern extPattern;

        public TypedPathPredicate(Types type) {
            this.type = type;
            this.extPattern = Pattern.compile(".+\\.(?:" + type.getFileExtensions().stream().collect(Collectors.joining("|")) + ")$");
        }

        @Override
        public boolean test(Path path) {
            return this.extPattern.matcher(path.toString()).matches();
        }

        public Types getType() {
            return this.type;
        }
    }

    protected static final String LIBRARY_PATH = "static-library/";
    protected static final Pattern VAR_PATTERN = Pattern.compile("(#([^# '\"<>]+)#)");

    protected static final StaticResourceFileResolver LIBRARY_RESOLVER = new StaticResourceFileResolver(AbstractResourceResolver.LIBRARY_PATH, 3);

    protected List<StaticResourceFileResolver> resolvers;

    protected String getConsoleLogPrefix() {
        return "";
    }

    protected String getContextPath() {
        return "";
    }

    protected String getCookiePrefix() {
        return "";
    }

    protected String getCsrfTokenHeaderId() {
        return "";
    }

    protected List<StaticResourceFileResolver> getFileResolvers() {
        if (this.resolvers == null) {
            this.resolvers = Collections.unmodifiableList(Arrays.asList(AbstractResourceResolver.LIBRARY_RESOLVER));
        }
        return this.resolvers;
    }

    protected L10N getL10N() {
        return null;
    }

    protected int getSessionTimeout() {
        return -1;
    }

    protected UserLocale getUserLocale() {
        return null;
    }

    protected boolean isPageAllowed(Path path) {
        return true;
    }

    protected String compile(Types type) {
        return this.compile(type, this.getFileResolvers());
    }

    protected String compile(Types type, List<StaticResourceFileResolver> resolvers) {
        StringBuilder compiled = new StringBuilder();
        List<String> allFiles = new ArrayList<>();
        List<String> files;
        for (StaticResourceFileResolver resolver : resolvers) {
            files = resolver.findFiles(type, p -> this.isPageAllowed(p));
            if (files != null) {
                allFiles.addAll(files);
            }
        }

        if (type == Types.css) {
            allFiles.sort(AbstractResourceResolver.CSS_TOUCH_COMPARATOR);
        }

        for (String file : allFiles) {
            compiled.append(new String(IoTools.readAbsoluteFile(file), StandardCharsets.UTF_8));
        }

        return compiled.toString();
    }

    protected String getL10NText(String id) {
        if (this.getL10N() == null) {
            return null;
        }

        Locale locale = null;
        if (this.getUserLocale() == null) {
            locale = this.getL10N().getDefaultLocale();
        } else {
            locale = this.getUserLocale().getLocale();
        }

        return this.getL10N().getText(locale, id);
    }

    protected Map<String, String> getExtraReplacementValues() {
        return null;
    }

    protected String replaceValues(Types type, String src) {
        return this.replaceValues(type, src, this.getExtraReplacementValues());
    }

    protected String replaceValues(Types type, String src, Map<String, String> extraValues) {
        String s = src;
        Matcher m = AbstractResourceResolver.VAR_PATTERN.matcher(s);
        String key = null;
        String value = null;
        while (m.find()) {
            key = m.group(2);

            value = this.resolveValue(type, key, extraValues);
            if (value == null) {
                value = m.group(1);
            }

            s = s.replaceAll(m.group(1), value.trim());
        }
        return s;
    }

    protected String resolveValue(Types type, String key, Map<String, String> extraValues) {
        switch (key) {
            case "context.cookies.prefix":
                return this.getCookiePrefix();
            case "context.logging.prefix":
                return this.getConsoleLogPrefix();
            case "context.path.resource":
            case "context.path.url":
                return this.getContextPath();
            case "context.security.csrf.header":
                return this.getCsrfTokenHeaderId();
            case "context.timeout":
                if (this.getSessionTimeout() <= 0) {
                    return "-1";
                }
                return Integer.toString(this.getSessionTimeout());
            case "context.timeout.enabled":
                return Boolean.toString(this.getSessionTimeout() > 0);
            default:
                String value = null;
                if (extraValues != null) {
                    value = extraValues.get(key);
                }

                if (value == null) {
                    value = this.getL10NText(key);
                }

                return value;
        }
    }
}

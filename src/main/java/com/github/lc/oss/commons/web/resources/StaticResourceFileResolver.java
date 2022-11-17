package com.github.lc.oss.commons.web.resources;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

public class StaticResourceFileResolver extends FileResolver {
    protected static final Map<Types, TypedPathPredicate> TYPED_PREDICATES;
    static {
        Map<Types, TypedPathPredicate> predicateMap = new HashMap<>();
        predicateMap.put(Types.css, new TypedPathPredicate(Types.css));
        predicateMap.put(Types.font, new TypedPathPredicate(Types.font));
        predicateMap.put(Types.img, new TypedPathPredicate(Types.img));
        predicateMap.put(Types.js, new TypedPathPredicate(Types.js));
        TYPED_PREDICATES = Collections.unmodifiableMap(predicateMap);
    }

    public StaticResourceFileResolver(String root, int depth) {
        super(root, depth);
    }

    public List<String> findFiles(Types type) {
        return this.findFiles(type, null);
    }

    public List<String> findFiles(Types type, Predicate<Path> additionalPathMatcher) {
        List<Predicate<Path>> matchers = new ArrayList<>();
        matchers.add(p -> StaticResourceFileResolver.TYPED_PREDICATES.get(type).test(p));
        if (additionalPathMatcher != null) {
            matchers.add(additionalPathMatcher);
        }
        return this.findFiles(type.name(), matchers);
    }
}

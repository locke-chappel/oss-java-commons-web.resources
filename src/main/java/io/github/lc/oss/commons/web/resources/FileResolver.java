package io.github.lc.oss.commons.web.resources;

import java.nio.file.Path;
import java.text.Collator;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;

import io.github.lc.oss.commons.util.IoTools;

public class FileResolver extends AbstractResourceResolver {
    private final String root;
    private final int depth;

    public FileResolver(String root, int depth) {
        if (root == null || root.trim().equals("")) {
            this.root = null;
        } else {
            String s = root.trim();
            if (!s.endsWith("/")) {
                s += "/";
            }
            this.root = s;
        }
        this.depth = depth;
    }

    protected String getRoot() {
        return this.root;
    }

    protected int getDepth() {
        return this.depth;
    }

    public List<String> findFiles(Collection<Predicate<Path>> matchers) {
        return this.findFiles(null, matchers);
    }

    public List<String> findFiles(String subpath, Collection<Predicate<Path>> matchers) {
        if (this.getRoot() == null || matchers == null || matchers.size() < 1) {
            return null;
        }

        String sub = subpath;
        if (sub == null) {
            sub = "";
        }

        /*
         * return true only if all matchers match
         */
        return this.findFiles(this.getRoot() + sub, this.getDepth(), p -> {
            for (Predicate<Path> matcher : matchers) {
                if (!matcher.test(p)) {
                    return false;
                }
            }

            return true;
        });
    }

    protected List<String> findFiles(String rootPath, int depth, Predicate<Path> pathMatcher) {
        List<String> files = IoTools.listDir( //
                rootPath, //
                depth, //
                pathMatcher);
        Collections.sort(files, Collator.getInstance(Locale.US));
        return files;
    }
}

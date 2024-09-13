package io.github.lc.oss.commons.web.resources;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MinifierService implements Minifier {
    private static final List<Rule> CSS_RULES;
    private static final List<Rule> JS_RULES;
    private static final Rule COMMENT_RULE = new CommentRule();

    static {
        List<Rule> rules = new ArrayList<>();
        // Remove...
        rules.add(PatternRule.of("\\r\\n", "")); // Windows newlines
        rules.add(PatternRule.of("\\n", "")); // *nix newlines

        // Collapse all unquoted white space to a single space
        rules.add(PatternRule.of("\\s+(?=(?:[^\\'\"]*[\\'\"][^\\'\"]*[\\'\"])*[^\\'\"]*$)", " "));

        // Remove unnecessary spaces
        rules.add(PatternRule.of("\\s*,\\s*", ","));
        rules.add(PatternRule.of("\\s*\\{\\s*", "{"));
        rules.add(PatternRule.of("\\s*}\\s*", "}"));
        rules.add(PatternRule.of("\\s*;\\s*", ";"));
        rules.add(PatternRule.of("\\s*:\\s*", ":"));
        rules.add(PatternRule.of("\\s*>\\s*", ">"));

        CSS_RULES = Collections.unmodifiableList(rules);

        rules = new ArrayList<>();
        // Remove...
        rules.add(PatternRule.of("\\r\\n", "")); // Windows newlines
        rules.add(PatternRule.of("\\n", "")); // *nix newlines

        // Collapse all unquoted white space to a single space
        rules.add(PatternRule.of("\\s+(?=(?:[^\\'\"]*[\\'\"][^\\'\"]*[\\'\"])*[^\\'\"]*$)", " "));

        JS_RULES = Collections.unmodifiableList(rules);
    }

    private boolean enabled = true;
    private boolean enableCssCommentRemoval = true;
    private boolean enableJsCommentRemoval = true;

    @Override
    public void setEnableCssCommentRemoval(boolean enabled) {
        this.enableCssCommentRemoval = enabled;
    }

    @Override
    public boolean isCssCommentRemovalEnabled() {
        return this.enableCssCommentRemoval;
    }

    @Override
    public void setEnableJsCommentRemoval(boolean enabled) {
        this.enableJsCommentRemoval = enabled;
    }

    @Override
    public boolean isJsCommentRemovalEnabled() {
        return this.enableJsCommentRemoval;
    }

    @Override
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    @Override
    public String minifyCssIfEnabled(String css) {
        if (!this.isEnabled()) {
            return css;
        }

        return this.minifyCss(css);
    }

    @Override
    public String minifyCss(String css) {
        if (css == null) {
            return "";
        }

        String s = css;

        if (this.isCssCommentRemovalEnabled()) {
            s = COMMENT_RULE.apply(s);
        }

        for (Rule rule : CSS_RULES) {
            s = rule.apply(s);
        }
        return s;
    }

    @Override
    public String minifyJsIfEnabled(String js) {
        if (!this.isEnabled()) {
            return js;
        }

        return this.minifyJs(js);
    }

    @Override
    public String minifyJs(String js) {
        if (js == null) {
            return "";
        }

        String s = "\"use strict\";" + js;

        if (this.isJsCommentRemovalEnabled()) {
            s = COMMENT_RULE.apply(s);
        }

        for (Rule rule : JS_RULES) {
            s = rule.apply(s);
        }
        return s;
    }
}

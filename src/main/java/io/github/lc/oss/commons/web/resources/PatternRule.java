package io.github.lc.oss.commons.web.resources;

import java.util.regex.Pattern;

class PatternRule implements Rule {
    private final Pattern pattern;
    private final String replacement;

    public static PatternRule of(String regex, String replacement) {
        return new PatternRule(Pattern.compile(regex), replacement);
    }

    public PatternRule(Pattern pattern, String replacement) {
        this.pattern = pattern;
        this.replacement = replacement;
    }

    public Pattern getPattern() {
        return this.pattern;
    }

    public String getReplacement() {
        return this.replacement;
    }

    @Override
    public String apply(String src) {
        return this.getPattern().matcher(src).replaceAll(this.getReplacement());
    }
}

package io.github.lc.oss.commons.web.resources;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

public class CommentRule implements Rule {
    private static final List<Rule> HACKS;

    static {
        List<Rule> rules = new ArrayList<>();

        /*
         * Hack for MIME All -> "* /*" and '* /*' becomes "*"+"/"+"*"
         */
        rules.add(PatternRule.of("\"\\*/\\*\"", "\"\\*\"+\"/\"+\"\\*\""));
        rules.add(PatternRule.of("'\\*/\\*'", "\"\\*\"+\"/\"+\"\\*\""));

        HACKS = Collections.unmodifiableList(rules);
    }

    /* Close but fails on the MIME type header case */
    private final Pattern pattern = Pattern.compile("\\/\\*(\\*(?!\\/)|[^*])*\\*\\/");

    @Override
    public String apply(String src) {
        /*
         * TODO How to safely remove block and line comments...
         * 
         * Project source already follow strict block comment only rules but...
         * JavaScript has a line like "Accept" : "* /*" (without the space, already
         * trips up the parser (mime types cannot have spaces)... even in this comment
         * 
         * This pattern is close... if we get creative with the source java script (e.g.
         * we edit known comment forms to not match such as the MIME hack above).
         * 
         * Also breaks if the source contains // style comments (can't just remove them
         * because "http://example.com" is _not_ a comment...
         */
        String s = src;
        for (Rule hack : HACKS) {
            s = hack.apply(s);
        }
        return pattern.matcher(s).replaceAll("");
    }
}

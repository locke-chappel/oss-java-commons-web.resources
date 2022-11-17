package com.github.lc.oss.commons.web.resources;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.github.lc.oss.commons.testing.AbstractTest;

public class MinifierServiceTest extends AbstractTest {
    @Test
    public void test_minifyCss_disabled() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(false);

        final String src = "body {\n\tcolor: #FFFFFF;\n}\ndiv {\n\t/* emtpy */\n}";

        String result = minifier.minifyCssIfEnabled(src);
        Assertions.assertSame(src, result);
    }

    @Test
    public void test_minifyCss() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        final String src = "body {\n\tcolor: #FFFFFF;\n}\ndiv {\n\t/* emtpy */\n}";

        String result = minifier.minifyCssIfEnabled(src);
        Assertions.assertEquals("body{color:#fff}", result);
    }

    @Test
    public void test_minifyCss_error() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        try {
            minifier.minifyCssIfEnabled(null);
            Assertions.fail("Expected exception");
        } catch (RuntimeException ex) {
            Assertions.assertEquals("Error minifying CSS", ex.getMessage());
        }
    }

    @Test
    public void test_minifyJs_disabled() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(false);

        final String src = "var $$ = {\n\t Function : function() {\n\tvar aLongVariableName = \"test\";\n\tdocument.write(aLongVariableName);\n}};\n\n$$.Function();\n";

        String result = minifier.minifyJsIfEnabled(src);
        Assertions.assertSame(src, result);
    }

    @Test
    public void test_minifyJs() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        final String src = "var $$ = {\n\t Function : function() {\n\tvar aLongVariableName = \"test\";\n\tdocument.write(aLongVariableName);\n}};\n\n$$.Function();\n";

        String result = minifier.minifyJsIfEnabled(src);
        Assertions.assertEquals("'use strict';var $$={Function:function(){document.write(\"test\")}};$$.Function();", result);
    }
}

package io.github.lc.oss.commons.web.resources;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.github.lc.oss.commons.testing.AbstractTest;

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
        Assertions.assertEquals("body{color:#FFFFFF;}div{}", result);
    }

    @Test
    public void test_minifyCss_commentRemovalDisabled() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);
        minifier.setEnableCssCommentRemoval(false);
        minifier.setEnableJsCommentRemoval(true);

        final String src = "body {\n\tcolor: #FFFFFF;\n}\ndiv {\n\t/* \"emtpy    comment\" */\n}";

        String result = minifier.minifyCssIfEnabled(src);
        Assertions.assertEquals("body{color:#FFFFFF;}div{/* \"emtpy    comment\" */}", result);
    }

    @Test
    public void test_minifyCss_blank() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        Assertions.assertEquals("", minifier.minifyCssIfEnabled(null));

        /*
         * Odd corner cases but technically correct as per definition.
         * 
         * Could add a special case logic but this likely never happens in practice so
         * why waste the resources?
         * 
         * This behavior is "good enough"
         */
        Assertions.assertEquals(" ", minifier.minifyCssIfEnabled(" "));
        Assertions.assertEquals(" ", minifier.minifyCssIfEnabled(" \r \n \t \r\n "));
    }

    @Test
    public void test_minifyJs_disabled() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(false);

        final String src = "var $$ = {\n\t Function : function() {\n\tvar aLongVariableName = \"test\";\n\tdocument.write(aLongVariableName);\n}};\n\n$$.Function();\n/* some comment */\n";

        String result = minifier.minifyJsIfEnabled(src);
        Assertions.assertSame(src, result);
    }

    @Test
    public void test_minifyJs() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        final String src = "var $$ = {\n\t Function : function() {\n\tALL_MIME = \"*/*\";\n\tvar aLongVariableName = \"test    test\";\n\tdocument.write(aLongVariableName);\n}};\n\n$$.Function();\n/* some comment */\n";

        String result = minifier.minifyJsIfEnabled(src);
        Assertions.assertEquals(
                "\"use strict\";var $$ = { Function : function() { ALL_MIME = \"*\"+\"/\"+\"*\"; var aLongVariableName = \"test    test\"; document.write(aLongVariableName);}};$$.Function();",
                result);
    }

    @Test
    public void test_minifyJs_commentRemovalDisabled() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);
        minifier.setEnableCssCommentRemoval(true);
        minifier.setEnableJsCommentRemoval(false);

        final String src = "var $$ = {\n\t Function : function() {\n\tALL_MIME = \"*/*\";\n\tvar aLongVariableName = \"test    test\";\n\tdocument.write(aLongVariableName);\n}};\n\n$$.Function();\n/* some comment */\n";

        String result = minifier.minifyJsIfEnabled(src);
        Assertions.assertEquals(
                "\"use strict\";var $$ = { Function : function() { ALL_MIME = \"*/*\"; var aLongVariableName = \"test    test\"; document.write(aLongVariableName);}};$$.Function();/* some comment */",
                result);
    }

    @Test
    public void test_minifyJs_blank() {
        Minifier minifier = new MinifierService();
        minifier.setEnabled(true);

        Assertions.assertEquals("", minifier.minifyJsIfEnabled(null));

        /*
         * Odd corner cases but technically correct as per definition.
         * 
         * Could add a special case logic but this likely never happens in practice so
         * why waste the resources?
         * 
         * This behavior is "good enough"
         */
        Assertions.assertEquals("\"use strict\"; ", minifier.minifyJsIfEnabled(" "));
        Assertions.assertEquals("\"use strict\"; ", minifier.minifyJsIfEnabled(" \r \n \t \r\n "));
    }
}

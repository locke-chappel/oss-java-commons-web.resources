module io.github.lc.oss.commons.web.resources {
    requires io.github.lc.oss.commons.l10n;
    requires io.github.lc.oss.commons.util;

    requires yuicompressor;
    requires closure.compiler.v20220719;

    /* Used only in testing */
    requires java.scripting;

    exports io.github.lc.oss.commons.web.resources;
}

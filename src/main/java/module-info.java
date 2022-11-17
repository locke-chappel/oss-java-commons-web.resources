module com.github.lc.oss.commons.web.resources {
    requires com.github.lc.oss.commons.l10n;
    requires com.github.lc.oss.commons.util;

    requires yuicompressor;
    requires closure.compiler.v20220719;

    /* Used only in testing */
    requires java.scripting;

    exports com.github.lc.oss.commons.web.resources;
}

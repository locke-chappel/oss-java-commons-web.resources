package io.github.lc.oss.commons.web.resources;

public interface Minifier {
    String minifyCssIfEnabled(String css);

    String minifyCss(String css);

    String minifyJsIfEnabled(String js);

    String minifyJs(String js);

    void setEnableCssCommentRemoval(boolean enabled);

    boolean isCssCommentRemovalEnabled();

    void setEnableJsCommentRemoval(boolean enabled);

    boolean isJsCommentRemovalEnabled();

    void setEnabled(boolean enabled);

    boolean isEnabled();
}

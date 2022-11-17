package com.github.lc.oss.commons.web.resources;

public interface Minifier {
    String minifyCssIfEnabled(String css);

    String minifyCss(String css);

    String minifyJsIfEnabled(String js);

    String minifyJs(String js);

    void setEnabled(boolean enabled);

    boolean isEnabled();
}

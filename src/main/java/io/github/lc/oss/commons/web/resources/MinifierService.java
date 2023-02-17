package io.github.lc.oss.commons.web.resources;

import java.io.StringReader;
import java.io.StringWriter;

//import org.springframework.beans.factory.annotation.Value;

import com.google.javascript.jscomp.CompilationLevel;
import com.google.javascript.jscomp.Compiler;
import com.google.javascript.jscomp.CompilerOptions;
import com.google.javascript.jscomp.SourceFile;
import com.yahoo.platform.yui.compressor.CssCompressor;

public class MinifierService implements Minifier {
    private boolean enabled = true;

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
        try (StringReader reader = new StringReader(css); StringWriter writer = new StringWriter();) {
            CssCompressor compiler = new CssCompressor(reader);
            compiler.compress(writer, -1);
            return writer.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error minifying CSS", ex);
        }
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
        /*
         * see http://blog.bolinfest.com/2009/11/calling-closure-compiler-from-java.html
         */
        Compiler compiler = new Compiler();
        CompilerOptions options = new CompilerOptions();
        CompilationLevel.SIMPLE_OPTIMIZATIONS.setOptionsForCompilationLevel(options);
        SourceFile extern = SourceFile.fromCode("externs.js", "");
        SourceFile input = SourceFile.fromCode("script.js", js);
        compiler.compile(extern, input, options);
        return compiler.toSource();
    }
}

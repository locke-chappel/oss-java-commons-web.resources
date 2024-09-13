package io.github.lc.oss.commons.web.resources.script;

import java.nio.charset.StandardCharsets;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.junit.jupiter.api.Assertions;

import io.github.lc.oss.commons.util.IoTools;

public abstract class AbstractScriptTest {
    @SuppressWarnings("unchecked")
    protected <T> T call(Invocable engine, String function, Object... args) {
        try {
            Assertions.assertTrue(engine instanceof ScriptEngine, "JavaScript engine is not ScriptEngine, aborting test");
            ((ScriptEngine) engine).eval("function _$(...args) { return " + function + "(...args); }");
            return (T) engine.invokeFunction("_$", args);
        } catch (NoSuchMethodException | ScriptException ex) {
            Assertions.fail(ex);
            return null;
        }
    }

    protected Invocable loadEngine(String... paths) {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("graal.js");
        Assertions.assertNotNull(engine);
        Assertions.assertTrue(engine instanceof Invocable, "JavaScript engine is not Invocable, aborting test");
        try {
            engine.eval(this.compileScripts(paths));
        } catch (ScriptException ex) {
            Assertions.fail(ex);
        }

        return (Invocable) engine;
    }

    protected String compileScripts(String... paths) {
        String script = this.readScipt("_lib.js");
        for (String p : paths) {
            script += this.readScipt(p);
        }
        return script;
    }

    protected String readScipt(String path) {
        return new String(IoTools.readFile("static-library/js/" + path), StandardCharsets.UTF_8);
    }
}

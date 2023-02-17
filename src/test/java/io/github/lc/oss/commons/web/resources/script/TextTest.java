package io.github.lc.oss.commons.web.resources.script;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.script.Invocable;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TextTest extends AbstractScriptTest {
    private Date toUTC(Date date) {
        return new Date(date.getTime() - Calendar.getInstance().getTimeZone().getOffset(date.getTime()));
    }

    @Test
    public void test_FormatDateInput_null() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatDateInput", (Object) null);
        Assertions.assertNull(result);
    }

    @Test
    public void test_FormatDateInput_number() {
        Date date = new Date(0);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Assertions.assertEquals("1970-01-01", formatter.format(this.toUTC(date)));

        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatDateInput", 0);
        Assertions.assertEquals(formatter.format(date), result);
    }

    @Test
    public void test_FormatDateInput_number_v2() {
        Date date = new Date(31478400000l);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Assertions.assertEquals("1970-12-31", formatter.format(this.toUTC(date)));

        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatDateInput", 31478400000l);
        Assertions.assertEquals(formatter.format(date), result);
    }

    @Test
    public void test_FormatDateInput_number_v3() {
        Date date = new Date(16182000000l);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Assertions.assertEquals("1970-07-07", formatter.format(this.toUTC(date)));

        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatDateInput", 16182000000l);
        Assertions.assertEquals(formatter.format(date), result);
    }

    @Test
    public void test_FormatTimeInput_null() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatTimeInput", (Object) null);
        Assertions.assertNull(result);
    }

    @Test
    public void test_FormatTimeInput_number() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatTimeInput", 28800000l);
        Assertions.assertEquals("00:00:00", result);
    }

    @Test
    public void test_FormatTimeInput_number_v2() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatTimeInput", 32461000l);
        Assertions.assertEquals("01:01:01", result);
    }

    @Test
    public void test_FormatTimeInput_number_v3() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.FormatTimeInput", 69071000l);
        Assertions.assertEquals("11:11:11", result);
    }

    @Test
    public void test_isBlank_null() {
        Invocable js = this.loadEngine("lib-text.js");
        boolean result = this.call(js, "$$.Text.IsBlank", (String) null);
        Assertions.assertTrue(result);
    }

    @Test
    public void test_isBlank_empty() {
        Invocable js = this.loadEngine("lib-text.js");
        boolean result = this.call(js, "$$.Text.IsBlank", "");
        Assertions.assertTrue(result);
    }

    @Test
    public void test_isBlank_blank() {
        Invocable js = this.loadEngine("lib-text.js");
        boolean result = this.call(js, "$$.Text.IsBlank", " \t \r \n \t ");
        Assertions.assertTrue(result);
    }

    @Test
    public void test_isBlank() {
        Invocable js = this.loadEngine("lib-text.js");
        boolean result = this.call(js, "$$.Text.IsBlank", " a b ");
        Assertions.assertFalse(result);
    }

    @Test
    public void test_ParseDateInput() {
        Invocable js = this.loadEngine("lib-text.js");
        Object resultObj = this.call(js, "$$.Text.ParseDateInput", "2000-12-01");
        String result = resultObj.toString();
        result = result.split("T")[0];
        Assertions.assertEquals("2000-12-01", result);
    }

    @Test
    public void test_ParseDateInput_null() {
        Invocable js = this.loadEngine("lib-text.js");
        Object resultObj = this.call(js, "$$.Text.ParseDateInput", (String) null);
        Assertions.assertNull(resultObj);
    }

    @Test
    public void test_ParseDateInput_empty() {
        Invocable js = this.loadEngine("lib-text.js");
        Object resultObj = this.call(js, "$$.Text.ParseDateInput", "");
        Assertions.assertNull(resultObj);
    }

    @Test
    public void test_ParseDateInput_blank() {
        Invocable js = this.loadEngine("lib-text.js");
        Object resultObj = this.call(js, "$$.Text.ParseDateInput", " \t \r \n \t ");
        Assertions.assertNull(resultObj);
    }

    @Test
    public void test_trim_null() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", (String) null);
        Assertions.assertEquals("", result);

        result = this.call(js, "$$.Text.Trim", (String) null, true);
        Assertions.assertNull(result);
    }

    @Test
    public void test_trim_empty() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", "");
        Assertions.assertEquals("", result);
    }

    @Test
    public void test_trim_blank() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", " \t \r \n \t ");
        Assertions.assertEquals("", result);
    }

    @Test
    public void test_trim_empty_toNull() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", "", true);
        Assertions.assertNull(result);
    }

    @Test
    public void test_trim_blank_toNull() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", " \t \r \n \t ", true);
        Assertions.assertNull(result);
    }

    @Test
    public void test_trim() {
        Invocable js = this.loadEngine("lib-text.js");
        String result = this.call(js, "$$.Text.Trim", " a b ");
        Assertions.assertEquals("a b", result);
    }

    @Test
    public void test_formatTimeInterval() {
        Invocable js = this.loadEngine("lib-constants.js", "lib-text.js");
        String result = this.call(js, "$$.Text.FormatTimeInterval", 100);
        Assertions.assertEquals("100ms", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 1000);
        Assertions.assertEquals("1s", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 60 * 1000);
        Assertions.assertEquals("1m", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 60 * 60 * 1000);
        Assertions.assertEquals("1h", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 24 * 60 * 60 * 1000);
        Assertions.assertEquals("1d", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 7 * 24 * 60 * 60 * 1000);
        Assertions.assertEquals("1w", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 30 * 60 * 1000);
        Assertions.assertEquals("30m", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 2 * 60 * 60 * 1000);
        Assertions.assertEquals("2h", result);

        result = this.call(js, "$$.Text.FormatTimeInterval", 90 * 1000 + 500);
        Assertions.assertEquals("90500ms", result);
    }

    @Test
    public void test_parseTimeInterval() {
        Invocable js = this.loadEngine("lib-constants.js", "lib-text.js");
        Number result = this.call(js, "$$.Text.ParseTimeInterval", (String) null);
        Assertions.assertNull(result);

        result = this.call(js, "$$.Text.ParseTimeInterval", "-1s");
        Assertions.assertNull(result);

        result = this.call(js, "$$.Text.ParseTimeInterval", "1y");
        Assertions.assertNull(result);

        result = this.call(js, "$$.Text.ParseTimeInterval", "0");
        Assertions.assertEquals(0, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "0ms");
        Assertions.assertEquals(0, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "75");
        Assertions.assertEquals(75, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "500ms");
        Assertions.assertEquals(500, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1000ms");
        Assertions.assertEquals(1000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1s");
        Assertions.assertEquals(1000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "11s");
        Assertions.assertEquals(11000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "60s");
        Assertions.assertEquals(60000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1m");
        Assertions.assertEquals(60000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "30m");
        Assertions.assertEquals(1800000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "60m");
        Assertions.assertEquals(3600000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1h");
        Assertions.assertEquals(3600000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "2h");
        Assertions.assertEquals(7200000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "24h");
        Assertions.assertEquals(86400000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1d");
        Assertions.assertEquals(86400000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "7d");
        Assertions.assertEquals(604800000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "1w");
        Assertions.assertEquals(604800000, result.longValue());

        result = this.call(js, "$$.Text.ParseTimeInterval", "2w");
        Assertions.assertEquals(1209600000, result.longValue());
    }
}

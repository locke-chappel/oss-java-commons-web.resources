/* lib-text.js */
$$.Text = {
    Base64 : {
       Encode : function(data) {
           return btoa(data);
       },
       Decode : function(base64String) {
           return atob(base64String);
       }
    },
    FormatDateInput : function(date) {
        var d = date;
        if (d == null) {
            return null;
        }
        
        if (!isNaN(d)) {
            d = new Date(d);
        }
        var year = d.getFullYear().toString();
        var month = d.getMonth() + 1;
        if (month <= 9) {
            month = "0" + month.toString();
        } else {
            month = month.toString();
        }
        var day = d.getDate();
        if (day <= 9) {
            day = "0" + day.toString();
        } else {
            day = day.toString();
        }
        return year + "-" + month + "-" + day;
    },
    FormatTimeInput : function(date) {
		var d = date;
		if (d == null) {
			return null;
		}
		
		if (!isNaN(d)) {
            d = new Date(d);
        }
        
		var hour = d.getHours();
		var minute = d.getMinutes();
		var second = d.getSeconds();
		
		if (hour <= 9) {
			hour = "0" + hour.toString();
		}
		
		if (minute <= 9) {
			minute = "0" + minute.toString();
		}
		
		if (second <= 9) {
			second = "0" + second.toString();
		}
		
		return hour + ":" + minute + ":" + second;
	},
    FormatTimeInterval : function(milliseconds) {
        if (milliseconds == null) {
            return null;
        }
        
        if (milliseconds % $$.Constants.Time.WeekMillis == 0) {
            return (milliseconds / $$.Constants.Time.WeekMillis) + "w";
        } else if (milliseconds % $$.Constants.Time.DayMillis == 0) {
            return (milliseconds / $$.Constants.Time.DayMillis) + "d";
        } else if (milliseconds % $$.Constants.Time.HourMillis == 0) {
            return (milliseconds / $$.Constants.Time.HourMillis) + "h";
        } else if (milliseconds % $$.Constants.Time.MinuteMillis == 0) {
            return (milliseconds / $$.Constants.Time.MinuteMillis) + "m";
        } else if (milliseconds % $$.Constants.Time.SecondMillis == 0) {
            return (milliseconds / $$.Constants.Time.SecondMillis) + "s";
        } else {
            return milliseconds + "ms";
        }
        
    },
    IsBlank : function(s) {
        return $$.Text.Trim(s, true) === null;
    },
    ParseDateInput : function(dateString) {
        var str = $$.Text.Trim(dateString, true);
        if (str == null) {
            return null;
        }
        
        var d = str.split(new RegExp("\\D"));
        return new Date(d[0], --d[1], d[2]);
    },
    ParseTimeInterval : function(interval) {
        if (interval == null || !new RegExp("^\\d+\\D*$").test(interval)) {
            return null;
        }

        var parts = interval.split(new RegExp("(?<=\\d)(?=\\D)"));
        if (parts.length != 2) {
            return Number(interval);
        }

        var value = Number(parts[0]);
        switch (parts[1]) {
            case "s":
                return value * $$.Constants.Time.SecondMillis;
            case "m":
                return value * $$.Constants.Time.MinuteMillis;
            case "h":
                return value * $$.Constants.Time.HourMillis;
            case "d":
                return value * $$.Constants.Time.DayMillis;
            case "w":
                return value * $$.Constants.Time.WeekMillis;
            case "ms":
                return value;
            default:
                return null;
        }
    },
    Trim : function(str, toNull) {
        if (str == null) {
            return toNull === true ? null : "";
        }
     
        var s = str.toString().trim();
        if (toNull === true && s === "") {
            return null;
        }
        return s;
    }
};

/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from "ember";
var polyfills = Ember.Mixin.create({
  initPolyfill: function() {
    if (typeof Object.assign !== 'function') {
      Object.assign = function(target) {
        'use strict';
        if (target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    }
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this === null) {
          throw new TypeError(' this is null or not defined');
        }
        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If isCallable(callback) is false, throw a TypeError exception. 
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
          throw new TypeError(callback + ' is not a function');
        }
        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
          T = thisArg;
        }
        // 6. Let k be 0
        k = 0;
        // 7. Repeat, while k < len
        while (k < len) {
          var kValue;
          // a. Let Pk be ToString(k).
          //    This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty
          //    internal method of O with argument Pk.
          //    This step can be combined with c
          // c. If kPresent is true, then
          if (k in O) {
            // i. Let kValue be the result of calling the Get internal
            // method of O with argument Pk.
            kValue = O[k];
            // ii. Call the Call internal method of callback with T as
            // the this value and argument list containing kValue, k, and O.
            callback.call(T, kValue, k, O);
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
      };
    }
    if (!this.toLocaleStringSupportsLocales()) {
        var replaceSeparators = function(sNum, separators) {
            var sNumParts = sNum.split('.');
            if (separators && separators.thousands) {
                sNumParts[0] = sNumParts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + separators.thousands);
            }
            sNum = sNumParts.join(separators.decimal);

            return sNum;
        };

        var renderFormat = function(template, props) {
            for (var prop in props) {
                template = template.replace("{{" + prop + "}}", props[prop]);
            }

            return template;
        };

        var mapMatch = function(map, locale) {
            var match = locale;
            var language = locale && locale.toLowerCase().match(/^\w+/);

            if (!map.hasOwnProperty(locale)) {
                if (map.hasOwnProperty(language)) {
                    match = language;
                } else {
                    match = "en";
                }
            }

            return map[match];
        };

        var dotThousCommaDec = function(sNum) {
            var separators = {
                decimal: ',',
                thousands: '.'
            };

            return replaceSeparators(sNum, separators);
        };

        var commaThousDotDec = function(sNum) {
            var separators = {
                decimal: '.',
                thousands: ','
            };

            return replaceSeparators(sNum, separators);
        };

        var spaceThousCommaDec = function(sNum) {
            var seperators = {
                decimal: ',',
                thousands: '\u00A0'
            };

            return replaceSeparators(sNum, seperators);
        };
        
        var apostrophThousDotDec = function(sNum) {
            var seperators = {
                decimal: '.',
                thousands: '\u0027'
            };
            
            return replaceSeparators(sNum, seperators);
        };

        var transformForLocale = {
            en: commaThousDotDec,
            it: dotThousCommaDec,
            fr: spaceThousCommaDec,
            de: dotThousCommaDec,
            "de-DE": dotThousCommaDec,
            "de-AT": dotThousCommaDec,
            "de-CH": apostrophThousDotDec,
            "de-LI": apostrophThousDotDec,
            "de-BE": dotThousCommaDec,
            ro: dotThousCommaDec,
            "ro-RO": dotThousCommaDec,
            hu: spaceThousCommaDec,
            "hu-HU": spaceThousCommaDec,
            "da-DK": dotThousCommaDec,
            "nb-NO": spaceThousCommaDec
        };

        var currencyFormatMap = {
            en: "pre",
            it: "post",
            fr: "post",
            de: "post",
            "de-DE": "post",
            "de-AT": "prespace",
            "de-CH": "prespace",
            "de-LI": "post",
            "de-BE": "post",
            ro: "post",
            "ro-RO": "post",
            hu: "post",
            "hu-HU": "post",
            "da-DK": "post",
            "nb-NO": "post"
        };

        var currencySymbols = {
            "afn": "؋",
            "ars": "$",
            "awg": "ƒ",
            "aud": "$",
            "azn": "₼",
            "bsd": "$",
            "bbd": "$",
            "byr": "p.",
            "bzd": "BZ$",
            "bmd": "$",
            "bob": "Bs.",
            "bam": "KM",
            "bwp": "P",
            "bgn": "лв",
            "brl": "R$",
            "bnd": "$",
            "khr": "៛",
            "cad": "$",
            "kyd": "$",
            "clp": "$",
            "cny": "¥",
            "cop": "$",
            "crc": "₡",
            "hrk": "kn",
            "cup": "₱",
            "czk": "Kč",
            "dkk": "kr",
            "dop": "RD$",
            "xcd": "$",
            "egp": "£",
            "svc": "$",
            "eek": "kr",
            "eur": "€",
            "fkp": "£",
            "fjd": "$",
            "ghc": "¢",
            "gip": "£",
            "gtq": "Q",
            "ggp": "£",
            "gyd": "$",
            "hnl": "L",
            "hkd": "$",
            "huf": "Ft",
            "isk": "kr",
            "inr": "₹",
            "idr": "Rp",
            "irr": "﷼",
            "imp": "£",
            "ils": "₪",
            "jmd": "J$",
            "jpy": "¥",
            "jep": "£",
            "kes": "KSh",
            "kzt": "лв",
            "kpw": "₩",
            "krw": "₩",
            "kgs": "лв",
            "lak": "₭",
            "lvl": "Ls",
            "lbp": "£",
            "lrd": "$",
            "ltl": "Lt",
            "mkd": "ден",
            "myr": "RM",
            "mur": "₨",
            "mxn": "$",
            "mnt": "₮",
            "mzn": "MT",
            "nad": "$",
            "npr": "₨",
            "ang": "ƒ",
            "nzd": "$",
            "nio": "C$",
            "ngn": "₦",
            "nok": "kr",
            "omr": "﷼",
            "pkr": "₨",
            "pab": "B/.",
            "pyg": "Gs",
            "pen": "S/.",
            "php": "₱",
            "pln": "zł",
            "qar": "﷼",
            "ron": "lei",
            "rub": "₽",
            "shp": "£",
            "sar": "﷼",
            "rsd": "Дин.",
            "scr": "₨",
            "sgd": "$",
            "sbd": "$",
            "sos": "S",
            "zar": "R",
            "lkr": "₨",
            "sek": "kr",
            "chf": "CHF",
            "srd": "$",
            "syp": "£",
            "tzs": "TSh",
            "twd": "NT$",
            "thb": "฿",
            "ttd": "TT$",
            "try": "",
            "trl": "₤",
            "tvd": "$",
            "ugx": "USh",
            "uah": "₴",
            "gbp": "£",
            "usd": "$",
            "uyu": "$U",
            "uzs": "лв",
            "vef": "Bs",
            "vnd": "₫",
            "yer": "﷼",
            "zwd": "Z$"
        };

        var currencyFormats = {
            pre: "{{code}}{{num}}",
            post: "{{num}} {{code}}",
            prespace: "{{code}} {{num}}"
        };

        Number.prototype.toLocaleString = function(locale, options) {
            if (locale && locale.length < 2) {
              throw new RangeError("Invalid language tag: " + locale);
            }
            var sNum;

            if (options && options.minimumFractionDigits) {
                sNum = this.toFixed(options.minimumFractionDigits);
            } else {
                sNum = this.toString();
            }

            sNum = mapMatch(transformForLocale, locale)(sNum, options);

            if(options && options.currency && options.style === "currency") {
                var format = currencyFormats[mapMatch(currencyFormatMap, locale)];
                if(options.currencyDisplay === "code") {
                    sNum = renderFormat(format, {
                        num: sNum,
                        code: options.currency.toUpperCase()
                    });
                } else {
                    sNum = renderFormat(format, {
                        num: sNum,
                        code: currencySymbols[options.currency.toLowerCase()]
                    });
                }
            }

            return sNum;
        };
    }
  },
  toLocaleStringSupportsLocales: function() {
    var number = 0;
    try {
      number.toLocaleString("i");
    } catch (e) {
      return e.name === "RangeError";
    }
    return false;
  },
  render: function () {
    "use strict";
    this._super();
    this.initPolyfill();
  },
  activate: function() {
    "use strict";
    this._super.apply(this, arguments);
    Ember.run.schedule("afterRender", this, function () {
      this.initPolyfill();
    });
  }
});

export function initialize() {
  Ember.Route.reopen(polyfills);
}

export default {
  name: 'polyfills',
  initialize: initialize
};
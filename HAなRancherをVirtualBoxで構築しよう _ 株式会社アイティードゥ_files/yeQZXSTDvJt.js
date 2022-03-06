if (self.CavalryLogger) { CavalryLogger.start_js_script(document.currentScript); }

__d("GenderConst",[],(function(a,b,c,d,e,f){e.exports={NOT_A_PERSON:0,FEMALE_SINGULAR:1,MALE_SINGULAR:2,FEMALE_SINGULAR_GUESS:3,MALE_SINGULAR_GUESS:4,MIXED_UNKNOWN:5,NEUTER_SINGULAR:6,UNKNOWN_SINGULAR:7,FEMALE_PLURAL:8,MALE_PLURAL:9,NEUTER_PLURAL:10,UNKNOWN_PLURAL:11}}),null);
__d("IntlVariations",[],(function(a,b,c,d,e,f){e.exports={BITMASK_NUMBER:28,BITMASK_GENDER:3,NUMBER_ZERO:16,NUMBER_ONE:4,NUMBER_TWO:8,NUMBER_FEW:20,NUMBER_MANY:12,NUMBER_OTHER:24,GENDER_MALE:1,GENDER_FEMALE:2,GENDER_UNKNOWN:3}}),null);
__d("InlineFbtResult",["cr:1183579"],(function(a,b,c,d,e,f,g){g["default"]=b("cr:1183579")}),98);
__d("FbtReactUtil",[],(function(a,b,c,d,e,f){a=typeof Symbol==="function"&&Symbol["for"]&&Symbol["for"]("react.element")||60103;var g=!1;b={REACT_ELEMENT_TYPE:a,injectReactShim:function(a){var b={validated:!0};g?Object.defineProperty(a,"_store",{configurable:!1,enumerable:!1,writable:!1,value:b}):a._store=b}};e.exports=b}),null);
__d("FbtResult",["FbtReactUtil","FbtResultBase"],(function(a,b,c,d,e,f){var g=function(a){return a.content};a=function(a){"use strict";babelHelpers.inheritsLoose(c,a);function c(c,d){d=a.call(this,c,d)||this;d.$$typeof=b("FbtReactUtil").REACT_ELEMENT_TYPE;d.key=null;d.ref=null;d.type=g;d.props={content:c};return d}c.get=function(a){return new c(a.contents,a.errorListener)};return c}(b("FbtResultBase"));e.exports=a}),null);
__d("TransAppInlineMode",[],(function(a,b,c,d,e,f){a=Object.freeze({STRING_MANAGER:"STRING_MANAGER",TRANSLATION:"TRANSLATION",APPROVE:"APPROVE",REPORT:"REPORT",NO_INLINE:"NO_INLINE"});f["default"]=a}),66);
__d("getUnwrappedFbt",["FbtResultGK"],(function(a,b,c,d,e,f){function a(a){a=a.contents;var c=b("FbtResultGK").inlineMode,d=b("FbtResultGK").shouldReturnFbtResult;if(!d&&c!=="REPORT")return(a==null?void 0:a.length)===1&&typeof a[0]==="string"?a[0]:a}e.exports=a}),null);
__d("getFbtResult",["FbtResult","FbtResultGK","InlineFbtResult","getUnwrappedFbt","gkx","recoverableViolation"],(function(a,b,c,d,e,f,g){if(c("gkx")("708253")&&c("FbtResultGK").inlineMode==="TRANSLATION"){c("recoverableViolation")("TransAppInlineMode=TRANSLATION should not happen on Comet yet. "+("[inlineMode="+((b=c("FbtResultGK").inlineMode)!=null?b:"")+"]")+("[runtime_site_is_comet="+String(c("gkx")("708253"))+"]"),"internationalization")}function a(a){var b=c("getUnwrappedFbt")(a);if(b!=null)return b;b=a.contents;var d=a.patternString,e=a.patternHash;return c("FbtResultGK").inlineMode!=null&&c("FbtResultGK").inlineMode!=="NO_INLINE"?new(c("InlineFbtResult"))(b,c("FbtResultGK").inlineMode,d,e):c("FbtResult").get(a)}g["default"]=a}),98);
__d("errorCode",[],(function(a,b,c,d,e,f){"use strict";function a(a){throw new Error('errorCode("'+a+'"): This should not happen. Oh noes!')}f["default"]=a}),66);
__d("FbtErrorListenerWWW",["FBLogger","killswitch"],(function(a,b,c,d,e,f,g){a=function(){function a(a){this.$1=a.hash,this.$2=a.translation}var b=a.prototype;b.onStringSerializationError=function(a){var b="Context not logged.";if(!c("killswitch")("JS_RELIABILITY_FBT_LOGGING"))try{var d=JSON.stringify(a);d!=null&&(b=d.substr(0,250))}catch(a){b=a.message}d=(a==null?void 0:(d=a.constructor)==null?void 0:d.name)||"";c("FBLogger")("fbt").blameToPreviousDirectory().blameToPreviousDirectory().mustfix('Converting to a string will drop content data. Hash="%s" Translation="%s" Content="%s" (type=%s,%s)',this.$1,this.$2,b,typeof a,d)};b.onStringMethodUsed=function(a){c("FBLogger")("fbt").blameToPreviousDirectory().blameToPreviousDirectory().mustfix("Error using fbt string. Used method %s on Fbt string. Fbt string is designed to be immutable and should not be manipulated.",a)};return a}();g["default"]=a}),98);
__d("FbtPureStringResult",["FbtResult"],(function(a,b,c,d,e,f){a=function(a){"use strict";babelHelpers.inheritsLoose(b,a);function b(){return a.apply(this,arguments)||this}return b}(b("FbtResult"));e.exports=a}),null);
__d("getFbsResult",["FbtPureStringResult"],(function(a,b,c,d,e,f){function a(a){return new(b("FbtPureStringResult"))(a.contents,a.errorListener)}e.exports=a}),null);
__d("getTranslatedInput",[],(function(a,b,c,d,e,f){var g="B!N@$T",h={};function a(a){var b=a.table;typeof b==="string"&&b.startsWith(g)&&(b in h||(h[b]=JSON.parse(b.substring(g.length))),b=h[b]);return{table:b,args:a.args}}f["default"]=a}),66);
__d("translationOverrideListener",["requireDeferred"],(function(a,b,c,d,e,f,g){"use strict";var h=c("requireDeferred")("IntlQtEventFalcoEvent").__setRef("translationOverrideListener");function a(a){h.onReady(function(b){return b.log(function(){return{hash:a}})})}g["default"]=a}),98);
__d("FbtEnv",["FbtErrorListenerWWW","FbtHooks","IntlViewerContext","getFbsResult","getFbtResult","getTranslatedInput","promiseDone","requireDeferred","translationOverrideListener"],(function(a,b,c,d,e,f,g){"use strict";var h,i=c("requireDeferred")("FbtLogging").__setRef("FbtEnv"),j=!1;function a(){if(j)return;j=!0;(h||(h=b("FbtHooks"))).register({errorListener:function(a){return new(c("FbtErrorListenerWWW"))(a)},getFbsResult:c("getFbsResult"),getFbtResult:c("getFbtResult"),getTranslatedInput:c("getTranslatedInput"),onTranslationOverride:c("translationOverrideListener"),getViewerContext:function(){return c("IntlViewerContext")},logImpression:function(a){return c("promiseDone")(i.load().then(function(b){return b.logImpression==null?void 0:b.logImpression(a)}))}})}g.setupOnce=a}),98);
__d("FbtHooksImpl",[],(function(a,b,c,d,e,f){var g={};a={getErrorListener:function(a){return g.errorListener==null?void 0:g.errorListener(a)},logImpression:function(a){g.logImpression==null?void 0:g.logImpression(a)},onTranslationOverride:function(a){g.onTranslationOverride==null?void 0:g.onTranslationOverride(a)},getFbsResult:function(a){return g.getFbsResult(a)},getFbtResult:function(a){return g.getFbtResult(a)},getTranslatedInput:function(a){var b;return(b=g.getTranslatedInput==null?void 0:g.getTranslatedInput(a))!=null?b:a},getViewerContext:function(){return g.getViewerContext()},register:function(a){Object.assign(g,a)}};e.exports=a}),null);
__d("FbtHooks",["FbtEnv","FbtHooksImpl"],(function(a,b,c,d,e,f){e.exports=b("FbtHooksImpl"),b("FbtEnv").setupOnce()}),null);
__d("FbtTable",["invariant"],(function(a,b,c,d,e,f,g){"use strict";var h={ARG:{INDEX:0,SUBSTITUTION:1},access:function(a,b,c){if(c>=b.length){typeof a==="string"||Array.isArray(a)||g(0,21388,JSON.stringify(a));return a}var d=b[c];d=d[h.ARG.INDEX];if(d==null)return h.access(a,b,c+1);typeof a!=="string"&&!Array.isArray(a)||g(0,20954,typeof a);for(var e=0;e<d.length;++e){var f=a[d[e]];if(f==null)continue;f=h.access(f,b,c+1);if(f!=null)return f}return null}};e.exports=h}),null);
__d("FbtTableAccessor",[],(function(a,b,c,d,e,f){"use strict";a={getEnumResult:function(a){return[[a],null]},getGenderResult:function(a,b,c){return[a,b]},getNumberResult:function(a,b,c){return[a,b]},getSubstitution:function(a){return[null,a]},getPronounResult:function(a){return[[a,"*"],null]}};e.exports=a}),null);
__d("FbtNumberType",["FBLogger","IntlNumberTypeConfig","IntlVariations","createTrustedFunction","createTrustedScriptWithoutValidation_DO_NOT_USE"],(function(a,b,c,d,e,f,g){try{a=c("createTrustedFunction")(c("createTrustedScriptWithoutValidation_DO_NOT_USE")("IntlVariations"),c("createTrustedScriptWithoutValidation_DO_NOT_USE")('"use strict"; return (function(n) {'+c("IntlNumberTypeConfig").impl+"});"))(c("IntlVariations"))}catch(a){throw c("FBLogger")("i18n.error","FbtNumberType").catching(a).mustfixThrow("Unable to create variation number getter. Error=`%s`, IntlNumberTypeConfig=`%s`, IntlVariations=`%s`",a.message||a,JSON.stringify(c("IntlNumberTypeConfig")),JSON.stringify(c("IntlVariations")))}b={getVariation:a};d=b;g["default"]=d}),98);
__d("IntlNumberType",["FbtNumberType"],(function(a,b,c,d,e,f,g){a=function(a){return c("FbtNumberType")};g.get=a}),98);
__d("IntlVariationResolverImpl",["invariant","FbtHooks","IntlNumberType","IntlVariations"],(function(a,b,c,d,e,f,g){var h,i="_1";a={EXACTLY_ONE:i,getNumberVariations:function(a){var c=b("IntlNumberType").get((h||(h=b("FbtHooks"))).getViewerContext().locale).getVariation(a);c&b("IntlVariations").BITMASK_NUMBER||g(0,11647,c,typeof c);return a===1?[i,c,"*"]:[c,"*"]},getGenderVariations:function(a){a&b("IntlVariations").BITMASK_GENDER||g(0,11648,a,typeof a);return[a,"*"]}};e.exports=a}),null);
__d("IntlVariationResolver",["IntlVariationResolverImpl"],(function(a,b,c,d,e,f){a={getNumberVariations:function(a){return b("IntlVariationResolverImpl").getNumberVariations(a)},getGenderVariations:function(a){return b("IntlVariationResolverImpl").getGenderVariations(a)}};e.exports=a}),null);
__d("NumberFormatConsts",["NumberFormatConfig"],(function(a,b,c,d,e,f){a={get:function(a){return b("NumberFormatConfig")}};e.exports=a}),null);
__d("escapeRegex",[],(function(a,b,c,d,e,f){"use strict";function a(a){return a.replace(/([.?*+\^$\[\]\\(){}|\-])/g,"\\$1")}e.exports=a}),null);
__d("intlNumUtils",["FbtHooks","NumberFormatConsts","escapeRegex"],(function(a,b,c,d,e,f){var g,h=3;f=["\u0433\u0440\u043d.","\u0434\u0435\u043d.","\u043b\u0432.","\u043c\u0430\u043d.","\u0564\u0580.","\u062c.\u0645.","\u062f.\u0625.","\u062f.\u0627.","\u062f.\u0628.","\u062f.\u062a.","\u062f.\u062c.","\u062f.\u0639.","\u062f.\u0643.","\u062f.\u0644.","\u062f.\u0645.","\u0631.\u0633.","\u0631.\u0639.","\u0631.\u0642.","\u0631.\u064a.","\u0644.\u0633.","\u0644.\u0644.","\u0783.","B/.","Bs.","Fr.","kr.","L.","p.","S/."];var i={};function j(a){i[a]||(i[a]=new RegExp(a,"i"));return i[a]}var k=j(f.reduce(function(a,c,d){return a+(d?"|":"")+"("+b("escapeRegex")(c)+")"},""));function l(a,c,d,e,f,g,i){d===void 0&&(d="");e===void 0&&(e=".");f===void 0&&(f=0);g===void 0&&(g={primaryGroupSize:h,secondaryGroupSize:h});var k=g.primaryGroupSize||h;g=g.secondaryGroupSize||k;i=i&&i.digits;var l;c==null?l=a.toString():typeof a==="string"?l=r(a,c):l=p(a,c);a=l.split(".");c=a[0];l=a[1];if(Math.abs(parseInt(c,10)).toString().length>=f){a="$1"+d+"$2$3";f="(\\d)(\\d{"+(k-0)+"})($|\\D)";k=c.replace(j(f),a);if(k!=c){c=k;f="(\\d)(\\d{"+(g-0)+"})("+b("escapeRegex")(d)+")";g=j(f);while((k=c.replace(g,a))!=c)c=k}}i!=null&&(c=m(c,i),l=l&&m(l,i));d=c;l&&(d+=e+l);return d}function m(a,b){var c="";for(var d=0;d<a.length;++d){var e=b[a.charCodeAt(d)-48];c+=e!==void 0?e:a[d]}return c}function a(a,c){var d=b("NumberFormatConsts").get((g||(g=b("FbtHooks"))).getViewerContext().locale);return l(a,c,"",d.decimalSeparator,d.minDigitsForThousandsSeparator,d.standardDecimalPatternInfo,d.numberingSystemData)}function n(a,c){var d=b("NumberFormatConsts").get((g||(g=b("FbtHooks"))).getViewerContext().locale);return l(a,c,d.numberDelimiter,d.decimalSeparator,d.minDigitsForThousandsSeparator,d.standardDecimalPatternInfo,d.numberingSystemData)}function o(a){return a&&Math.floor(Math.log10(Math.abs(a)))}function c(a,b,c){var d=o(a),e=a;d<c&&(e=a*Math.pow(10,-d+c));a=Math.pow(10,o(e)-c+1);e=Math.round(e/a)*a;if(d<c){e/=Math.pow(10,-d+c);if(b==null)return n(e,c-d-1)}return n(e,b)}function p(a,b){b=b==null?0:b;var c=Math.pow(10,b);a=a;a=Math.round(a*c)/c;a+="";if(!b)return a;if(a.indexOf("e-")!==-1)return a;c=a.indexOf(".");var d;c==-1?(a+=".",d=b):d=b-(a.length-c-1);for(var b=0,c=d;b<c;b++)a+="0";return a}var q=function(a,b){a=a;for(var c=0;c<b;c++)a+="0";return a};function r(a,b){var c=a.indexOf("."),d=c===-1?a:a.slice(0,c);a=c===-1?"":a.slice(c+1);return b!=null?d+"."+q(a.slice(0,b),b-a.length):d}function s(a,c,d){d===void 0&&(d="");var e=u(),f=a;e&&(f=a.split("").map(function(a){return e[a]||a}).join("").trim());f=f.replace(/^[^\d]*\-/,"\x02");f=f.replace(k,"");a=b("escapeRegex")(c);c=b("escapeRegex")(d);d=j("^[^\\d]*\\d.*"+a+".*\\d[^\\d]*$");if(!d.test(f)){d=j("(^[^\\d]*)"+a+"(\\d*[^\\d]*$)");if(d.test(f)){f=f.replace(d,"$1\x01$2");return t(f)}d=j("^[^\\d]*[\\d "+b("escapeRegex")(c)+"]*[^\\d]*$");d.test(f)||(f="");return t(f)}d=j("(^[^\\d]*[\\d "+c+"]*)"+a+"(\\d*[^\\d]*$)");f=d.test(f)?f.replace(d,"$1\x01$2"):"";return t(f)}function t(a){a=a.replace(/[^0-9\u0001\u0002]/g,"").replace("\x01",".").replace("\x02","-");var b=Number(a);return a===""||isNaN(b)?null:b}function u(){var a=b("NumberFormatConsts").get((g||(g=b("FbtHooks"))).getViewerContext().locale),c={};a=a.numberingSystemData&&a.numberingSystemData.digits;if(a==null)return null;for(var d=0;d<a.length;d++)c[a.charAt(d)]=d.toString();return c}function d(a){var c=b("NumberFormatConsts").get((g||(g=b("FbtHooks"))).getViewerContext().locale);return s(a,c.decimalSeparator||".",c.numberDelimiter)}var v={formatNumber:a,formatNumberRaw:l,formatNumberWithThousandDelimiters:n,formatNumberWithLimitedSigFig:c,parseNumber:d,parseNumberRaw:s,truncateLongNumber:r,getFloatString:function(a,b,c){a=String(a);a=a.split(".");b=v.getIntegerString(a[0],b);return a.length===1?b:b+c+a[1]},getIntegerString:function(a,b){b=b;b===""&&(b=",");a=String(a);var c=/(\d+)(\d{3})/;while(c.test(a))a=a.replace(c,"$1"+b+"$2");return a}};e.exports=v}),null);
__d("IntlPhonologicalRewrites",["IntlPhonologicalRules"],(function(a,b,c,d,e,f){"use strict";a={get:function(a){return b("IntlPhonologicalRules")}};e.exports=a}),null);
__d("IntlRedundantStops",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({equivalencies:{".":["\u0964","\u104b","\u3002"],"\u2026":["\u0e2f","\u0eaf","\u1801"],"!":["\uff01"],"?":["\uff1f"]},redundancies:{"?":["?",".","!","\u2026"],"!":["!","?","."],".":[".","!"],"\u2026":["\u2026",".","!"]}})}),null);
__d("IntlPunctuation",["FbtHooks","IntlPhonologicalRewrites","IntlRedundantStops"],(function(a,b,c,d,e,f,g){d="[.!?\u3002\uff01\uff1f\u0964\u2026\u0eaf\u1801\u0e2f\uff0e]";var h={};function i(a){var b;b=(b=a)!=null?b:"";var c=h[b];c==null&&(c=h[b]=j(a));return c}function j(a){var b=[];a=c("IntlPhonologicalRewrites").get(a);for(var d in a.patterns){var e=a.patterns[d];for(var f in a.meta){var g=new RegExp(f.slice(1,-1),"g"),h=a.meta[f];d=d.replace(g,h);e=e.replace(g,h)}e==="javascript"&&(e=function(a){return a.slice(1).toLowerCase()});b.push([new RegExp(d.slice(1,-1),"g"),e])}return b}function a(a){var b=i(c("FbtHooks").getViewerContext().locale);a=a;for(var d=0;d<b.length;d++){var e=b[d],f=e[0];e=e[1];a=a.replace(f,e)}return a.replace(/\x01/g,"")}var k=new Map();for(var l in c("IntlRedundantStops").equivalencies)for(var e=[l].concat(c("IntlRedundantStops").equivalencies[l]),f=Array.isArray(e),m=0,e=f?e:e[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var n;if(f){if(m>=e.length)break;n=e[m++]}else{m=e.next();if(m.done)break;n=m.value}n=n;k.set(n,l)}var o=new Map();for(var p in c("IntlRedundantStops").redundancies)o.set(p,new Set(c("IntlRedundantStops").redundancies[p]));function q(a,b){a=k.get(a);b=k.get(b);return((a=o.get(a))==null?void 0:a.has(b))===!0}function b(a,b){return q(a[a.length-1],b)?"":b}g.PUNCT_CHAR_CLASS=d;g.applyPhonologicalRules=a;g.dedupeStops=b}),98);
__d("substituteTokens",["invariant","IntlPunctuation"],(function(a,b,c,d,e,f,g,h){b=Object.prototype.hasOwnProperty;var i=new RegExp("\\{([^}]+)\\}("+d("IntlPunctuation").PUNCT_CHAR_CLASS+"*)","g");function j(a){return a}function a(a,b){if(b==null)return a;typeof b==="object"||h(0,6041,a);var c=[],e=[];a=a.replace(i,function(a,f,g){a=b[f];if(a!=null&&typeof a==="object"){c.push(a);e.push(f);return"\x17"+g}else if(a===null)return"";return String(a)+d("IntlPunctuation").dedupeStops(String(a),g)}).split("\x17").map(d("IntlPunctuation").applyPhonologicalRules);if(a.length===1)return a[0];var f=a[0]!==""?[a[0]]:[];for(var g=0;g<c.length;g++)f.push(j(c[g])),a[g+1]!==""&&f.push(a[g+1]);return f}f.exports=a}),34);
__d("fbt",["invariant","FbtEnv","FbtHooks","FbtQTOverrides","FbtResultBase","FbtTable","FbtTableAccessor","GenderConst","IntlVariationResolver","intlNumUtils","substituteTokens"],(function(a,b,c,d,e,f,g){var h;b("FbtEnv").setupOnce();var i=b("FbtQTOverrides").overrides,j=b("IntlVariationResolver").getGenderVariations,k=b("IntlVariationResolver").getNumberVariations,l=Object.prototype.hasOwnProperty,m=!1,n=b("FbtTable").ARG,o={number:0,gender:1},p={object:0,possessive:1,reflexive:2,subject:3},q={};function a(a,c,d){if(((d==null?void 0:d.hk)||(d==null?void 0:d.ehk))&&m)return{text:a,fbt:!0,hashKey:d.hk};a=(h||(h=b("FbtHooks"))).getTranslatedInput({table:a,args:c,options:d});c=a.args;d=a.table;a={};if(d.__vcg!=null){c=c||[];var e=(h||(h=b("FbtHooks"))).getViewerContext();e=e.GENDER;var f=j(e);c.unshift(b("FbtTableAccessor").getGenderResult(f,null,e))}c&&(typeof d!=="string"&&(d=b("FbtTable").access(d,c,0)),a=r(c),d!==null||g(0,479));var k;if(Array.isArray(d)){f=d[0];k=d[1];e="1_"+k;i[e]!=null&&i[e]!==""&&(f=i[e],(h||(h=b("FbtHooks"))).onTranslationOverride(k));(h||(h=b("FbtHooks"))).logImpression(k)}else if(typeof d==="string")f=d;else throw new Error("Table access did not result in string: "+(d===void 0?"undefined":JSON.stringify(d))+", Type: "+typeof d);c=q[f];e=s(a);if(c&&!e)return c;else{d=b("substituteTokens")(f,a);c=this._wrapContent(d,f,k);e||(q[f]=c);return c}}function r(a){var b={};a.forEach(function(a){a=a[n.SUBSTITUTION];if(!a)return;for(var c in a)l.call(a,c)&&(b[c]==null||g(0,56656,c),b[c]=a[c])});return b}function s(a){for(var b in a)return!0;return!1}function c(a,c){return b("FbtTableAccessor").getEnumResult(a)}function d(a){return b("FbtTableAccessor").getGenderResult(j(a),null,a)}function f(a,c,d){var e;e=(e={},e[a]=c,e);if(d)if(d[0]===o.number){var f=d.length>1?d[1]:c;typeof f==="number"||g(0,484);var h=k(f);typeof c==="number"&&(e[a]=b("intlNumUtils").formatNumberWithThousandDelimiters(c));return b("FbtTableAccessor").getNumberResult(h,e,f)}else if(d[0]===o.gender){a=d[1];a!=null||g(0,485);return b("FbtTableAccessor").getGenderResult(j(a),e,a)}else g(0,486);else return b("FbtTableAccessor").getSubstitution(e)}function t(a,b,c){return this._param(a,b,c)}function u(a,c,d){var e=k(a),f={};c&&(typeof d==="number"?f[c]=b("intlNumUtils").formatNumberWithThousandDelimiters(d):f[c]=d||b("intlNumUtils").formatNumberWithThousandDelimiters(a));return b("FbtTableAccessor").getNumberResult(e,f,a)}function v(a,c,d){c!==b("GenderConst").NOT_A_PERSON||!d||!d.human||g(0,11835);d=w(a,c);return b("FbtTableAccessor").getPronounResult(d)}function w(a,c){switch(c){case b("GenderConst").NOT_A_PERSON:return a===p.object||a===p.reflexive?b("GenderConst").NOT_A_PERSON:b("GenderConst").UNKNOWN_PLURAL;case b("GenderConst").FEMALE_SINGULAR:case b("GenderConst").FEMALE_SINGULAR_GUESS:return b("GenderConst").FEMALE_SINGULAR;case b("GenderConst").MALE_SINGULAR:case b("GenderConst").MALE_SINGULAR_GUESS:return b("GenderConst").MALE_SINGULAR;case b("GenderConst").MIXED_UNKNOWN:case b("GenderConst").FEMALE_PLURAL:case b("GenderConst").MALE_PLURAL:case b("GenderConst").NEUTER_PLURAL:case b("GenderConst").UNKNOWN_PLURAL:return b("GenderConst").UNKNOWN_PLURAL;case b("GenderConst").NEUTER_SINGULAR:case b("GenderConst").UNKNOWN_SINGULAR:return a===p.reflexive?b("GenderConst").NOT_A_PERSON:b("GenderConst").UNKNOWN_PLURAL}return b("GenderConst").NOT_A_PERSON}function x(a,c,d){var e=j(d),f={};f[a]=c;return b("FbtTableAccessor").getGenderResult(e,f,d)}function y(a,c,d){a=typeof a==="string"?[a]:a;var e=(h||(h=b("FbtHooks"))).getErrorListener({translation:c,hash:d});a=h.getFbtResult({contents:a,errorListener:e,patternHash:d,patternString:c});return a}function z(){m=!0}function A(){m=!1}function B(a){return a instanceof b("FbtResultBase")}var C=function(){};C._=a;C._enum=c;C._implicitParam=t;C._name=x;C._param=f;C._plural=u;C._pronoun=v;C._subject=d;C._wrapContent=y;C.disableJsonExportMode=A;C.enableJsonExportMode=z;C.isFbtInstance=B;e.exports=C}),null);
__d("getAsyncHeaders",["LSD","ZeroCategoryHeader","isFacebookURI","killswitch"],(function(a,b,c,d,e,f,g){function a(a){var b={},d=c("isFacebookURI")(a);d&&c("ZeroCategoryHeader").value&&(b[c("ZeroCategoryHeader").header]=c("ZeroCategoryHeader").value);d=h(a);d&&(b["X-FB-LSD"]=d);return b}function h(a){if(c("killswitch")("SAF_JS_FB_X_LSD_HEADER"))return null;return!a.toString().startsWith("/")&&a.getOrigin()!==document.location.origin?null:c("LSD").token}g["default"]=a}),98);
__d("isBulletinDotComURI",[],(function(a,b,c,d,e,f){var g=new RegExp("(^|\\.)bulletin\\.com$","i"),h=["https"];function a(a){if(a.isEmpty()&&a.toString()!=="#")return!1;return!a.getDomain()&&!a.getProtocol()?!1:h.indexOf(a.getProtocol())!==-1&&g.test(a.getDomain())}f["default"]=a}),66);
__d("randomInt",["invariant"],(function(a,b,c,d,e,f,g,h){function a(a,b){a=b===void 0?[0,a]:[a,b];b=a[0];a=a[1];a>b||h(0,1180,a,b);var c=this.random;c=c&&typeof c==="function"?c:Math.random;return Math.floor(b+c()*(a-b))}g["default"]=a}),98);
__d("ClientIDs",["randomInt"],(function(a,b,c,d,e,f,g){var h=new Set();function a(){var a=Date.now();a=a+":"+(c("randomInt")(0,4294967295)+1);h.add(a);return a}function b(a){return h.has(a)}g.getNewClientID=a;g.isExistingClientID=b}),98);
__d("normalizeBoundingClientRect",[],(function(a,b,c,d,e,f){"use strict";function a(a,b){a=a.ownerDocument.documentElement;var c=a?a.clientLeft:0;a=a?a.clientTop:0;var d=Math.round(b.left)-c;c=Math.round(b.right)-c;var e=Math.round(b.top)-a;b=Math.round(b.bottom)-a;return{left:d,right:c,top:e,bottom:b,width:c-d,height:b-e}}f["default"]=a}),66);
__d("getElementRect",["containsNode","normalizeBoundingClientRect"],(function(a,b,c,d,e,f,g){function a(a){var b;b=a==null?void 0:(b=a.ownerDocument)==null?void 0:b.documentElement;return!a||!("getBoundingClientRect"in a)||!c("containsNode")(b,a)?{left:0,right:0,top:0,bottom:0,width:0,height:0}:c("normalizeBoundingClientRect")(a,a.getBoundingClientRect())}g["default"]=a}),98);
//特殊字符
var specialwordList = [
  '"', '&', '<', '>',
  ' ', ' ', ' ', ' ',
  '<', '>', '&', '"',
  '©', '®', '™', '×', '÷',
  ' ', '¡', '¢', '£', '¤',
  '¥', '¦', '§', '¨', '©',
  'ª', '«', '¬', '­', '®',
  '¯', '°', '±', '²', '³',
  '´', 'µ', '¶', '·', '¸',
  '¹', 'º', '»', '¼', '½',
  '¾', '¿', 'À', 'Á', 'Â',
  'Ã', 'Ä', 'Å', 'Æ', 'Ç',
  'È', 'É', 'Ê', 'Ë', 'Ì',
  'Í', 'Î', 'Ï', 'Ð', 'Ñ',
  'Ò', 'Ó', 'Ô', 'Õ', 'Ö',
  '×', 'Ø', 'Ù', 'Ú', 'Û',
  'Ü', 'Ý', 'Þ', 'ß', 'à',
  'á', 'â', 'ã', 'ä', 'å',
  'æ', 'ç', 'è', 'é', 'ê',
  'ë', 'ì', 'í', 'î', 'ï',
  'ð', 'ñ', 'ò', 'ó', 'ô',
  'õ', 'ö', '÷', 'ø', 'ù',
  'ú', 'û', 'ü', 'ý', 'þ', 'ÿ',
  'ƒ', 'Α', 'Β', 'Γ', 'Δ',
  'Ε', 'Ζ', 'Η', 'Θ', 'Ι',
  'Κ', 'Λ', 'Μ', 'Ν', 'Ξ',
  'Ο', 'Π', 'Ρ', 'Σ', 'Τ',
  'Υ', 'Φ', 'Χ', 'Ψ', 'Ω',
  'α', 'β', 'γ', 'δ', 'ε',
  'ζ', 'η', 'θ', 'ι', 'κ',
  'λ', 'μ', 'ν', 'ξ', 'ο',
  'π', 'ρ', 'ς', 'σ', 'τ',
  'υ', 'φ', 'χ', 'ψ', 'ω',
  'ϑ', 'ϒ', 'ϖ', '•', '…',
  '′', '″', '‾', '⁄', '℘',
  'ℑ', 'ℜ', '™', 'ℵ', '←',
  '↑', '→', '↓', '↔', '↵',
  '⇐', '⇑', '⇒', '⇓', '⇔',
  '∀', '∂', '∃', '∅', '∇',
  '∈', '∉', '∋', '∏', '∑',
  '−', '∗', '√', '∝', '∞',
  '∠', '∧', '∨', '∩', '∪',
  '∫', '∴', '∼', '≅', '≈',
  '≠', '≡', '≤', '≥', '⊂',
  '⊃', '⊄', '⊆', '⊇', '⊕',
  '⊗', '⊥', '⋅', '⌈', '⌉',
  '⌊', '⌋', '⟨', '⟩', '◊',
  '♠', '♣', '♥', '♦',
  '"', '&', '<', '>', 'Œ',
  'œ', 'Š', 'š', 'Ÿ', 'ˆ',
  '˜', ' ', ' ', ' ', '‌',
  '‍', '‎', '‏', '–', '—',
  '‘', '’', '‚', '“', '”',
  '„', '†', '‡', '‰', '‹',
  '›', '€'
  ];
  
  //转义字符
  var transWordList = [
  '&quot;', '&amp;', '&lt;', '&gt;',
  '&nbsp;', '&ensp;', '&emsp;', '&nbsp;',
  '&lt;', '&gt;', '&amp;', '&quot;',
  '&copy;', '&reg;', '&trade;', '&times;', '&divide;',
  '&nbsp;', '&iexcl;', '&cent;', '&pound;', '&curren;',
  '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;',
  '&ordf;', '&laquo;', '&not;', '&shy;', '&reg;',
  '&macr;', '&deg;', '&plusmn;', '&sup2;', '&sup3;',
  '&acute;', '&micro;', '&para;', '&middot;', '&cedil;',
  '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;',
  '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;',
  '&Atilde;', '&Auml;', '&Aring;', '&AElig;', '&Ccedil;',
  '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;',
  '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;', '&Ntilde;',
  '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;',
  '&times;', '&Oslash;', '&Ugrave;', '&Uacute;', '&Ucirc;',
  '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;',
  '&aacute;', '&acirc;', '&atilde;', '&auml;', '&aring;',
  '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;',
  '&euml;', '&igrave;', '&iacute;', '&icirc;', '&iuml;',
  '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;',
  '&otilde;', '&ouml;', '&divide;', '&oslash;', '&ugrave;',
  '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;',
  '&fnof;', '&Alpha;', '&Beta;', '&Gamma;', '&Delta;',
  '&Epsilon;', '&Zeta;', '&Eta;', '&Theta;', '&Iota;',
  '&Kappa;', '&Lambda;', '&Mu;', '&Nu;', '&Xi;',
  '&Omicron;', '&Pi;', '&Rho;', '&Sigma;', '&Tau;',
  '&Upsilon;', '&Phi;', '&Chi;', '&Psi;', '&Omega;',
  '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;',
  '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;',
  '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;',
  '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;',
  '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;',
  '&thetasym;', '&upsih;', '&piv;', '&bull;', '&hellip;',
  '&prime;', '&Prime;', '&oline;', '&frasl;', '&weierp;',
  '&image;', '&real;', '&trade;', '&alefsym;', '&larr;',
  '&uarr;', '&rarr;', '&darr;', '&harr;', '&crarr;',
  '&lArr;', '&uArr;', '&rArr;', '&dArr;', '&hArr;',
  '&forall;', '&part;', '&exist;', '&empty;', '&nabla;',
  '&isin;', '&notin;', '&ni;', '&prod;', '&sum;',
  '&minus;', '&lowast;', '&radic;', '&prop;', '&infin;',
  '&ang;', '&and;', '&or;', '&cap;', '&cup;',
  '&int;', '&there4;', '&sim;', '&cong;', '&asymp;',
  '&ne;', '&equiv;', '&le;', '&ge;', '&sub;',
  '&sup;', '&nsub;', '&sube;', '&supe;', '&oplus;',
  '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;',
  '&lfloor;', '&rfloor;', '&lang;', '&rang;', '&loz;',
  '&spades;', '&clubs;', '&hearts;', '&diams;',
  '&quot;', '&amp;', '&lt;', '&gt;', '&OElig;',
  '&oelig;', '&Scaron;', '&scaron;', '&Yuml;', '&circ;',
  '&tilde;', '&ensp;', '&emsp;', '&thinsp;', '&zwnj;',
  '&zwj;', '&lrm;', '&rlm;', '&ndash;', '&mdash;',
  '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;',
  '&bdquo;', '&dagger;', '&Dagger;', '&permil;', '&lsaquo;',
  '&rsaquo;', '&euro;'
  ];
  
  //单个字符 特殊字符 -> 转义字符
  exports.sw2tw_char = function(special) {
      var tw;
      specialwordList.forEach(function (value, index, array) {
          if (value == special) tw = transWordList[index];
          return;
      });
      return tw;
  }
  
  //单个字符 转义字符 -> 特殊字符
  exports.tw2sw_char = function (trans) {
      var sw;
      transWordList.forEach(function (value, index, array) {
        console.log(value);
          if (value == trans) sw = specialwordList[index];
          return;
      });
      return sw;
  }
  
  //全部替换方法
  String.prototype.replaceAll = function (s1, s2) {
      return this.replace(new RegExp(s1, "gm"), s2);
  }
  
  //字符串  转义字符 -> 特殊字符
  exports.tw2sw_string = function (txt) {
      transWordList.forEach(function (value, index, array) {
          txt = txt.replaceAll(value, specialwordList[index]);
      });
      return txt;
  }
  
  //字符串  特殊字符 -> 转义字符
  exports.sw2tw_string = function (txt) {
      specialwordList.forEach(function (value, index, array) {
          txt = txt.replaceAll(value, transWordList[index]);
      });
      return txt;
  }
/* SVG (c) Robby Kraft, MIT License */
(function(a,b){"object"==typeof exports&&"undefined"!=typeof module?b(exports):"function"==typeof define&&define.amd?define(["exports"],b):b(a.SVG={})})(this,function(a){"use strict";function b(a){var b="    ";isNaN(parseInt(a))?b=a:1===a?b=" ":2===a?b="  ":3===a?b="   ":4===a?b="    ":5===a?b="     ":6===a?b="      ":7===a?b="       ":8===a?b="        ":9===a?b="         ":10===a?b="          ":11===a?b="           ":12===a?b="            ":void 0;var c=["\n"];for(let d=0;100>d;d++)c.push(c[d]+b);return c}function c(){this.step="\t",this.shift=b(this.step)}function d(a,b){return b-(a.replace(/\(/g,"").length-a.replace(/\)/g,"").length)}function e(a,b){return a.replace(/\s{1,}/g," ").replace(/ AND /ig,"~::~"+b+b+"AND ").replace(/ BETWEEN /ig,"~::~"+b+"BETWEEN ").replace(/ CASE /ig,"~::~"+b+"CASE ").replace(/ ELSE /ig,"~::~"+b+"ELSE ").replace(/ END /ig,"~::~"+b+"END ").replace(/ FROM /ig,"~::~FROM ").replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ").replace(/ HAVING /ig,"~::~HAVING ").replace(/ IN /ig," IN ").replace(/ JOIN /ig,"~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ").replace(/ ON /ig,"~::~"+b+"ON ").replace(/ OR /ig,"~::~"+b+b+"OR ").replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ").replace(/ OVER /ig,"~::~"+b+"OVER ").replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ").replace(/\)\s{0,}SELECT /ig,")~::~SELECT ").replace(/ THEN /ig," THEN~::~"+b+"").replace(/ UNION /ig,"~::~UNION~::~").replace(/ USING /ig,"~::~USING ").replace(/ WHEN /ig,"~::~"+b+"WHEN ").replace(/ WHERE /ig,"~::~WHERE ").replace(/ WITH /ig,"~::~WITH ").replace(/ ALL /ig," ALL ").replace(/ AS /ig," AS ").replace(/ ASC /ig," ASC ").replace(/ DESC /ig," DESC ").replace(/ DISTINCT /ig," DISTINCT ").replace(/ EXISTS /ig," EXISTS ").replace(/ NOT /ig," NOT ").replace(/ NULL /ig," NULL ").replace(/ LIKE /ig," LIKE ").replace(/\s{0,}SELECT /ig,"SELECT ").replace(/\s{0,}UPDATE /ig,"UPDATE ").replace(/ SET /ig," SET ").replace(/~::~{1,}/g,"~::~").split("~::~")}function f(a,b,c){let d=document.createElementNS(t,"svg");return h(d,a,b,c),d}function h(a,b,c,d){null!=b&&a.setAttributeNS(null,"class",b),null!=c&&a.setAttributeNS(null,"id",c),null!=d&&d.appendChild(a)}function i(a,b){if(null!=b&&b.constructor===Array){let c=b.map(a=>a.constructor===Array?a:[a.x,a.y]).reduce((a,b)=>a+b[0]+","+b[1]+" ","");a.setAttributeNS(null,"points",c)}}function j(a,b,c,e,f,g=0){let h=e/1-e,d=[b-h-g,c-h-g,e+2*h+2*g,f+2*h+2*g].join(" ");a.setAttributeNS(null,"viewBox",d)}function k(a){let b=a.getBoundingClientRect(),c=0==b.width?640:b.width,d=0==b.height?480:b.height;j(a,0,0,c,d)}function l(a){let b=a.getAttribute("viewBox");return null==b?void 0:b.split(" ").map(a=>parseFloat(a))}function m(a,b,c=0,d=0){1e-8>b&&(b=.01);let e=a.createSVGMatrix().translate(c,d).scale(1/b).translate(-c,-d),f=l(a);null==f&&k(a);let g=a.createSVGPoint(),h=a.createSVGPoint();g.x=f[0],g.y=f[1],h.x=f[0]+f[2],h.y=f[1]+f[3];let i=g.matrixTransform(e),m=h.matrixTransform(e);j(a,i.x,i.y,m.x-i.x,m.y-i.y)}function n(a,b,c){let d=l(a);null==d&&k(a),d[0]+=b,d[1]+=c,a.setAttributeNS(null,"viewBox",d.join(" "))}function o(a,b,c){let d=a.createSVGPoint();d.x=b,d.y=c;let e=d.matrixTransform(a.getScreenCTM().inverse());var f=[e.x,e.y];return f.x=e.x,f.y=e.y,f}function p(b,c="image.svg"){var d=document.createElement("a"),a=new window.XMLSerializer().serializeToString(b);let e=s.xml(a);var f=new Blob([e],{type:"text/plain"});d.setAttribute("href",window.URL.createObjectURL(f)),d.setAttribute("download",c),d.click()}function q(a){var b=document.createElement("style");b.textContent=a,document.body.appendChild(b);var c=b.sheet.cssRules;return document.body.removeChild(b),c}function r(a,b){if("string"==typeof a||a instanceof String){var c=new window.DOMParser().parseFromString(a,"text/xml");if(0===c.getElementsByTagNameNS(u,"parsererror").length)return null!=b&&b(c),c;fetch(a).then(a=>a.text()).then(a=>new window.DOMParser().parseFromString(a,"text/xml")).then(a=>{var c,d=a.getElementsByTagName("style")[0];null!=d&&null!=d.childNodes&&0<d.childNodes.length&&(c=q(d.childNodes[0].nodeValue));var e=a.getElementsByTagName("svg");if(null==e||0==e.length)throw"error, the svg parser found valid XML but couldn't find an SVG element";let f=e[0];return null!=b&&b(f),f}).catch(a=>b(null,a))}else if(a instanceof Document)return b(a),a}c.prototype.xml=function(a,c){var d=a.replace(/>\s{0,}</g,"><").replace(/</g,"~::~<").replace(/\s*xmlns\:/g,"~::~xmlns:").replace(/\s*xmlns\=/g,"~::~xmlns=").split("~::~"),e=d.length,f=!1,g=0,h="",i=c?b(c):this.shift;for(let b=0;b<e;b++)-1<d[b].search(/<!/)?(h+=i[g]+d[b],f=!0,(-1<d[b].search(/-->/)||-1<d[b].search(/\]>/)||-1<d[b].search(/!DOCTYPE/))&&(f=!1)):-1<d[b].search(/-->/)||-1<d[b].search(/\]>/)?(h+=d[b],f=!1):/^<\w/.exec(d[b-1])&&/^<\/\w/.exec(d[b])&&/^<[\w:\-\.\,]+/.exec(d[b-1])==/^<\/[\w:\-\.\,]+/.exec(d[b])[0].replace("/","")?(h+=d[b],f||g--):-1<d[b].search(/<\w/)&&-1==d[b].search(/<\//)&&-1==d[b].search(/\/>/)?h=f?h+=d[b]:h+=i[g++]+d[b]:-1<d[b].search(/<\w/)&&-1<d[b].search(/<\//)?h=f?h+=d[b]:h+=i[g]+d[b]:-1<d[b].search(/<\//)?h=f?h+=d[b]:h+=i[--g]+d[b]:-1<d[b].search(/\/>/)?h=f?h+=d[b]:h+=i[g]+d[b]:h+=-1<d[b].search(/<\?/)?i[g]+d[b]:-1<d[b].search(/xmlns\:/)||-1<d[b].search(/xmlns\=/)?i[g]+d[b]:d[b];return"\n"==h[0]?h.slice(1):h},c.prototype.json=function(a,b){var b=b?b:this.step;return"undefined"==typeof JSON?a:"string"==typeof a?JSON.stringify(JSON.parse(a),null,b):"object"==typeof a?JSON.stringify(a,null,b):a},c.prototype.css=function(a,c){var d=a.replace(/\s{1,}/g," ").replace(/\{/g,"{~::~").replace(/\}/g,"~::~}~::~").replace(/\;/g,";~::~").replace(/\/\*/g,"~::~/*").replace(/\*\//g,"*/~::~").replace(/~::~\s{0,}~::~/g,"~::~").split("~::~"),e=d.length,f=0,g="",h=c?b(c):this.shift;for(let b=0;b<e;b++)g+=/\{/.exec(d[b])?h[f++]+d[b]:/\}/.exec(d[b])?h[--f]+d[b]:/\*\\/.exec(d[b])?h[f]+d[b]:h[f]+d[b];return g.replace(/^\n{1,}/,"")},c.prototype.sql=function(a,c){var f=a.replace(/\s{1,}/g," ").replace(/\'/ig,"~::~'").split("~::~"),g=f.length,h=[],i=0,j=this.step,k=0,l="",m=c?b(c):this.shift;for(let b=0;b<g;b++)h=b%2?h.concat(f[b]):h.concat(e(f[b],j));g=h.length;for(let b=0;b<g;b++)k=d(h[b],k),/\s{0,}\s{0,}SELECT\s{0,}/.exec(h[b])&&(h[b]=h[b].replace(/\,/g,",\n"+j+j+"")),/\s{0,}\s{0,}SET\s{0,}/.exec(h[b])&&(h[b]=h[b].replace(/\,/g,",\n"+j+j+"")),/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(h[b])?(i++,l+=m[i]+h[b]):/\'/.exec(h[b])?(1>k&&i&&i--,l+=h[b]):(l+=m[i]+h[b],1>k&&i&&i--);return l=l.replace(/^\n{1,}/,"").replace(/\n{1,}/g,"\n"),l},c.prototype.xmlmin=function(a,b){var c=b?a:a.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g," xmlns");return c.replace(/>\s{0,}</g,"><")},c.prototype.jsonmin=function(a){return"undefined"==typeof JSON?a:JSON.stringify(JSON.parse(a),null,0)},c.prototype.cssmin=function(a,b){var c=b?a:a.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"");return c.replace(/\s{1,}/g," ").replace(/\{\s{1,}/g,"{").replace(/\}\s{1,}/g,"}").replace(/\;\s{1,}/g,";").replace(/\/\*\s{1,}/g,"/*").replace(/\*\/\s{1,}/g,"*/")},c.prototype.sqlmin=function(a){return a.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")")};var s=new c;const t="http://www.w3.org/2000/svg",u=new window.DOMParser().parseFromString("INVALID","text/xml").getElementsByTagName("parsererror")[0].namespaceURI;a.View=function(){function a(a,b){i.prev=i.position,i.position=o(e,a,b),i.x=i.position[0],i.y=i.position[1]}function b(){e.onmousemove=function(b){a(b.clientX,b.clientY),i.isPressed&&(i.drag=[i.position[0]-i.pressed[0],i.position[1]-i.pressed[1]],i.drag.x=i.drag[0],i.drag.y=i.drag[1]),null!=z&&z(Object.assign({},i))},e.onmousedown=function(a){i.isPressed=!0,i.pressed=o(e,a.clientX,a.clientY),null!=A&&A(Object.assign({},i))},e.onmouseup=function(){i.isPressed=!1,null!=B&&B(Object.assign({},i))},e.onmouseleave=function(b){a(b.clientX,b.clientY),null!=C&&C(Object.assign({},i))},e.onmouseenter=function(b){a(b.clientX,b.clientY),null!=D&&D(Object.assign({},i))}}let c,d=Array.from(arguments),e=f(),g=1,h=e.createSVGMatrix(),i={isPressed:!1,position:[0,0],pressed:[0,0],drag:[0,0],prev:[0,0],x:0,y:0};const k=function(a,b=0,c=0){g=a,m(e,a,b,c)},q=function(a,b){n(e,a,b)},s=function(a,b,c,d){j(e,a,b,c,d,0)},t=function(){return l(e)},u=function(a){e.appendChild(a)},v=function(a="image.svg"){return p(e,a)},w=function(){let a=e.getAttributeNS(null,"width");return null==a?e.getBoundingClientRect().width:a},x=function(){let a=e.getAttributeNS(null,"height");return null==a?e.getBoundingClientRect().height:a},y=function(){let a=d.filter(a=>"function"==typeof a),b=d.filter(a=>!isNaN(a)),f=d.filter(a=>a instanceof HTMLElement).shift(),g=d.filter(b=>"string"==typeof b||b instanceof String).map(a=>document.getElementById(a)).shift();if(c=null==f?null==g?document.body:g:f,c.appendChild(e),2<=b.length)e.setAttributeNS(null,"width",b[0]),e.setAttributeNS(null,"height",b[1]),j(e,0,0,b[0],b[1]);else if(null==e.getAttribute("viewBox")){let a=e.getBoundingClientRect();j(e,0,0,a.width,a.height)}1<=a.length&&a[0]()};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",y):y();let z,A,B,C,D;return{zoom:k,translate:q,appendChild:u,load:function(a,d){r(a,function(a,f){null!=a&&(c.removeChild(e),e=a,c.appendChild(e),b()),null!=d&&d(a,f)})},download:v,setViewBox:s,getViewBox:t,get scale(){return g},get svg(){return e},get width(){return w()},get height(){return x()},set onMouseMove(a){z=a,b()},set onMouseDown(a){A=a,b()},set onMouseUp(a){B=a,b()},set onMouseLeave(a){C=a,b()},set onMouseEnter(a){D=a,b()}}},a.line=function(a,b,c,d,e,f,g){let i=document.createElementNS(t,"line");return i.setAttributeNS(null,"x1",a),i.setAttributeNS(null,"y1",b),i.setAttributeNS(null,"x2",c),i.setAttributeNS(null,"y2",d),h(i,e,f,g),i},a.circle=function(a,b,c,d,e,f){let g=document.createElementNS(t,"circle");return g.setAttributeNS(null,"cx",a),g.setAttributeNS(null,"cy",b),g.setAttributeNS(null,"r",c),h(g,d,e,f),g},a.rect=function(a,b,c,d,e,f,g){let i=document.createElementNS(t,"rect");return i.setAttributeNS(null,"x",a),i.setAttributeNS(null,"y",b),i.setAttributeNS(null,"width",c),i.setAttributeNS(null,"height",d),h(i,e,f,g),i},a.polygon=function(a,b,c,d){let e=document.createElementNS(t,"polygon");return i(e,a),h(e,b,c,d),e},a.polyline=function(a,b,c,d){let e=document.createElementNS(t,"polyline");return i(e,a),h(e,b,c,d),e},a.bezier=function(a,b,c,d,e,f,g,i,j,k,l){let m=document.createElementNS(t,"path");return m.setAttributeNS(null,"d","M "+a+","+b+" C "+c+","+d+" "+e+","+f+" "+g+","+i),h(m,j,k,l),m},a.group=function(a,b,c){let d=document.createElementNS(t,"g");return h(d,a,b,c),d},a.svg=f,a.setPoints=i,a.addClass=function(a,b){if(null==a)return;let c=a.getAttribute("class");c==null&&(c="");let d=c.split(" ").filter(a=>a!==b);d.push(b),a.setAttributeNS(null,"class",d.join(" "))},a.removeClass=function(a,b){if(null==a)return;let c=a.getAttribute("class");c==null&&(c="");let d=c.split(" ").filter(a=>a!==b);a.setAttributeNS(null,"class",d.join(" "))},a.setId=function(a,b){null==a||a.setAttributeNS(null,"id",b)},a.setAttribute=function(a,b,c){null==a||a.setAttributeNS(null,b,c)},a.removeChildren=function(a){for(;a.lastChild;)a.removeChild(a.lastChild)},a.setViewBox=j,a.setDefaultViewBox=k,a.getViewBox=l,a.scale=m,a.translate=n,a.convertToViewBox=o,a.download=p,a.load=r,Object.defineProperty(a,"__esModule",{value:!0})});

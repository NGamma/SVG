/* SVG (c) Robby Kraft, MIT License */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SVG = {})));
}(this, (function (exports) { 'use strict';

	function createShiftArr(step) {
		var space = '    ';
		if ( isNaN(parseInt(step)) ) {
			space = step;
		} else {
			switch(step) {
				case 1: space = ' '; break;
				case 2: space = '  '; break;
				case 3: space = '   '; break;
				case 4: space = '    '; break;
				case 5: space = '     '; break;
				case 6: space = '      '; break;
				case 7: space = '       '; break;
				case 8: space = '        '; break;
				case 9: space = '         '; break;
				case 10: space = '          '; break;
				case 11: space = '           '; break;
				case 12: space = '            '; break;
			}
		}
		var shift = ['\n'];
		for(let ix=0;ix<100;ix++){
			shift.push(shift[ix]+space);
		}
		return shift;
	}
	function vkbeautify(){
		this.step = '\t';
		this.shift = createShiftArr(this.step);
	}vkbeautify.prototype.xml = function(text,step) {
		var ar = text.replace(/>\s{0,}</g,"><")
					 .replace(/</g,"~::~<")
					 .replace(/\s*xmlns\:/g,"~::~xmlns:")
					 .replace(/\s*xmlns\=/g,"~::~xmlns=")
					 .split('~::~'),
			len = ar.length,
			inComment = false,
			deep = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;
			for(let ix=0;ix<len;ix++) {
				if(ar[ix].search(/<!/) > -1) {
					str += shift[deep]+ar[ix];
					inComment = true;
					if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
						inComment = false;
					}
				} else
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
					str += ar[ix];
					inComment = false;
				} else
				if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
					/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
					str += ar[ix];
					if(!inComment) deep--;
				} else
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
					str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/\/>/) > -1 ) {
					str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\?/) > -1) {
					str += shift[deep]+ar[ix];
				} else
				if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
					str += shift[deep]+ar[ix];
				}
				else {
					str += ar[ix];
				}
			}
		return  (str[0] == '\n') ? str.slice(1) : str;
	};
	vkbeautify.prototype.json = function(text,step) {
		var step = step ? step : this.step;
		if (typeof JSON === 'undefined' ) return text;
		if ( typeof text === "string" ) return JSON.stringify(JSON.parse(text), null, step);
		if ( typeof text === "object" ) return JSON.stringify(text, null, step);
		return text;
	};
	vkbeautify.prototype.css = function(text, step) {
		var ar = text.replace(/\s{1,}/g,' ')
					.replace(/\{/g,"{~::~")
					.replace(/\}/g,"~::~}~::~")
					.replace(/\;/g,";~::~")
					.replace(/\/\*/g,"~::~/*")
					.replace(/\*\//g,"*/~::~")
					.replace(/~::~\s{0,}~::~/g,"~::~")
					.split('~::~'),
			len = ar.length,
			deep = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;
			for(let ix=0;ix<len;ix++) {
				if( /\{/.exec(ar[ix]))  {
					str += shift[deep++]+ar[ix];
				} else
				if( /\}/.exec(ar[ix]))  {
					str += shift[--deep]+ar[ix];
				} else
				if( /\*\\/.exec(ar[ix]))  {
					str += shift[deep]+ar[ix];
				}
				else {
					str += shift[deep]+ar[ix];
				}
			}
			return str.replace(/^\n{1,}/,'');
	};
	function isSubquery(str, parenthesisLevel) {
		return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
	}
	function split_sql(str, tab) {
		return str.replace(/\s{1,}/g," ")
					.replace(/ AND /ig,"~::~"+tab+tab+"AND ")
					.replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
					.replace(/ CASE /ig,"~::~"+tab+"CASE ")
					.replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
					.replace(/ END /ig,"~::~"+tab+"END ")
					.replace(/ FROM /ig,"~::~FROM ")
					.replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
					.replace(/ HAVING /ig,"~::~HAVING ")
					.replace(/ IN /ig," IN ")
					.replace(/ JOIN /ig,"~::~JOIN ")
					.replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
					.replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
					.replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
					.replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
					.replace(/ ON /ig,"~::~"+tab+"ON ")
					.replace(/ OR /ig,"~::~"+tab+tab+"OR ")
					.replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
					.replace(/ OVER /ig,"~::~"+tab+"OVER ")
					.replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
					.replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
					.replace(/ THEN /ig," THEN~::~"+tab+"")
					.replace(/ UNION /ig,"~::~UNION~::~")
					.replace(/ USING /ig,"~::~USING ")
					.replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
					.replace(/ WHERE /ig,"~::~WHERE ")
					.replace(/ WITH /ig,"~::~WITH ")
					.replace(/ ALL /ig," ALL ")
					.replace(/ AS /ig," AS ")
					.replace(/ ASC /ig," ASC ")
					.replace(/ DESC /ig," DESC ")
					.replace(/ DISTINCT /ig," DISTINCT ")
					.replace(/ EXISTS /ig," EXISTS ")
					.replace(/ NOT /ig," NOT ")
					.replace(/ NULL /ig," NULL ")
					.replace(/ LIKE /ig," LIKE ")
					.replace(/\s{0,}SELECT /ig,"SELECT ")
					.replace(/\s{0,}UPDATE /ig,"UPDATE ")
					.replace(/ SET /ig," SET ")
					.replace(/~::~{1,}/g,"~::~")
					.split('~::~');
	}
	vkbeautify.prototype.sql = function(text,step) {
		var ar_by_quote = text.replace(/\s{1,}/g," ")
								.replace(/\'/ig,"~::~\'")
								.split('~::~'),
			len = ar_by_quote.length,
			ar = [],
			deep = 0,
			tab = this.step,
			parenthesisLevel = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;		for(let ix=0;ix<len;ix++) {
				if(ix%2) {
					ar = ar.concat(ar_by_quote[ix]);
				} else {
					ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
				}
			}
			len = ar.length;
			for(let ix=0;ix<len;ix++) {
				parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);
				if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
				}
				if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  {
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
				}
				if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
					deep++;
					str += shift[deep]+ar[ix];
				} else
				if( /\'/.exec(ar[ix]) )  {
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
					str += ar[ix];
				}
				else  {
					str += shift[deep]+ar[ix];
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
				}
			}
			str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
			return str;
	};
	vkbeautify.prototype.xmlmin = function(text, preserveComments) {
		var str = preserveComments ? text
								   : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
										 .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
		return  str.replace(/>\s{0,}</g,"><");
	};
	vkbeautify.prototype.jsonmin = function(text) {
		if (typeof JSON === 'undefined' ) return text;
		return JSON.stringify(JSON.parse(text), null, 0);
	};
	vkbeautify.prototype.cssmin = function(text, preserveComments) {
		var str = preserveComments ? text
								   : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;
		return str.replace(/\s{1,}/g,' ')
				  .replace(/\{\s{1,}/g,"{")
				  .replace(/\}\s{1,}/g,"}")
				  .replace(/\;\s{1,}/g,";")
				  .replace(/\/\*\s{1,}/g,"/*")
				  .replace(/\*\/\s{1,}/g,"*/");
	};
	vkbeautify.prototype.sqlmin = function(text) {
		return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
	};
	var vkbeautify$1 = (new vkbeautify());

	const removeChildren = function(parent) {
		while (parent.lastChild) {
			parent.removeChild(parent.lastChild);
		}
	};
	const getWidth = function(svg) {
		let w = parseInt(svg.getAttributeNS(null, "width"));
		return w != null && !isNaN(w) ? w : svg.getBoundingClientRect().width;
	};
	const getHeight = function(svg) {
		let h = parseInt(svg.getAttributeNS(null, "height"));
		return h != null && !isNaN(h) ? h : svg.getBoundingClientRect().height;
	};
	const getClassList = function(xmlNode) {
		let currentClass = xmlNode.getAttribute("class");
		return (currentClass == null
			? []
			: currentClass.split(" ").filter((s) => s !== ""));
	};
	const addClass = function(xmlNode, newClass) {
		if (xmlNode == null) {
			return;
		}
		let classes = getClassList(xmlNode)
			.filter(c => c !== newClass);
		classes.push(newClass);
		xmlNode.setAttributeNS(null, "class", classes.join(" "));
	};
	const removeClass = function(xmlNode, removedClass) {
		if (xmlNode == null) {
			return;
		}
		let classes = getClassList(xmlNode)
			.filter(c => c !== removedClass);
		xmlNode.setAttributeNS(null, "class", classes.join(" "));
	};
	const save = function(svg, filename = "image.svg") {
		let a = document.createElement("a");
		let source = (new window.XMLSerializer()).serializeToString(svg);
		let formatted = vkbeautify$1.xml(source);
		let blob = new window.Blob([formatted], {type: "text/plain"});
		a.setAttribute("href", window.URL.createObjectURL(blob));
		a.setAttribute("download", filename);
		document.body.appendChild(a);
		a.click();
		a.remove();
	};
	const pErr = (new window.DOMParser())
		.parseFromString("INVALID", "text/xml")
		.getElementsByTagName("parsererror")[0]
		.namespaceURI;
	const load = function(input, callback) {
		if (typeof input === "string" || input instanceof String) {
			let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
			if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
				let parsedSVG = xml.documentElement;
				if (callback != null) {
					callback(parsedSVG);
				}
				return parsedSVG;
			}
			fetch(input)
				.then((response) => response.text())
				.then((str) => (new window.DOMParser())
					.parseFromString(str, "text/xml")
				).then((svgData) => {
					let allSVGs = svgData.getElementsByTagName("svg");
					if (allSVGs == null || allSVGs.length === 0) {
						throw "error, valid XML found, but no SVG element";
					}
					if (callback != null) {
						callback(allSVGs[0]);
					}
					return allSVGs[0];
				});
		} else if (input instanceof Document) {
			callback(input);
			return input;
		}
	};

	const setViewBox = function(svg, x, y, width, height, padding = 0) {
		let scale = 1.0;
		let d = (width / scale) - width;
		let X = (x - d) - padding;
		let Y = (y - d) - padding;
		let W = (width + d * 2) + padding * 2;
		let H = (height + d * 2) + padding * 2;
		let viewBoxString = [X, Y, W, H].join(" ");
		svg.setAttributeNS(null, "viewBox", viewBoxString);
	};
	const getViewBox = function(svg) {
		let vb = svg.getAttribute("viewBox");
		return (vb == null
			? undefined
			: vb.split(" ").map((n) => parseFloat(n)));
	};
	const scaleViewBox = function(svg, scale, origin_x = 0, origin_y = 0) {
		if (scale < 1e-8) { scale = 0.01; }
		let matrix = svg.createSVGMatrix()
			.translate(origin_x, origin_y)
			.scale(1/scale)
			.translate(-origin_x, -origin_y);
		let viewBox = getViewBox(svg);
		if (viewBox == null) {
			setDefaultViewBox(svg);
		}
		let top_left = svg.createSVGPoint();
		let bot_right = svg.createSVGPoint();
		top_left.x = viewBox[0];
		top_left.y = viewBox[1];
		bot_right.x = viewBox[0] + viewBox[2];
		bot_right.y = viewBox[1] + viewBox[3];
		let new_top_left = top_left.matrixTransform(matrix);
		let new_bot_right = bot_right.matrixTransform(matrix);
		setViewBox(svg,
			new_top_left.x,
			new_top_left.y,
			new_bot_right.x - new_top_left.x,
			new_bot_right.y - new_top_left.y
		);
	};
	const translateViewBox = function(svg, dx, dy) {
		let viewBox = getViewBox(svg);
		if (viewBox == null) {
			setDefaultViewBox(svg);
		}
		viewBox[0] += dx;
		viewBox[1] += dy;
		svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
	};
	const convertToViewBox = function(svg, x, y) {
		let pt = svg.createSVGPoint();
		pt.x = x;
		pt.y = y;
		let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
		let array = [svgPoint.x, svgPoint.y];
		array.x = svgPoint.x;
		array.y = svgPoint.y;
		return array;
	};
	const setDefaultViewBox = function(svg) {
		let size = svg.getBoundingClientRect();
		let width = (size.width == 0 ? 640 : size.width);
		let height = (size.height == 0 ? 480 : size.height);
		setViewBox(svg, 0, 0, width, height);
	};

	const svgNS = "http://www.w3.org/2000/svg";
	const svg = function() {
		let svgImage = document.createElementNS(svgNS, "svg");
		svgImage.setAttribute("version", "1.1");
		svgImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		setupSVG(svgImage);
		return svgImage;
	};
	const line = function(x1, y1, x2, y2) {
		let shape = document.createElementNS(svgNS, "line");
		shape.setAttributeNS(null, "x1", x1);
		shape.setAttributeNS(null, "y1", y1);
		shape.setAttributeNS(null, "x2", x2);
		shape.setAttributeNS(null, "y2", y2);
		attachClassMethods(shape);
		return shape;
	};
	const circle = function(x, y, radius) {
		let shape = document.createElementNS(svgNS, "circle");
		shape.setAttributeNS(null, "cx", x);
		shape.setAttributeNS(null, "cy", y);
		shape.setAttributeNS(null, "r", radius);
		attachClassMethods(shape);
		return shape;
	};
	const ellipse = function(x, y, rx, ry) {
		let shape = document.createElementNS(svgNS, "ellipse");
		shape.setAttributeNS(null, "cx", x);
		shape.setAttributeNS(null, "cy", y);
		shape.setAttributeNS(null, "rx", rx);
		shape.setAttributeNS(null, "ry", ry);
		attachClassMethods(shape);
		return shape;
	};
	const rect = function(x, y, width, height) {
		let shape = document.createElementNS(svgNS, "rect");
		shape.setAttributeNS(null, "x", x);
		shape.setAttributeNS(null, "y", y);
		shape.setAttributeNS(null, "width", width);
		shape.setAttributeNS(null, "height", height);
		attachClassMethods(shape);
		return shape;
	};
	const polygon = function(pointsArray) {
		let shape = document.createElementNS(svgNS, "polygon");
		setPoints(shape, pointsArray);
		attachClassMethods(shape);
		return shape;
	};
	const polyline = function(pointsArray) {
		let shape = document.createElementNS(svgNS, "polyline");
		setPoints(shape, pointsArray);
		attachClassMethods(shape);
		return shape;
	};
	const bezier = function(fromX, fromY, c1X, c1Y, c2X, c2Y,
			toX, toY) {
		let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
				" " + c2X + "," + c2Y + " " + toX + "," + toY;
		let shape = document.createElementNS(svgNS, "path");
		shape.setAttributeNS(null, "d", d);
		attachClassMethods(shape);
		return shape;
	};
	const text = function(textString, x, y) {
		let shape = document.createElementNS(svgNS, "text");
		shape.innerHTML = textString;
		shape.setAttributeNS(null, "x", x);
		shape.setAttributeNS(null, "y", y);
		attachClassMethods(shape);
		return shape;
	};
	const wedge = function(x, y, radius, angleA, angleB) {
		let shape = document.createElementNS(svgNS, "path");
		setArc(shape, x, y, radius, angleA, angleB, true);
		attachClassMethods(shape);
		return shape;
	};
	const arc = function(x, y, radius, angleA, angleB) {
		let shape = document.createElementNS(svgNS, "path");
		setArc(shape, x, y, radius, angleA, angleB, false);
		attachClassMethods(shape);
		return shape;
	};
	const group = function() {
		let g = document.createElementNS(svgNS, "g");
		attachClassMethods(g);
		attachGeometryMethods(g);
		return g;
	};
	const regularPolygon = function(cX, cY, radius, sides) {
		let halfwedge = 2*Math.PI/sides * 0.5;
		let r = Math.cos(halfwedge) * radius;
		let points = Array.from(Array(sides)).map((el,i) => {
			let a = -2 * Math.PI * i / sides + halfwedge;
			let x = cX + r * Math.sin(a);
			let y = cY + r * Math.cos(a);
			return [x, y];
		});
		return polygon(points);
	};
	const setPoints = function(polygon, pointsArray) {
		if (pointsArray == null || pointsArray.constructor !== Array) {
			return;
		}
		let pointsString = pointsArray.map((el) =>
			(el.constructor === Array ? el : [el.x, el.y])
		).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
		polygon.setAttributeNS(null, "points", pointsString);
	};
	const setArc = function(shape, x, y, radius, startAngle, endAngle,
			includeCenter = false) {
		let start = [
			x + Math.cos(startAngle) * radius,
			y + Math.sin(startAngle) * radius ];
		let vecStart = [
			Math.cos(startAngle) * radius,
			Math.sin(startAngle) * radius ];
		let vecEnd = [
			Math.cos(endAngle) * radius,
			Math.sin(endAngle) * radius ];
		let arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
		let py = vecStart[0]*vecEnd[1] - vecStart[1]*vecEnd[0];
		let px = vecStart[0]*vecEnd[0] + vecStart[1]*vecEnd[1];
		let arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
		let d = (includeCenter
			? "M " + x + "," + y + " l " + vecStart[0] + "," + vecStart[1] + " "
			: "M " + start[0] + "," + start[1] + " ");
		d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
		if (includeCenter) { d += " Z"; }
		shape.setAttributeNS(null, "d", d);
	};
	const geometryMethods = {
		"line" : line,
		"circle" : circle,
		"ellipse" : ellipse,
		"rect" : rect,
		"polygon" : polygon,
		"polyline" : polyline,
		"bezier" : bezier,
		"text" : text,
		"wedge" : wedge,
		"arc" : arc,
		"regularPolygon" : regularPolygon,
		"group" : group,
	};
	const attachGeometryMethods = function(element) {
		Object.keys(geometryMethods).forEach(key => {
			element[key] = function() {
				let g = geometryMethods[key](...arguments);
				element.appendChild(g);
				return g;
			};
		});
	};
	const attachClassMethods = function(element) {
		element.removeChildren = function() { removeChildren(element); };
		element.addClass = function() { addClass(element, ...arguments); };
		element.removeClass = function() { removeClass(element, ...arguments); };
	};
	const attachViewBoxMethods = function(element) {
		element.setViewBox = function() { setViewBox(element, ...arguments); };
		element.getViewBox = function() { getViewBox(element, ...arguments); };
		element.scaleViewBox = function() { scaleViewBox(element, ...arguments); };
		element.translateViewBox = function() { translateViewBox(element, ...arguments); };
		element.convertToViewBox = function() { convertToViewBox(element, ...arguments); };
	};
	const setupSVG = function(svgImage) {
		attachClassMethods(svgImage);
		attachGeometryMethods(svgImage);
		attachViewBoxMethods(svgImage);
	};

	const Names = {
		start: "onMouseDown",
		enter: "onMouseEnter",
		leave: "onMouseLeave",
		move: "onMouseMove",
		end: "onMouseUp",
		scroll: "onScroll",
	};
	function Events(node) {
		let _node;
		let _pointer = Object.create(null);
		let _events = {};
		Object.assign(_pointer, {
			isPressed: false,
			position: [0,0],
			pressed: [0,0],
			drag: [0,0],
			prev: [0,0],
			x: 0,
			y: 0
		});
		const getPointer = function() {
			let m = _pointer.position.slice();
			Object.keys(_pointer)
				.filter(key => typeof key === "object")
				.forEach(key => m[key] = _pointer[key].slice());
			Object.keys(_pointer)
				.filter(key => typeof key !== "object")
				.forEach(key => m[key] = _pointer[key]);
			return Object.freeze(m);
		};
		const updatePointerPosition = function(clientX, clientY) {
			_pointer.prev = _pointer.position;
			_pointer.position = convertToViewBox(_node, clientX, clientY);
			_pointer.x = _pointer.position[0];
			_pointer.y = _pointer.position[1];
		};
		const updateTouchDrag = function() {
			_pointer.drag = [_pointer.position[0] - _pointer.pressed[0],
			               _pointer.position[1] - _pointer.pressed[1]];
			_pointer.drag.x = _pointer.drag[0];
			_pointer.drag.y = _pointer.drag[1];
		};
		const mouseMoveHandler = function(event) {
			updatePointerPosition(event.clientX, event.clientY);
			let mouse = getPointer();
			if (_pointer.isPressed) { updateTouchDrag(); }
			if (_events[Names.move]) {
				_events[Names.move].forEach(f => f(mouse));
			}
		};
		const mouseDownHandler = function(event) {
			_pointer.isPressed = true;
			_pointer.pressed = convertToViewBox(_node, event.clientX, event.clientY);
			if (_events[Names.start]) {
				let mouse = getPointer();
				_events[Names.start].forEach(f => f(mouse));
			}
		};
		const mouseUpHandler = function(event) {
			_pointer.isPressed = false;
			if (_events[Names.end]) {
				let mouse = getPointer();
				_events[Names.end].forEach(f => f(mouse));
			}
		};
		const mouseLeaveHandler = function(event) {
			updatePointerPosition(event.clientX, event.clientY);
			if (_events[Names.leave]) {
				let mouse = getPointer();
				_events[Names.leave].forEach(f => f(mouse));
			}
		};
		const mouseEnterHandler = function(event) {
			updatePointerPosition(event.clientX, event.clientY);
			if (_events[Names.enter]) {
				let mouse = getPointer();
				_events[Names.enter].forEach(f => f(mouse));
			}
		};
		const touchStartHandler = function(event) {
			event.preventDefault();
			let touch = event.touches[0];
			if (touch == null) { return; }
			_pointer.isPressed = true;
			_pointer.pressed = convertToViewBox(_node, touch.clientX, touch.clientY);
			if (_events.oMouseDown) {
				let mouse = getPointer();
				_events.oMouseDown.forEach(f => f(mouse));
			}
		};
		const touchMoveHandler = function(event) {
			event.preventDefault();
			let touch = event.touches[0];
			if (touch == null) { return; }
			updatePointerPosition(touch.clientX, touch.clientY);
			let mouse = getPointer();
			if (_pointer.isPressed) { updateTouchDrag(); }
			if (_events[Names.move]) {
				_events[Names.move].forEach(f => f(mouse));
			}
		};
		const scrollHandler = function(event) {
			let e = {
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				deltaZ: event.deltaZ,
			};
			e.position = convertToViewBox(_node, event.clientX, event.clientY);
			e.x = e.position[0];
			e.y = e.position[1];
			event.preventDefault();
			if (_events[Names.scroll]) {
				_events[Names.scroll].forEach(f => f(e));
			}
		};
		let _animate, _intervalID, _animationFrame;
		const updateAnimationHandler = function(handler) {
			if (_animate != null) {
				clearInterval(_intervalID);
			}
			_animate = handler;
			if (_animate != null) {
				_animationFrame = 0;
				_intervalID = setInterval(() => {
					let animObj = {
						"time": _node.getCurrentTime(),
						"frame": _animationFrame++
					};
					_animate(animObj);
				}, 1000/60);
			}
		};
		const handlers = {
			mouseup: mouseUpHandler,
			mousedown: mouseDownHandler,
			mousemove: mouseMoveHandler,
			mouseleave: mouseLeaveHandler,
			mouseenter: mouseEnterHandler,
			touchend: mouseUpHandler,
			touchmove: touchMoveHandler,
			touchstart: touchStartHandler,
			touchcancel: mouseUpHandler,
			wheel: scrollHandler,
		};
		const addEventListener = function(eventName, func) {
			if (typeof func !== "function") {
				throw "must supply a function type to addEventListener";
			}
			if (_events[eventName] === undefined) {
				_events[eventName] = [];
			}
			_events[eventName].push(func);
		};
		const attachHandlers = function(element) {
			Object.keys(handlers).forEach(key =>
				element.addEventListener(key, handlers[key], false)
			);
			updateAnimationHandler(_animate);
		};
		const removeHandlers = function(element) {
			Object.keys(handlers).forEach(key =>
				element.removeEventListener(key, handlers[key], false)
			);
			if (_animate != null) {
				clearInterval(_intervalID);
			}
		};
		const setup = function(node) {
			if (_node != null) {
				removeHandlers(_node);
			}
			_node = node;
			Object.keys(Names).map(key => Names[key]).forEach(key => {
				Object.defineProperty(_node, key, {
					set: function(handler) { addEventListener(key, handler); }
				});
			});
			Object.defineProperty(_node, "animate", {
				set: function(handler) { updateAnimationHandler(handler); }
			});
			Object.defineProperty(_node, "mouse", {get: function(){ return getPointer(); }});
			Object.defineProperty(_node, "pointer", {get: function(){ return getPointer(); }});
			attachHandlers(_node);
		};
		setup(node);
		return {
			setup,
			remove: function() { removeHandlers(_node); }
		};
	}

	function image() {
		let _svg = svg();
		let params = Array.from(arguments);
		initSize(_svg, params);
		attachSVGMethods(_svg);
		_svg.events = Events(_svg);
		const setup = function() {
			initSize(_svg, params);
			getElement(params).appendChild(_svg);
			params.filter((arg) => typeof arg === "function")
				.forEach((func) => func());
		};
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', setup);
		} else {
			setup();
		}
		return _svg;
	}const getElement = function(params) {
		let element = params.filter((arg) =>
				arg instanceof HTMLElement
			).shift();
		let idElement = params.filter((a) =>
				typeof a === "string" || a instanceof String)
			.map(str => document.getElementById(str))
			.shift();
		return (element != null
			? element
			: (idElement != null
				? idElement
				: document.body));
	};
	const initSize = function(svg$$1, params) {
		let numbers = params.filter((arg) => !isNaN(arg));
		if (numbers.length >= 2) {
			svg$$1.setAttributeNS(null, "width", numbers[0]);
			svg$$1.setAttributeNS(null, "height", numbers[1]);
			setViewBox(svg$$1, 0, 0, numbers[0], numbers[1]);
		}
		else if (svg$$1.getAttribute("viewBox") == null) {
			let rect$$1 = svg$$1.getBoundingClientRect();
			setViewBox(svg$$1, 0, 0, rect$$1.width, rect$$1.height);
		}
	};
	const attachSVGMethods = function(element) {
		Object.defineProperty(element, "w", {
			get: function(){ return getWidth(element); },
			set: function(w){ element.setAttributeNS(null, "width", w); }
		});
		Object.defineProperty(element, "h", {
			get: function(){ return getHeight(element); },
			set: function(h){ element.setAttributeNS(null, "height", h); }
		});
		element.getWidth = function() { return getWidth(element); };
		element.getHeight = function() { return getHeight(element); };
		element.setWidth = function(w) { element.setAttributeNS(null, "width", w); };
		element.setHeight = function(h) { element.setAttributeNS(null, "height", h); };
		element.save = function(filename = "image.svg") {
			return save(element, filename);
		};
		element.load = function(data, callback) {
			load(data, function(newSVG, error) {
				let parent = element.parentNode;
				if (newSVG != null) {
					newSVG.events = element.events;
					setupSVG(newSVG);
					if (newSVG.events == null) { newSVG.events = Events(newSVG); }
					else { newSVG.events.setup(newSVG); }
					attachSVGMethods(newSVG);
					element.remove();
					element = newSVG;
				}
				if (parent != null) { parent.appendChild(element); }
				if (callback != null) { callback(element, error); }
			});
		};
	};

	const controlPoint = function(parent, options) {
		if (options == null) { options = {}; }
		if (options.radius == null) { options.radius = 1; }
		if (options.fill == null) { options.fill = "#000000"; }
		if (options.position == null) { options.position = [0,0]; }
		let c = circle(0, 0, options.radius);
		c.setAttribute("fill", options.fill);
		let _position = options.position.slice();
		let _selected = false;
		if (parent != null) {
			parent.appendChild(c);
		}
		const setPosition = function(x, y) {
			_position[0] = x;
			_position[1] = y;
			c.setAttribute("cx", x);
			c.setAttribute("cy", y);
		};
		const onMouseMove = function(mouse) {
			if (_selected) {
				let pos = _updatePosition(mouse);
				setPosition(pos[0], pos[1]);
			}
		};
		const onMouseUp = function(mouse) {
			_selected = false;
		};
		const distance = function(mouse) {
			return Math.sqrt(
				Math.pow(mouse[0] - _position[0], 2) +
				Math.pow(mouse[1] - _position[1], 2)
			);
		};
		let _updatePosition = function(input){ return input; };
		return {
			circle: c,
			set position(pos) {
				if (pos[0] != null) { setPosition(pos[0], pos[1]); }
				else if (pos.x != null) { setPosition(pos.x, pos.y); }
			},
			get position() { return [..._position]; },
			onMouseUp,
			onMouseMove,
			distance,
			set positionDidUpdate(method) { _updatePosition = method; },
			set selected(value) { _selected = true; }
		};
	};
	function controls(svgObject, number = 1, options) {
		if (options == null) { options = {}; }
		if (options.parent == null) { options.parent = svgObject; }
		if (options.radius == null) { options.radius = 1; }
		if (options.fill == null) { options.fill = "#000000"; }
		let _points = Array.from(Array(number)).map(_ => controlPoint(options.parent, options));
		let _selected = undefined;
		const onMouseDown = function(mouse) {
			if (!(_points.length > 0)) { return; }
			_selected = _points
				.map((p,i) => ({i:i, d:p.distance(mouse)}))
				.sort((a,b) => a.d - b.d)
				.shift()
				.i;
			_points[_selected].selected = true;
		};
		const onMouseMove = function(mouse) {
			_points.forEach(p => p.onMouseMove(mouse));
		};
		const onMouseUp = function(mouse) {
			_points.forEach(p => p.onMouseUp(mouse));
			_selected = undefined;
		};
		svgObject.addEventListener("mousedown", onMouseDown);
		svgObject.addEventListener("mouseup", onMouseUp);
		svgObject.addEventListener("mousemove", onMouseMove);
		Object.defineProperty(_points, "selectedIndex", {get: function() { return _selected; }});
		Object.defineProperty(_points, "selected", {get: function() { return _points[_selected]; }});
		Object.defineProperty(_points, "removeAll", {value: function() {
			_points.forEach(tp => tp.remove());
		}});
		return _points;
	}

	exports.svg = svg;
	exports.line = line;
	exports.circle = circle;
	exports.ellipse = ellipse;
	exports.rect = rect;
	exports.polygon = polygon;
	exports.polyline = polyline;
	exports.bezier = bezier;
	exports.text = text;
	exports.wedge = wedge;
	exports.arc = arc;
	exports.group = group;
	exports.regularPolygon = regularPolygon;
	exports.setPoints = setPoints;
	exports.setArc = setArc;
	exports.setViewBox = setViewBox;
	exports.getViewBox = getViewBox;
	exports.scaleViewBox = scaleViewBox;
	exports.translateViewBox = translateViewBox;
	exports.convertToViewBox = convertToViewBox;
	exports.removeChildren = removeChildren;
	exports.save = save;
	exports.load = load;
	exports.image = image;
	exports.controls = controls;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

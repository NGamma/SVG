/**
 * SVG in Javascript (c) Robby Kraft
 *
 * contains simple drawing shapes, one step above primitives
 * for those that are comprised of multiple primitives, the shape is gathered
 * together and returned in one group.
 */

import { bezier, polygon } from "./primitives";

const svgNS = "http://www.w3.org/2000/svg";

export const regularPolygon = function(cX, cY, radius, sides) {
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

/**
 * the arrowheads use "fill" but the arc cannot, and must use "stroke"
 * therefore, to set the color, pass it in as one of the options
 * don't use .setAttribute()
 */
export const arcArrow = function(startPoint, endPoint, options) {
	// options:
	// - padding: the arrow backs off from the target by a tiny fraction
	// - color
	let p = {
		color: "#eb3",     // css
		strokeWidth: 0.01, // css
		width: 0.025,   // pixels
		length: 0.075,  // pixels
		bend: 0.3,      // %
		pinch: 0.618,   // %
		padding: 0.5,   // %
		side: (false) ? 1 : -1,
		start: false,
		end: true
	};

	if (typeof options === "object" && options !== null) {
		Object.assign(p, options);
	}

	let arrowFill = "stroke:none;fill:"+p.color+";";
	let arrowStroke = "stroke:"+p.color+";fill:none;stroke-width:" +
		strokeWidth+";";

	let vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
	let perpendicular = [vector[1], -vector[0]];
	let midpoint = [startPoint[0] + vector[0]/2, startPoint[1] + vector[1]/2];
	let bezPoint = [
		midpoint[0] + perpendicular[0]*p.side * p.bend,
		midpoint[1] + perpendicular[1]*p.side * p.bend
	];

	let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
	let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
	let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
	let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
	let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
	let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];

	let arcStart = [
		startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
		startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
	];
	let arcEnd = [
		endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
		endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
	];
	let controlStart = [
		arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
		arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
	];
	let controlEnd = [
		arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
		arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
	];

	let startVec = [-bezStartNorm[0], -bezStartNorm[1]];
	let endVec = [-bezEndNorm[0], -bezEndNorm[1]];
	let startNormal = [startVec[1], -startVec[0]];
	let endNormal = [endVec[1], -endVec[0]];

	let startPoints = [
		[arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
		[arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
		[arcStart[0]+startVec[0]*p.length, arcStart[1]+startVec[1]*p.length]
	];
	let endPoints = [
		[arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
		[arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
		[arcEnd[0]+endVec[0]*p.length, arcEnd[1]+endVec[1]*p.length]
	];

	// draw
	let arrowGroup = document.createElementNS(svgNS, "g");

	let arrowArc = bezier(
		arcStart[0], arcStart[1], controlStart[0], controlStart[1],
		controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
	);
	arrowArc.setAttribute("style", arrowStroke);
	if (p.start) {
		let startHead = arrowGroup.polygon(startPoints);
		startHead.setAttribute("style", arrowFill);
		arrowGroup.appendChild(startHead);
	}
	if (p.end) {
		let endHead = arrowGroup.polygon(endPoints);
		endHead.setAttribute("style", arrowFill);
		arrowGroup.appendChild(endHead);
	}

	/////////////////
	// debug
	// let debugYellowStyle = "stroke:#ecb233;stroke-width:0.005";
	// let debugBlueStyle = "stroke:#224c72;stroke-width:0.005";
	// let debugRedStyle = "stroke:#e14929;stroke-width:0.005";
	// arrowGroup.line(arcStart[0], arcStart[1], arcEnd[0], arcEnd[1])
	// 	.setAttribute("style", debugYellowStyle);

	// arrowGroup.line(arcStart[0], arcStart[1], bezPoint[0], bezPoint[1])
	// 	.setAttribute("style", debugBlueStyle);
	// arrowGroup.line(arcEnd[0], arcEnd[1], bezPoint[0], bezPoint[1])
	// 	.setAttribute("style", debugBlueStyle);
	// arrowGroup.line(arcStart[0], arcStart[1], controlStart[0], controlStart[1])
	// 	.setAttribute("style", debugRedStyle);
	// arrowGroup.line(arcEnd[0], arcEnd[1], controlEnd[0], controlEnd[1])
	// 	.setAttribute("style", debugRedStyle);
	// arrowGroup.line(controlStart[0], controlStart[1], controlEnd[0], controlEnd[1])
	// 	.setAttribute("style", debugRedStyle);

	return arrowGroup;
}

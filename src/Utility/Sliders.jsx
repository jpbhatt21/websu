let df = 3;
let cs = 26;
//Helper function to set circle size
export function setCs(val) {
	cs = val;
}
//Helper function to generate P slider path - Perfect Circle
export function pSliderPath(points, l) {
	let old = points;
	points = getArcPoints(...points);
	points.push(old[2]);

	let lenght = 0;
	[points, length] = removeClosePoints(points);

	return getMesh(points);
}
//Helper function to generate B slider path - Bezier Curve
export function bSliderPath(points, val = false) {
	let old = points;
	points = getStrutPoints(points, val ? cs * 2 : 696 + 420);
	points.push(old[old.length - 1]);
	let lenght = 0;
	[points, length] = removeClosePoints(points);
	if (val) {
		return points;
	}

	return getMesh(points);
}
//Helper function to generate L slider path - Line
export function lSliderPath(points) {
	let length = 0;
	[points, length] = removeClosePoints(getLinePoints(points));
	return getMesh(points);
}
//Helper function to calculate distance between two points
function dist(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
//Helper function to remove close points
function removeClosePoints(points) {
	let final = [points[0]];
	let count = 0;
	let length = 0;
	for (let i = 0; i < points.length; i++) {
		let d = dist(points[i], final[count]);
		if (d < 0.01) continue;
		length += d;
		final.push(points[i]);
		count++;
	}
	return [final, length];
}
//Helper function to generate mesh from points
function getMesh(points) {
	let [arr, len] = getRectArr(points);
	let startCap = arr.slice(0, 6);
	startCap.splice(3, 1);
	startCap.pop();
	startCap = addSliderCaps(startCap).flat();
	let endCaps = [];
	for (let i = 0; i < arr.length; i += 6) {
		let endCap = arr.slice(i, i + 6);
		endCap.splice(3, 1);
		endCap.pop();
		endCap = addSliderCaps([
			endCap[2],
			endCap[3],
			endCap[0],
			endCap[1],
		]).flat();
		endCaps.push(endCap);
	}
	let endCap = arr.slice(-6);
	endCap.splice(3, 1);
	endCap.pop();
	endCap = addSliderCaps([endCap[2], endCap[3], endCap[0], endCap[1]]).flat();
	endCaps.push(endCap);
	points = arr.flat();
	for (let i in points) {
		points[i] = Math.round(points[i] * 100) / 100;
	}
	return [points, points.length, [startCap, endCaps],points.length/12, len];
}
//Helper function to generate rectangle array for mesh from points
function getRectArr(points) {
	let arr = [];
	let cur = {};
	let prev = {};
	let length = 0;
	for (let i = 1; i < points.length; i++) {
		cur = getRect(points[i - 1], points[i]);
		length += cur[0];
		cur = cur[1];
		if (i > 1) {
			if (
				dist(prev.e2, cur.s1) < dist(prev.e1, cur.s1) &&
				dist(prev.e2, cur.s2) > dist(prev.e1, cur.s2)
			) {
				let avg = [
					(prev.e1[0] + cur.s2[0]) / 2,
					(prev.e1[1] + cur.s2[1]) / 2,
				];
				prev.e1 = avg;
				cur.s2 = avg;
				avg = [
					(prev.e2[0] + cur.s1[0]) / 2,
					(prev.e2[1] + cur.s1[1]) / 2,
				];
				prev.e2 = avg;
				cur.s1 = avg;
			} else {
				let avg = [
					(prev.e1[0] + cur.s1[0]) / 2,
					(prev.e1[1] + cur.s1[1]) / 2,
				];
				prev.e1 = avg;
				cur.s1 = avg;
				avg = [
					(prev.e2[0] + cur.s2[0]) / 2,
					(prev.e2[1] + cur.s2[1]) / 2,
				];
				prev.e2 = avg;
				cur.s2 = avg;
			}

			arr.push(prev.e1, prev.e1, prev.e2, prev.s2);
		}
		arr.push(cur.s1, cur.s2);
		prev = cur;
	}
	arr.push(prev.e1, prev.e1, prev.e2, prev.s2);
	return [arr, length];
}
//Helper function to generate rectangle points from two points at a distance of cs
function getRect(a, b) {
	let rect = {};
	let dx = a[0] - b[0];
	let dy = a[1] - b[1];
	let dist = Math.sqrt(dx * dx + dy * dy);
	dx /= dist;
	dy /= dist;
	let p = [0, 0];
	p[0] = a[0] + dy * cs;
	p[1] = a[1] - dx * cs;
	rect.s1 = p;
	p = [0, 0];
	p[0] = a[0] - dy * cs;
	p[1] = a[1] + dx * cs;
	rect.s2 = p;
	p = [0, 0];
	p[0] = b[0] + dy * cs;
	p[1] = b[1] - dx * cs;
	rect.e1 = p;
	p = [0, 0];
	p[0] = b[0] - dy * cs;
	p[1] = b[1] + dx * cs;
	rect.e2 = p;
	return [dist, rect];
}
//Helper function to add slider caps
function addSliderCaps(points) {
	//console.log(points)
	let dx = points[0][0] - points[2][0];
	let dy = points[0][1] - points[2][1];
	let len = Math.sqrt(dx * dx + dy * dy);
	let p1 = [points[0][0] + (dx / len) * cs, points[0][1] + (dy / len) * cs];
	p1 = [Math.round(p1[0] * 100) / 100, Math.round(p1[1] * 100) / 100];
	dx = points[1][0] - points[3][0];
	dy = points[1][1] - points[3][1];
	len = Math.sqrt(dx * dx + dy * dy);
	let p2 = [points[1][0] + (dx / len) * cs, points[1][1] + (dy / len) * cs];
	p2 = [Math.round(p2[0] * 100) / 100, Math.round(p2[1] * 100) / 100];
	//console.log(p1,p2)
	return [p1, p2, points[0], points[0], points[1], p2];
}
//Helper function to generate arc points from a to c through b
function getArcPoints(a, b, c) {
	// Step 1: Find the center of the circle and the radius
	const center = findCircleCenter(a, b, c);
	const radius = dist(center, a);

	// Step 2: Calculate the angles for a, b, and c relative to the center
	const angleA = findAngle(center, a);
	const angleB = findAngle(center, b);
	const angleC = findAngle(center, c);

	// Step 3: Generate the arc points from a to c
	let arcPoints = generateArcPoints(center, radius, angleA, angleC, 100);

	// Step 4: Check if point b lies approximately on the arc
	if (!pointOnArc(arcPoints, b)) {
		// Invert the arc (generate points from c to a instead)
		arcPoints = generateArcPoints(center, radius, angleC, angleA, 100);
		arcPoints = arcPoints.reverse();
	}

	return arcPoints;
}
// Helper function to find the center of the circle passing through three points
function findCircleCenter(p1, p2, p3) {
	const d =
		2 *
		(p1[0] * (p2[1] - p3[1]) +
			p2[0] * (p3[1] - p1[1]) +
			p3[0] * (p1[1] - p2[1]));
	const ux =
		((Math.pow(p1[0], 2) + Math.pow(p1[1], 2)) * (p2[1] - p3[1]) +
			(Math.pow(p2[0], 2) + Math.pow(p2[1], 2)) * (p3[1] - p1[1]) +
			(Math.pow(p3[0], 2) + Math.pow(p3[1], 2)) * (p1[1] - p2[1])) /
		d;
	const uy =
		((Math.pow(p1[0], 2) + Math.pow(p1[1], 2)) * (p3[0] - p2[0]) +
			(Math.pow(p2[0], 2) + Math.pow(p2[1], 2)) * (p1[0] - p3[0]) +
			(Math.pow(p3[0], 2) + Math.pow(p3[1], 2)) * (p2[0] - p1[0])) /
		d;
	return [ux, uy];
}
// Helper function to find the angle between a point and the center
function findAngle(center, point) {
	return Math.atan2(point[1] - center[1], point[0] - center[0]);
}
// Helper function to generate arc points between two angles
function generateArcPoints(center, radius, startAngle, endAngle, numPoints) {
	const points = [];
	let totalAngle = endAngle - startAngle;

	// Ensure angles go in the correct direction (clockwise or counterclockwise)
	if (totalAngle < 0) totalAngle += 2 * Math.PI;

	// Generate points along the arc
	for (let i = 0; i <= numPoints; i++) {
		const currentAngle = startAngle + (totalAngle * i) / numPoints;
		const x = center[0] + radius * Math.cos(currentAngle);
		const y = center[1] + radius * Math.sin(currentAngle);
		points.push([x, y]);
	}
	return points;
}
// Helper function to check if point b lies approximately on the arc
function pointOnArc(arcPoints, point, tolerance = 3) {
	return arcPoints.some((arcPoint) => dist(arcPoint, point) <= tolerance);
}
//Helper function to get strut points from bezier points
function getStrutPoints(points, count) {
	// run de Casteljau's algorithm, starting with the base points
	let len = points.length;
	let finals = [];
	for (let t = 0; t <= 1; t += 1 / count) {
		for (let i = 0; i < len - 1; i++) {
			for (let j = 0; j < len - 1 - i; j++) {
				points[j] = [
					points[j][0] + t * (points[j + 1][0] - points[j][0]),
					points[j][1] + t * (points[j + 1][1] - points[j][1]),
				];
			}
		}
		finals.push(points[0]);
	}
	return finals;
}
//Helper function to get line points for L slider while joining lines with bezier curves
function getLinePoints(points) {
	let generatedPoints = [];

	for (let j = 1; j < points.length; j++) {
		let arr = [];
		let dis = dist(points[j - 1], points[j]);
		let dx = points[j][0] - points[j - 1][0];
		let dy = points[j][1] - points[j - 1][1];
		let count = dis / df;
		for (let i = 0; i < count; i++) {
			arr.push([
				points[j - 1][0] + (dx * i) / count,
				points[j - 1][1] + (dy * i) / count,
			]);
			if (
				dist(points[j - 1], arr[arr.length - 1]) > dis - cs &&
				j != points.length - 1
			) {
				arr.pop();
				break;
			}
			if (dist(points[j - 1], arr[arr.length - 1]) < cs && j != 1) {
				arr.pop();
			}
		}
		if (j > 1) {
			let temp = bSliderPath(
				[
					generatedPoints[generatedPoints.length - 1],
					points[j - 1],
					arr[0],
				],
				true
			);
			temp.shift();
			generatedPoints = generatedPoints.concat(temp);
		}
		generatedPoints = generatedPoints.concat(arr);
	}
	generatedPoints.push(points[points.length - 1]);
	return generatedPoints;
}

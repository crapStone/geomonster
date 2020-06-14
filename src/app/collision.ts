// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics

export function rectIntersect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
    // console.log("reactIntersect:", x1, y1, x2, y2);
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

export function circleIntersect(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) {

    // Calculate the distance between the two circles
    let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

export function circleRectIntersect(cx: number, cy: number, radius: number, rx: number, ry: number, rw: number, rh: number) {

    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;

    // which edge is closest?
    if (cx < rx) testX = rx;      // test left edge
    else if (cx > rx + rw) testX = rx + rw;   // right edge
    if (cy < ry) testY = ry;      // top edge
    else if (cy > ry + rh) testY = ry + rh;   // bottom edge

    // get distance from closest edges
    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the radius, collision!
    if (distance <= radius) {
        return true;
    }
    return false;
}

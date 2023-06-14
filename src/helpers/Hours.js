import { unadjust_hour } from './process_hours';


/**
 * 
 * @param {Object} object 
 * @param {integer} date 
 * @param {integer} day 
 * @param {float} hourMin 
 * @throws
 * @returns 
 */
export function isOpen(object, date, day, hourMin) {

    if (object === undefined || object === false) {
        throw new Error("Invalid object");
    }

    const days = object.days;
    const scheme = object.schemes[days[day]];

    if (scheme == null || scheme.min == null) {
        throw new Error("Invalid scheme");
    }

    if (hourMin < scheme.min) {
        return false;
    }

    let status = true;
    scheme.breaks.forEach((time) => {
        if (hourMin < time) {
            return status;
        }
        status = !status;
    });

    if (hourMin > scheme.max) {
        return false;
    }

    return true;
}

export function next(object, hour) {

    if (typeof object == "undefined") {
        return ["Closed", null];
    }

    if (object.min == null) {
        return ["Closed", null];
    }

    var diff = hour - object.min;
    var isClosed = diff <= 0;
    var diff = Math.abs(diff);

    if (isClosed) {
        if (diff < 1) {
            return ["Closed", "Opens at " + unadjust_hour(object.min)];
        }
        return ["Closed", null];
    }

    var status = true;
    for (var i = 0; i < object.breaks.length; i++) {

        if (hour < object.breaks[i]) {

            if (status) {
                return ["Open", "Taking a break at " + unadjust_hour(object.breaks[i])];
            }

            return ["Closed", "Back open at " + unadjust_hour(object.breaks[i])];
        }
        status = !status;
    }

    diff = hour - object.max;
    isClosed = diff >= 0;
    diff = Math.abs(diff);

    if (!isClosed) {
        if (diff < 1) {
            return ["Open", "Closing at " + unadjust_hour(object.max)];
        }
        return ["Open", null];
    }

    return ["Closed", null];
}
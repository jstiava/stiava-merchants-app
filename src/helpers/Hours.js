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
        return false;
        throw new Error("Invalid object");
    }

    const days = object.days;
    const scheme = object.schemes[days[day]];

    if (scheme == null || scheme.min == null) {
        return false;
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


export const nextForScore = (object, date, day, hourMin) => {
    if (object === undefined || object === false) {
        return [false, 1];
    }

    const days = object.days;
    const scheme = object.schemes[days[day]];

    if (scheme == null || scheme.min == null) {
        return [false, 1];
    }

    if (hourMin < scheme.min) {
        return [false, scheme.min];
    }

    let status = true;
    for (let [i, time] of scheme.breaks.entries()) {
        if (hourMin < time) {
            if (status) {
                return [true, 0];
            }
            return [false, time];
        }
        status = !status;
    }

    if (hourMin > scheme.max) {
        return [false, 1];
    }

    return [true, 0];
}

/**
 * 
 * @param {*} object 
 * @param {*} date 
 * @param {*} day 
 * @param {*} hourMin 
 * @returns [isOpen, message, next, wait]
 */
export const next = (object, dateTime) => {

    console.log(object);

    // if (typeof object !== 'object' || typeof date !== 'string' || typeof day !== 'number' || typeof hourMin !== 'number') {
    //     throw new Error('Invalid input. Expected object, string, number, number.');
    // }

    if (object === undefined || object === false) {
        return [false, "CLOSED", [], 1];
    }

    console.log(object);
    const days = object.days;

    if (!days) {
        return [false, "CLOSED", [], 1]
    }
    const scheme = object.schemes[days[dateTime.day]];

    if (scheme == null || scheme.min == null) {
        return [false, "CLOSED", [], 1];
    }

    if (dateTime.hourMin < scheme.min) {
        if (scheme.breaks.length === 0) {
            return [false, "Opens at " + unadjust_hour(scheme.min), [unadjust_hour(scheme.min), "Doors Open", unadjust_hour(scheme.max), "Doors Close"], scheme.min - dateTime.hourMin];
        }
        return [false, "Opens at " + unadjust_hour(scheme.min), [unadjust_hour(scheme.min), "Doors Open", unadjust_hour(scheme.breaks[0]), "Closes for Break"], scheme.min - dateTime.hourMin];

    }

    let status = true;
    for (let [i, time] of scheme.breaks.entries()) {
        if (dateTime.hourMin < time) {
            if (status) {
                const break_soon = "OPEN NOW • Break at " + unadjust_hour(time);
                return [true, break_soon, [unadjust_hour(time), "Taking a break", unadjust_hour(scheme.breaks[i + 1]), "Reopens"], 0];
            }
            const back_soon = "CLOSED • back at " + unadjust_hour(time);
            return [false, back_soon, [unadjust_hour(time), "Back Open", unadjust_hour(scheme.max), "Final Closing"], time - dateTime.hourMin];
        }
        status = !status;
    }

    if (dateTime.hourMin > scheme.max) {
        return [false, "CLOSED", [], 1];
    }

    return [true, "OPEN NOW", [unadjust_hour(scheme.max), "Closing"], 0];
}


function getDayName(index) {
    switch (index) {
        case 0:
            return "Mon";
        case 1:
            return "Tue";
        case 2:
            return "Wed";
        case 3:
            return "Thu";
        case 4:
            return "Fri";
        case 5:
            return "Sat";
        case 6:
            return "Sun";
    }
}


function preCleanDaysPointer(schemes, pointer) {
    let string = pointer;
    if (string === null) {
        return "Closed";
    }
    else if (string === false) {
        return "Closed";
    }
    else if (string === true) {
        return "Open All Day";
    }
    else {
        return schemes[string].asString;
    }
}


export function hoursAbstrator(schedule, the_day) {
    const sets = [];
    let start = undefined;
    let day_name = the_day;

    console.log(schedule);

    if (schedule.days === null) {
        return ["Closed"];
    }
    // Reorder the array
    const reorderedDays = schedule.days
        .slice(the_day) // Extract elements from startIndex to the end
        .concat(schedule.days.slice(0, the_day)); // Append elements from the beginning to startIndex


    // Add the current
    reorderedDays.forEach((pointer, index) => {

        // Set the starter
        if (start === undefined) {
            start = day_name;
        }

        // The next element matches as well, keep going
        if (pointer === reorderedDays[index + 1]) {
            day_name++;
            if (day_name > 6) {
                day_name = 0;
            }
            return;
        }

        const string = preCleanDaysPointer(schedule.schemes, pointer);

        if (start === day_name) {
            sets.push(getDayName(start) + ": " + string);
        }
        else {
            if ((start - 1) === day_name || start === 0 && day_name === 6) {
                if (string === "Closed") {
                    sets.push("Closed");
                }
                else {
                    sets.push("Daily: " + string);
                }
            }
            else if (start === 0 && day_name === 4) {
                sets.push("Weekdays: " + string);
            }
            else if (start === 5 && day_name === 6) {
                sets.push("Weekends: " + string);
            }
            else {
                sets.push(getDayName(start) + " - " + getDayName(day_name) + ": " + string);
            }

        }
        start = undefined;
        day_name++;
        if (day_name > 6) {
            day_name = 0;
        }

    });

    return sets;
}

export const getActiveVenueHours = (hours, dateTime) => {
    if (Object.keys(hours).length > 0) {
        const selected = findActiveHours(hours, dateTime);
        console.log(hours);
        if (selected !== null) {
            const [isOpen, message, sequence, wait] = next(hours[selected.id], dateTime);
            return {
                isOpen: isOpen,
                message: message,
                sequence: sequence,
                wait: wait,
                object: selected,
                source: 'venue',
            };
        }
    }

    return {
        isOpen: false,
        message: "Hours not set",
        sequence: [],
        wait: 0,
        object: {
            id: 0,
            name: "Not Set",
            type: 'standard',
            string: "Hours not set"
        },
        source: 'venue'
    };
}

export const getActiveMarketHours = (chronos, hours, dateTime) => {

    /**
     * All merchants hours take precedence
     */
    if (Object.keys(chronos).length > 0) {
        const selected = findActiveHours(chronos, dateTime);
        if (selected !== null) {
            const [isOpen, message, sequence, wait] = next(selected, dateTime)
            return {
                isOpen: isOpen,
                message: message,
                sequence: sequence,
                wait: wait,
                object: selected,
                source: 'chronos'
            };
        }
    }

    /**
     * All market hours are second priority
     */
    if (hours && Object.keys(hours).length > 0) {
        const selected = findActiveHours(hours, dateTime);
        if (selected !== null) {
            const [isOpen, message, sequence, wait] = next(selected, dateTime)
            return {
                isOpen: isOpen,
                message: message,
                sequence: sequence,
                wait: wait,
                object: selected,
                source: 'market'
            };
        }
    }

    return null;

}


const getType = (object) => {
    if (object.end === null) {
        return 'standard';
    }

    if (object.days === false) {
        return 'closure';
    }

    return 'special';
}

export const findActiveHours = (actives, dateTime) => {

    /**
     * Get special hours, return first entry.
     */
    const specials = Object.entries(actives)
        .filter(([key, obj]) => obj.end !== null && dateTime.serialDate <= Number(obj.end))
        .sort(([keyA, a], [keyB, b]) => {
            const diffA = Number(a.end) - Number(a.start);
            const diffB = Number(b.end) - Number(b.start);
            return diffA - diffB;
        });

    
    if (Object.keys(specials).length > 0) {
        console.log(specials)

        return {
            id: specials[0][1].ID,
            name: specials[0][1].name,
            type: specials[0][1].type,
            string: specials[0][1].asString,
            days: specials[0][1].days,
            schemes: specials[0][1].schemes
        }
    }
    
    /**
     * Get standard hours, since they have no end date, sort by latest start date first.
    */
   const standards = Object.entries(actives)
        .filter(([key, obj]) => obj.end === null).sort((a, b) => Number(b.start) - Number(a.start));

    if (Object.keys(standards).length > 0) {
        // newActive.push(standards[0].ID)
        return {
            id: standards[0][1].ID,
            name: standards[0][1].name,
            type: standards[0][1].type,
            string: standards[0][1].asString,
            days: standards[0][1].days,
            schemes: standards[0][1].schemes
        }
    }

    return null;
}
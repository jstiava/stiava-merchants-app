let current_latitude = null;
let current_longitude = null;

// // Setup Geolocation API options
const options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };

// Geolocation: Success
function resolve(pos) {
    // Get the date from Geolocation return (pos)
    // Get the lat, long, accuracy from Geolocation return (pos.coords)
    const { latitude, longitude, accuracy } = pos.coords;

    current_latitude = latitude;
    current_longitude = longitude;

    return [current_latitude, current_longitude];
}
// Geolocation: Error
function reject(err) {
    console.error(`Error: ${err.code}, ${err.message}`);
}


// Button onClick, get the the location
export async function getPosition(override) {

    if (override) {
        const current_latitude = 38.656588218856925;
        const current_longitude = -90.3015715560746;
        return Promise.resolve({
            coords: {
                latitude: current_latitude,
                longitude: current_longitude
            }
        });
    }

    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

export function distance_formula(x, y) {
    if (x == "") {
        return 10000;
    }
    var [x1, x2] = x;
    var [y1, y2] = y;

    return Math.sqrt(Math.pow(x1 - y1, 2) + Math.pow(x2 - y2, 2))
}

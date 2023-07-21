import { useEffect, useState, useContext } from 'react'
import { getPosition } from '../helpers/geolocation';

const commonLocations = [
    {
        'label': "South 40 Clocktower",
        'coords': [38.64539133064205, -90.3125166069326]
    },
    {
        'label': "Danforth University Center - The DUC",
        'coords': [38.64773904228568, -90.3104831997991]
    },
    {
        'label': "Village House",
        'coords': [38.650646019281105, -90.31345550480863]
    },
    {
        'label': "Brookings Hall",
        'coords': [38.64801472439832, -90.30505434745606]
    },
    {
        'label': 'Seigle Hall',
        'coords': [38.64895283012301, -90.31252791680332]
    },
    {
        'label': 'Anhauser-Busch Hall - School of Law',
        'coords': [38.649690195630505, -90.31206339325426]
    },
    {
        'label': 'Gary M. Sumers Recreation Center',
        'coords': [38.649187603146096, -90.31490901448089]
    },
    {
        'label': 'STL Zoo',
        'coords': [38.63518411101207, -90.29119334964703]
    },
    {
        'label': "560 Music Center",
        'coords': [38.655616042638215, -90.3104393053915]
    },
    {
        'label': "The Lofts",
        'coords': [38.65617587427815, -90.30183316616498]
    },
    {
        'label': "The Link - Delmar",
        'coords': [38.65565695928747, -90.29993070138423]
    },
    {
        'label': "North Campus",
        'coords': [38.657759440043385, -90.29741428250627]
    },
    {
        'label': "West Campus",
        'coords': [38.6497278262459, -90.32907332337231]
    },
    {
        'label': "Barnes Jewish Hospital - South",
        'coords': [38.635296971167655, -90.26481521766816]
    },
    {
        'label': "The Mallinckrodt Center - Edison Theater",
        'coords': [38.64749642800453, -90.3094341755704]
    }
];

const CURRENT_LOCATION = 0;
const OUT_OF_REGION = 1;
const NO_LOCATION = 2;
const broadIdentifiers = [
    {
        'id': CURRENT_LOCATION,
        'label': "My Current Location"
    },
    {
        'id': OUT_OF_REGION,
        'label': "Out of Region"
    },
    {
        'id': NO_LOCATION,
        'label': "Do not use my location"
    }
];

const useLocation = (dateTime, handleMerchantsRankingByProximity) => {

    /**
     * List of common locations to choose from
     */
    const [locations, setLocations] = useState([]);

    /**
     * Holds the passed and used position values that allow for sorting 
     * @type {array} [latitude {number}, longitude {number}]
     */
    const [position, setPosition] = useState({
        context: null,
        coords: null
    });

    /**
     * Saves the user's current position, even if not used.
     */
    const [myLocation, setMyLocation] = useState({
        context: null,
        coords: null,
    });


    /**
     * Init a set of common locations, and sorts them alphabetically
     * Adds index values
     * 
     * onMount
     * TODO - move this functionality to the API, wordpress support for input and listing
     */
    useEffect(() => {

        const sortedLocations = commonLocations.sort((a, b) => {
            return a.label.localeCompare(b.label);
        });

        let updatedLocations = sortedLocations.map((loc, index) => {
            return {
                ...loc,
                id: index + broadIdentifiers.length
            };
        });

        updatedLocations = [...broadIdentifiers, ...updatedLocations];
        setLocations(updatedLocations);

    }, []);



    /**
     * onMount
     */
    useEffect(() => {

        // If recent, just use that
        if (isLocationRecentlySaved()) {
            try {
                const [out_of_region_flag, ls_latitude, ls_longitude] = getLocationFromLocalStorage();
                if (out_of_region_flag) {
                    setMyLocation(() => ({
                        context: OUT_OF_REGION,
                        coords: [0, 0]
                    }));
                    setPosition(() => ({
                        context: OUT_OF_REGION,
                        coords: [0, 0]
                    }));
                    return;
                }
                setMyLocation(() => ({
                    context: CURRENT_LOCATION,
                    coords: [ls_latitude, ls_longitude]
                }));
                setPosition(() => ({
                    context: CURRENT_LOCATION,
                    coords: [ls_latitude, ls_longitude]
                }));
                return;
            }
            catch (err) {
                console.error(err);
            }
        }

        // Ask for location
        askForLocation();

    }, []);


    const shiftPositionContext = (id) => {
        console.log(id);
        if (id === CURRENT_LOCATION) {
            setPosition((prev) => ({
                context: CURRENT_LOCATION,
                coords: myLocation.coords
            }));
            return;
        }

        if (id === OUT_OF_REGION || id === NO_LOCATION) {
            setPosition((prev) => ({
                context: id,
                coords: [0, 0]
            }))
        }
        setPosition((prev) => ({
            context: id,
            coords: locations[id].coords
        }))
        return;
    }


    const updateRecencyStatistics = (out_of_region_flag, latitude, longitude) => {
        // Authorized, update local storage log
        localStorage.setItem("out_of_region_flag", String(out_of_region_flag));
        localStorage.setItem("last_location_collection", dateTime.date.toString());
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
    }


    /**
     * 
     */
    const askForLocation = () => {
        getPosition(false)
            .then((response) => {
                const { latitude, longitude } = response.coords;
                if (isLocationInRegion(latitude, longitude)) {
                    updateRecencyStatistics(false, latitude, longitude);
                    setMyLocation(() => ({
                        context: CURRENT_LOCATION,
                        coords: [latitude, longitude]
                    }));
                    setPosition(() => ({
                        context: CURRENT_LOCATION,
                        coords: [latitude, longitude]
                    }));
                    return;
                }
                setMyLocation(() => ({
                    context: OUT_OF_REGION,
                    coords: [0, 0]
                }));
                setPosition(() => ({
                    context: OUT_OF_REGION,
                    coords: [0, 0]
                }));
                updateRecencyStatistics(true, 0, 0);
                return;
            })
            .catch((error) => {
                console.error(error);
                setMyLocation(() => ({
                    context: NO_LOCATION,
                    coords: [0, 0]
                }));
                setPosition(() => ({
                    context: NO_LOCATION,
                    coords: [0, 0]
                }));
            })
    }

    const isLocationRecentlySaved = () => {
        try {
            const last_location_collection = cleanData(localStorage.getItem("last_location_collection"));

            if (last_location_collection === null) {
                return false;
            }

            const savedDate = new Date(last_location_collection);
            const differenceInMinutes = (dateTime.date - savedDate) / (1000 * 60);

            if (differenceInMinutes < 30) {
                return true;
            }
        }
        catch (err) {
            return false;
        }
        return false;
    }


    const isLocationInRegion = (latitude, longitude) => {
        if (longitude < -90.8845) {
            return false;
        }

        if (longitude > -89.59714) {
            return false;
        }

        if (latitude < -90.8845) {
            return false;
        }

        if (latitude > 39.06166) {
            return false;
        }

        return true;
    }

    const cleanData = (input) => {
        if (input) {
            try {
                return input.replace(/[^a-zA-Z0-9 \-():.]/g, '');
            }
            catch (err) {
                console.error('Error cleaning localStorage data:', err);
            }
        }

        return null;
    }


    const getLocationFromLocalStorage = () => {
        const out_of_region_flag = cleanData(localStorage.getItem("out_of_region_flag"));
        if (out_of_region_flag === null) {
            throw new Error("Region flag not found in local storage");
        }

        if (out_of_region_flag === "true") {
            return [true, 0, 0];
        }

        const latitude = cleanData(localStorage.getItem("latitude"));
        if (latitude === null) {
            throw new Error("Latitude not found in local storage");
        }

        const longitude = cleanData(localStorage.getItem("longitude"));
        if (longitude === null) {
            throw new Error("Longitude not found in local storage");
        }

        return [false, Number(latitude), Number(longitude)];
    }


    return ({ position, locations, shiftPositionContext });
}

export default useLocation;
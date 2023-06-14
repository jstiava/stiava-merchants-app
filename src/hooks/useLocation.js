import { useEffect, useState, useContext } from 'react'
import { getPosition } from '../helpers/geolocation';

const commonLocations = [
    {
        'name': "South 40 Clocktower",
        'longitude': -90.3125166069326,
        'latitude': 38.64539133064205
    },
    {
        'name': "Village House",
        'longitude': -90.31345550480863,
        'latitude': 38.650646019281105
    },
    {
        'name': "Brookings Hall",
        'longitude': -90.30505434745606,
        'latitude': 38.64801472439832
    },
    {
        'name': "560 Music Center",
        'longitude': -90.3104393053915,
        'latitude': 38.655616042638215
    },
    {
        'name': "The Lofts",
        'longitude': -90.30183316616498,
        'latitude': 38.65617587427815
    },
    {
        'name': "The Link - Delmar",
        'longitude': -90.29993070138423,
        'latitude': 38.65565695928747
    },
    {
        'name': "North Campus",
        'longitude': -90.29741428250627,
        'latitude': 38.657759440043385
    },
    {
        'name': "West Campus",
        'longitude': -90.32907332337231,
        'latitude': 38.6497278262459
    },
    {
        'name': "Barnes Jewish Hospital - South",
        'longitude': -90.26481521766816,
        'latitude': 38.635296971167655
    }
];

const CURRENT_LOCATION = 0;
const OUT_OF_REGION = 1;
const NO_LOCATION = 2;
const broadIdentifiers = [
    {
        'id': CURRENT_LOCATION,
        'name': "My Current Location"
    },
    {
        'id': OUT_OF_REGION,
        'name': "Out of Region"
    },
    {
        'id': NO_LOCATION,
        'name': "Do not use my location"
    }
];

const useLocation = (date, recent) => {

    /**
     * Holds the passed and used position values that allow for sorting 
     * @type {array} [latitude {number}, longitude {number}]
     */
    const [position, setPosition] = useState(undefined);

    /**
     * Saves the user's current position, even if not used.
     */
    const [myLocation, setMyLocation] = useState(undefined);

    /**
     * List of common locations to choose from
     */
    const [locations, setLocations] = useState([]);


    /**
     * Provides the current location within the locations array.
     */
    const [locationContext, setLocationContext] = useState(CURRENT_LOCATION);

    /**
     * Init a set of common locations, and sorts them alphabetically
     * Adds index values
     * 
     * onMount
     */
    useEffect(() => {

        const sortedLocations = commonLocations.sort((a, b) => {
            return a.name.localeCompare(b.name);
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

    const updateRecencyStatistics = (latitude, longitude) => {
        // Authorized, update local storage log
        console.log(date);
        localStorage.setItem("last_location_collection", date.toString());
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
    }


    /**
     * 
     */
    const askForLocation = () => {
        getPosition(false)
            .then((response) => {
                console.log("Location authorized...");

                updateRecencyStatistics(response.coords.latitude, response.coords.longitude);

                // Authorized, update state
                setPosition([response.coords.latitude, response.coords.longitude]);
                setMyLocation([response.coords.latitude, response.coords.longitude]);
                setLocationContext(CURRENT_LOCATION);
            })
            .catch((error) => {
                // Denied
                setLocationContext(NO_LOCATION);
            })
    };

    /**
     * 
     */
    useEffect(() => {
        // If location services, and recent
        if (date === undefined || recent === null) {
            return;
        }
        if (recent) {
            setPosition([localStorage.getItem("latitude"), localStorage.getItem("longitude")]);
            setMyLocation([localStorage.getItem("latitude"), localStorage.getItem("longitude")]);
            setLocationContext(CURRENT_LOCATION);
            return;
        }
        askForLocation();
    }, [date, recent]);


    useEffect(() => {
        switch(locationContext) {
            case CURRENT_LOCATION:
                if (myLocation === undefined) {
                    return askForLocation();
                }
                setPosition(myLocation);
                break;
            case OUT_OF_REGION:
                setPosition([]);
                break;
            case NO_LOCATION:
                setPosition([]);
                break;
            default:
                setPosition([locations[locationContext].latitude, locations[locationContext].longitude]);
                break;
        }
    }, [locationContext]);
    

    return ({ position, locations, locationContext, setLocationContext });
}

export default useLocation;
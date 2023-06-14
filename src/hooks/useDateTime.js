import { useEffect, useState } from 'react'


/**
 * Establishes source for date & time within the app
 * @returns 
 */
const useDateTime = () => {
    const [date, setDate] = useState(new Date());
    const [serialDate, setSerialDate] = useState(0);
    const [day, setDay] = useState(0);
    const [hourMin, setHourMin] = useState(0);
    const [recent, setRecent] = useState(null);



    /***
     * Convert the Date API's hour index to a 0-23 scale. 0 = 4am. Days are treated as if they start & end at 4am, not midnight. Why? It is more common for a location or merchant to remain open past midnight. By moving a day's cutoff up, we implement hours past midnight functionality for free.
     * @param {number} hour - value on a 0-24 scale
     * @param {number} minute - value on a scale of 0-59
     * @returns {float} an adjusted hour value with minutes added as a decimal place.
     * @example const value = getHourMin(23, 30) // Output: 19.5 
     */
    function getHourMin(hour, minute) {
        let value = hour - 4;
        if (value < 0) {
            value = 24 + hour;
        }
        value += (minute / 60);
        return value;
    }



    /**
     * 
     * @param {*} year 
     * @param {*} month 
     * @param {*} index 
     * @returns 
     */
    function getSerialDate(year, month, index) {
        let value = year;
        month < 10 ? value *= 10 : value += month;
        index < 10 ? value *= 10 : value += index;
        return value;
    }



    /**
     * 
     * @param {*} day 
     * @returns 
     */
    function day_value_to_index(day) {
        day = day - 1;
        return day < 0 ? 6 : day;
    }



    function checkRecency() {
        const last_location_collection = localStorage.getItem("last_location_collection");
        const savedDate = new Date(last_location_collection);
        const differenceInMinutes = (date - savedDate) / (1000 * 60);

        if (differenceInMinutes < 30) {
            return true;
        }

        return false;
    }

    /**
     * Load on mount.
     * 
     */
    useEffect(() => {
        setSerialDate(getSerialDate(date.getFullYear(), date.getMonth(), date.getDate()));
        setDay(day_value_to_index(date.getDay()));
        setHourMin(getHourMin(date.getHours(), date.getMinutes()));
        setRecent(checkRecency());
    }, []);

    return { date, serialDate, day, hourMin, recent };
}

export default useDateTime;
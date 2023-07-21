import { useEffect, useState } from 'react'


/**
 * Establishes source for date & time within the app
 * @returns 
 */
const useDateTime = () => {
    const [todaySerialDate, setTodaySerialDate] = useState(0);
    const [date, setDate] = useState(new Date());
    const [serialDate, setSerialDate] = useState(0);
    const [day, setDay] = useState(0);
    const [hourMin, setHourMin] = useState(0);


    /**
     * Load on mount.
     * 
     */
    useEffect(() => {
        const value = getSerialDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        setSerialDate(value);
        setTodaySerialDate(value);
        setDay(day_value_to_index(date.getDay()));
        setHourMin(getHourMin(date.getHours(), date.getMinutes()));
    }, []);



    /***
     * Convert the Date API's hour index to a 0-23 scale. 0 = 4am. Days are treated as if they start & end at 4am, not midnight. Why? It is more common for a location or merchant to remain open past midnight. By moving a day's cutoff up, we implement hours past midnight functionality for free.
     * @param {number} hour - value on a 0-24 scale
     * @param {number} minute - value on a scale of 0-59
     * @returns {float} an adjusted hour value with minutes added as a decimal place.
     * @example const value = getHourMin(23, 30) // Output: 19.5 
     */
    const getHourMin = (hour, minute) => {
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
    const getSerialDate = (year, month, index) => {
        let value = year;
        value *= 100;
        value += month;

        value *= 100;
        value += index;
        return value;
    }

    /**
     * 
     * @param {*} day 
     * @returns 
     */
    const day_value_to_index = (day) => {
        day = day - 1;
        return day < 0 ? 6 : day;
    }

    
    const shiftDateContext = (newSerialDate) => {
        return true;
    }




    return { date, serialDate, day, hourMin, shiftDateContext };
}

export default useDateTime;
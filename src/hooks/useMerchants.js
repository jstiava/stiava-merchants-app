import { useState, useEffect, useCallback } from 'react';
import { isOpen } from '../helpers/Hours';
import axios from 'axios';
import { distance_formula } from '../helpers/geolocation';


/**
 * 
 * @param {integer} serialDate 
 * @param {integer} day 
 * @param {float} hourMin 
 * @param {float[]} position 
 * @param {Set<Integer>} selectedCategories 
 * @returns 
 */
const useMerchants = (serialDate, day, hourMin, position, implicitCategories, selectedCategories) => {

    // Data States    
    const [master, setMaster] = useState([]);
    const [merchants, setMerchants] = useState([]);

    useEffect(() => {
        if (serialDate && day) {
            axios.get('https://card.local/wp-json/js/v1/merchants/', {
                params: {
                    day: day,
                    date: serialDate,
                },
            })
                .then((response) => {
                    const data = response.data;
                    console.log("fetch successful");
                    console.log(position);
                    setMaster(data);
                    setMerchants(data);
                })
                .catch((error) => {
                    console.log('Error while compiling list of merchants', error);
                });
        }
    }, [serialDate, day]);

    useEffect(() => {
        if (selectedCategories === undefined) {
            return;
        }
        if (selectedCategories.size === 0) {
            setMerchants(master);
            return;
        }
        filterByCategory();
    }, [selectedCategories]);
    

    useEffect(() => {
        if (position === undefined) {
            return;
        }
        if (position.length === 0) {
            return orderByAlpha();
        }
        orderByScore();
    }, [position]);


    const orderByScore = () => {
        const updatedMerchants = merchants.map((merchant) => {
            const proximity = distance_formula(position, merchant.location);
            try {
                const status = isOpen(merchant.schedule.regular, serialDate, day, hourMin);
                if (status) {
                    return {
                        ...merchant,
                        proximity: proximity,
                        score: proximity / 5
                    };
                }
                return {
                    ...merchant,
                    proximity: proximity,
                    score: proximity
                };
            }
            catch (err) {
                return {
                    ...merchant,
                    proximity: proximity,
                    score: proximity / 4
                };
            }
        });

        const reorderedMerchants = updatedMerchants.sort((merchantA, merchantB) => {
            return merchantA.score - merchantB.score;
        });

        setMerchants(reorderedMerchants);
    };


    const orderByProximity = () => {

        const updatedMerchants = merchants.map((merchant) => {
            const proximity = distance_formula(position, merchant.location);
            return {
                ...merchant,
                proximity: proximity,
            };
        });

        const reorderedMerchants = updatedMerchants.sort((merchantA, merchantB) => {
            return merchantA.proximity - merchantB.proximity;
        });

        console.log(reorderedMerchants);

        setMerchants(reorderedMerchants);
    };

    const orderByAlpha = () => {
        console.log("TODO: Add functionality for sorting merchants list alphabetically by name.");
        const reorderedMerchants = [...merchants].sort((a, b) =>
            a.title.localeCompare(b.title)
        );
        setMerchants(reorderedMerchants);
    };

    const filterByCategory = () => {
        const filteredMerchants = master.filter((merchant) =>
            merchant.categories.some((category) => selectedCategories.has(category))
        );

        console.log(filteredMerchants);
        setMerchants(filteredMerchants);
    };


    return ({ merchants, orderByScore, orderByProximity, orderByAlpha, filterByCategory });
};

export default useMerchants;
import { useState, useEffect, useCallback } from 'react';
import { getStatus, getActiveMarketHours, getActiveVenueHours } from '../helpers/Hours';
import axios from 'axios';
import { distance_formula } from '../helpers/geolocation';
// import test_data from '../data.json';
import useDateTime from './useDateTime';
import { calculateScore } from '../helpers/scoring';


const useMerchantsDriver = () => {

    // DateTime
    const dateTime = useDateTime();

    // Data States    
    const [master, setMaster] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [fetchFlag, setFetchFlag] = useState(false);

    /**
     * Fetch merchants list and place in the master state. Master should never be altered after this point.
     */
    useEffect(() => {
        if (dateTime.serialDate === 0 || fetchFlag) {
            return;
        }
        axios.get('https://card.local/wp-json/jsmp/v1/merchants', {
            params: {
                day: dateTime.day,
                date: dateTime.serialDate,
            },
        })
            .then((response) => {
                const data = response.data;

                console.log(data);
                console.log(dateTime);

                const result = Object.entries(data.merchants).map(([key, merchant]) => {

                    // Clean color schemes
                    if (merchant.color_scheme === undefined) {
                        merchant.color_scheme = {
                            primary: "#ffffff",
                            secondary: "#000000"
                        };
                    }

                    const selection = getActiveMarketHours(data.chronos, merchant.hours, dateTime);
                    console.log(merchant.title);
                    merchant.id = key;

                    // Merchant is venue-dependent
                    if (selection === null) {
                        let merchant_status = {
                            isOpen: false,
                            message: "CLOSED",
                            sequence: [],
                            type: null,
                            wait: 0,
                            object: {
                                id: 0,
                                name: "",
                                type: 'standard',
                                string: "See Details"
                            },
                            type: 'propogated'
                        }

                        const new_venues = Object.entries(merchant.venues).map(([venue_key, venue]) => {
                            console.log(venue.title);
                            const venue_status = getActiveVenueHours(venue.hours, dateTime);
                            if (venue_status.isOpen) {
                                merchant_status.isOpen = true;
                                merchant_status.message = "OPEN NOW";
                            }
                            venue.status = venue_status;
                            return venue;
                        })
                        console.log(new_venues);
                        console.log(merchant_status);
                        merchant.venues = new_venues;
                        merchant.status = merchant_status;
                    }


                    // Merchant hours are dictated by the chronos or the market
                    else {
                        const new_venues = Object.entries(merchant.venues).map(([venue_key, venue]) => {
                            venue.status = selection;
                            return venue;
                        })
                        merchant.venues = new_venues;
                        merchant.status = selection;
                    }

                    return merchant;

                })

                console.log(result);
                setMaster(result);
                setFetchFlag(true);
            })
            .catch((error) => {
                console.log('Error while compiling list of merchants', error);
            });
    }, [dateTime.serialDate]);

    const handleMerchantsRankingByScore = (selectedCategories, coords) => {
        const filteredList = filterByCategory(master, selectedCategories);
        console.log(coords);
        if (coords === undefined || coords[0] === 0) {
            const rankedList = orderByScoreNoProximity(filteredList);
            setMerchants(rankedList);
            return;
        }
        const rankedList = orderByScore(filteredList, coords);
        setMerchants(rankedList);
    }

    const handleMerchantsRankingByProximity = (selectedCategories, coords) => {
        const filteredList = filterByCategory(master, selectedCategories);
        const rankedList = orderByProximity(filteredList, coords);
        setMerchants(rankedList);
    }

    const handleMerchantsRankingByAlpha = (selectedCategories) => {
        const filteredList = filterByCategory(master, selectedCategories);
        const rankedList = orderByAlpha(filteredList);
        setMerchants(rankedList);
    }


    const orderByScoreNoProximity = (merchants_list) => {
        const updatedMerchants = merchants_list.map((merchant) => {
            let proximity = 0;
            return {
                ...merchant,
                score: calculateScore(merchant.status.isOpen, merchant.status.wait, proximity)
            }
        });

        const reorderedMerchants = updatedMerchants.sort((merchantA, merchantB) => {
            return merchantB.score - merchantA.score;
        });

        return reorderedMerchants;
    };

    const orderByScore = (merchants_list, coords) => {
        const updatedMerchants = merchants_list.map((merchant) => {
            let proximity = 0;
            if (!merchant.coordinates) {
                proximity = 100;
            }
            else {
                proximity = distance_formula([merchant.coordinates.lat, merchant.coordinates.lng], coords);
            }

            return {
                ...merchant,
                score: calculateScore(merchant.status.isOpen, merchant.status.wait, proximity)
            }
        });

        const reorderedMerchants = updatedMerchants.sort((merchantA, merchantB) => {
            return merchantB.score - merchantA.score;
        });

        return reorderedMerchants;
    };


    const orderByProximity = (merchants_list, coords) => {
        const updatedMerchants = merchants_list.map((merchant) => {
            const proximity = distance_formula([merchant.coordinates.lat, merchant.coordinates.lng], coords);
            return {
                ...merchant,
                proximity: proximity,
            };
        });

        const reorderedMerchants = updatedMerchants.sort((merchantA, merchantB) => {
            return merchantA.proximity - merchantB.proximity;
        });

        return reorderedMerchants;
    };

    const orderByAlpha = (merchants_list) => {
        const reorderedMerchants = [...merchants_list].sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        return reorderedMerchants;
    };

    const filterByCategory = (merchants_list, selectedCategories) => {
        if (selectedCategories.size === 0) {
            return merchants_list;
        }
        const filteredMerchants = merchants_list.filter((merchant) =>
            merchant.categories.some((category) => selectedCategories.has(category))
        );

        return filteredMerchants;
    };


    return ({ dateTime, merchants, fetchFlag, handleMerchantsRankingByScore, handleMerchantsRankingByAlpha, handleMerchantsRankingByProximity });
};

export default useMerchantsDriver;
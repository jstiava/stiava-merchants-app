import { useEffect, useState } from 'react';
import { clean_text } from '../helpers/esthetics';
import axios from 'axios';



/**
 * @param {integer} day - helps identify implicit categories
 * @param {float} hourMin - same as above
 * @returns {Object} categories, implicitCategories, selectedCategories, and setSelectedCategories
 */
const useCategories = (day, hourMin) => {
    // Data States    
    const [categories, setCategories] = useState([]);
    const [implicitCategories, setImplicitCategories] = useState(new Set());
    const [selectedCategories, setSelectedCategories] = useState(new Set());

    // Get Categories on load
    useEffect(() => {
        axios.get('https://card.local/wp-json/wp/v2/merchant_categories/', {})
            .then((response) => {
                console.log("Categories found...");
                const data = response.data.map(item => ({
                    id: item.id,
                    name: clean_text(item.name),
                    description: clean_text(item.description),
                    count: item.count
                }));
                setCategories(data);
            })
            .catch((error) => {
                console.log('Error while compiling list of categories', error);
            })
    }, []);

    return ({ categories, implicitCategories, selectedCategories, setSelectedCategories });
};

export default useCategories;
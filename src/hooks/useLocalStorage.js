import { useState, useEffect } from 'react';

const useLocalStorage = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    console.log(localStorage);

    if (localStorage.getItem('last_login') === null) {
      console.log("Setting last_login");
      localStorage.setItem("last_login", new Date());
    } 
    else {
      console.log("Getting last_login");
      console.log(localStorage.getItem('last_login'));
    }

    const storedData = localStorage.getItem('last_login');
    setData(storedData); // Assuming 'setData' is a state update function for a variable named 'data'
  }, []);

  return { data };
};

export default useLocalStorage;

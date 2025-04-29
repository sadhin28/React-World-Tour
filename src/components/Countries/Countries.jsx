import { useEffect } from "react";
import { useState } from "react";

const Countries = () => {
    const [countries,setcountries]=useState([]);
    useEffect(()=>{
        fetch('https://restcountries.com/v3.1/all')
        .then(res=>res.json())
        .then(data=>setcountries(data))
    },[])
    return (
        <div>
            <h3>Countries : {countries.length} </h3>
        </div>
    );
};

export default Countries;
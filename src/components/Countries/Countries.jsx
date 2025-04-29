import { useEffect } from "react";
import { useState } from "react";
import Country from "./Country/Country";
import './Countries.css'
const Countries = () => {
    const [countries,setcountries]=useState([]);
    const [visitedCountries,setvisitedCountries]=useState([])
    useEffect(()=>{
        fetch('https://restcountries.com/v3.1/all')
        .then(res=>res.json())
        .then(data=>setcountries(data))
    },[])

    const handelvisitedCountry =country=>{
        console.log('')
    }
    return (
       
        <div >
             <h3>Countries : {countries.length} </h3>
            <div>
               <h5>Visited Countries </h5>

            </div>
       <div className="country-container">
       {
            countries.map(country=><Country 
                key={country.cca3}
                handelvisitedCountry={handelvisitedCountry}
                country={country}></Country>)
        }
       </div>
        </div>
        
    );
};

export default Countries;
import { useState } from 'react';
import './Country.css';
const Country = ({country,handelvisitedCountry}) => {
    // console.log(country)
    
    const handlevisited =(visit)=>{

      setvisited(!visited)
    }
   const passWithParams =()=>  handelvisitedCountry(country)
    const {name,flags,population,area,cca3}=country;
    const [visited,setvisited]=useState(false)
    
    return (
        <div className={`country ${visited && 'visited'}`}>
            <h4>Country Name : {name?.common} </h4>
            <h5>Official Name : {name?.official}</h5>
            <h5>Population : {population}</h5>
            <h6>Area : {area}</h6>
            <p><small>Code : {cca3}</small></p>
            <img className='flags' src={flags?.png} alt="" /> <br /><br />
            <button onClick={passWithParams}>Mark Visited</button>
            <button  style={{
                backgroundColor: visited? 'black':'green',
                color: visited ? 'white':'white ',
                fontWeight:700
            
            }}  onClick={handlevisited}>{visited ? 'Visited':'Going'}</button> <br /><br />
            {visited ? 'I have Visited This Country' : 'I want to Visited'}
        </div>
    );
};

export default Country;
import { useState } from 'react';
import './Country.css';
const Country = ({country,handelvisitedCountry,handelvisitedFlag}) => {
    // console.log(country)
    
    const handlevisited =()=>{

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
            <div style={{
                display:'flex',
                justifyContent:'space-around',
               
            }}>
            <button onClick={()=>handelvisitedFlag(country.flags.png)}>Visited Flag</button>
            <button style={{
                backgroundColor:visited ? 'black':'green',
                color: visited ? 'white':'white '
            }} onClick={passWithParams}>Mark Visited</button>
            <button  style={{
                backgroundColor: visited? 'black':'green',
                color: visited ? 'white':'white ',
                fontWeight:700
            
            }}  onClick={handlevisited}>{visited ? 'Visited':'Going'}</button>
            </div> <br />
            {visited ? 'I have Visited This Country' : 'I want to Visited'}
        </div>
    );
};

export default Country;
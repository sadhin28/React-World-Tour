import './Country.css';
const Country = ({country}) => {
    console.log(country)

    const {name,flags,population,area}=country
    return (
        <div className='country'>
            <h4>Country Name : {name?.common} </h4>
            <h5>Official Name : {name?.official}</h5>
            <h5>Population : {population}</h5>
            <h6>Area : {area}</h6>
            <img className='flags' src={flags?.png} alt="" />
        </div>
    );
};

export default Country;
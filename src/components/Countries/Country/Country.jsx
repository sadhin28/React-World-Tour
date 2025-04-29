import './Country.css';
const Country = ({country}) => {
    console.log(country)

    const {name,flags}=country
    return (
        <div className='country'>
            <h4>Country Name : {name?.common} </h4>
            <h5>Official Name : {name?.official}</h5>
            <img className='flags' src={flags?.png} alt="" />
        </div>
    );
};

export default Country;
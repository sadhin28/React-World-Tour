import './Country.css'
const Country = ({country}) => {
    const {name}=country
    return (
        <div className='country'>
            <h4>Country Name : {name?.common} </h4>
            <h5>Official Name : {name.official}</h5>
        </div>
    );
};

export default Country;
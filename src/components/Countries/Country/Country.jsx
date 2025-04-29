import './Country.css'
const Country = ({country}) => {
    const {name}=country
    return (
        <div className='country'>
            <h4>Country Name : {name?.common} </h4>
        </div>
    );
};

export default Country;
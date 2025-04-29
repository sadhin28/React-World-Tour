const Country = ({country}) => {
    const {name}=country
    return (
        <div>
            <h4>Country Name : {name?.common} </h4>
        </div>
    );
};

export default Country;
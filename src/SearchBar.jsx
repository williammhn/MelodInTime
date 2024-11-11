import { useState } from 'react'

function SearchBar({props}) {

    const [date, setDate] = useState('');

    const handleInputChange = (event) => {
        console.log(event);
        setDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (date) {
            props(date);
        }
        
    }

    return (
        <>
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="dateSearch">Choose a date</label>
                <input type="date" id="dateSearch" value={date} onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
        </>
        
    )
}

export default SearchBar
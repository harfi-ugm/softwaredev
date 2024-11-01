import { useState } from "react";

const SearchCard = (props) => {
    //console.log(props)
    const {listUser, getDataFromChild} = props
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e) => {
        const {value} = e.target
        console.log(value)
        setInputValue(value)
    }

    const handleSubmit = (e) => {
        e.preventDeffault()
        //console.log(e)
        getDataFromChild(inputValue)
    }
    return (
        <form onSubmit={handleSubmit} className ='SearchCard'>
            <input type='text' onChange={handleInputChange} value={inputValue} placeholder='Search recipes'></input>
            <button type='submit'>Search recipes</button>

            {inputValue}
        </form>);
}

export default SearchCard;
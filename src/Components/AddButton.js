import React from 'react'
import {MoonLoader} from 'react-spinners'
import Material from './Material'

const AddButton = (props) =>
{
    return (
        <Material className={props.loading ? 'category-create-loading' : 'category-create'} backgroundColor='rgba(255,255,255,0.5)' onClick={props.onClick} content={
            props.loading ?
                <MoonLoader size={40} color='#2A3542'/>
                :
                <div className='category-create-logo'>+</div>
        }/>
    )
}

export default AddButton
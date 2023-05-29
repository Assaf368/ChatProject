import React from 'react'
import './Input.css'

export const Input = React.forwardRef(({...props},ref)=>{
    return(
        <div className='Input-container'>
         <label className='Input-label'>
           <div className='Input-title'>{props.title}</div>
           <input className='Input-element' tooltipState={props.tooltipState} ref={ref} required type={props.type} placeholder={props.placeholder} onBlur={props.onBlur} pattern={props.pattern} onInput={props.onInput} minLength={props.minLength} maxLength={props.maxLength} />
         </label>
        </div>
        
    )
}) 
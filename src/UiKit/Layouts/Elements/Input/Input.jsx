import './Input.css'

export const Input = ({...props})=>{
    return(
        <label className='Input-label' htmlFor="">
            <div className='Input-title'>{props.title}</div>
            <input className='Input-element' required type={props.type} placeholder={props.placeholder} onInput={props.onInput} minLength={props.minLength} maxLength={props.maxLength} />
        </label>
    )
}
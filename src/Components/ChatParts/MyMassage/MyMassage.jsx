import './MyMassage.css'


export const MyMassage = ({text, date})=>{
    return(
        <div className='my-massage-card'>
              <div className='my-massage-text-container'>
                <div className='my-massage-text'>{text}</div>
                <div className='my-massage-date-container'>{date}</div>
              </div>
          </div>
    )
}
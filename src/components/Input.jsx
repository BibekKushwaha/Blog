import React,{useId} from 'react'

 const Input =React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
 },ref){
    const id = useId();
    return (<div className='w-full'>
        {
            label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{label}</label>
        }
        <input
        type={type}
        id={id}
        ref={ref}
        className={`text-block rounded-lg bg-white px-3 py-2 text-sm outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        {...props}
        
        />
    </div>)
 });
export default Input;

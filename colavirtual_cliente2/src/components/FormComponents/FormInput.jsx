import { useState } from "react";
// import "./formInput.css";

const FormInput = ( props ) => {
    const [ focused, setFocused ] = useState( false );
    const { label, errorMsg, onChange, attributes } = props;

    const handleFocus = ( e ) => {
        setFocused( true );
    };
    return (
        <>
            <label htmlFor={ attributes.name }><strong>{ label }</strong></label>
            <input
                { ...attributes }
                autoComplete='off'
                onChange={ onChange }
                onBlur={ handleFocus }
                focused={ `${focused}` }
            />
            <span className="small error">{ errorMsg || '\u00A0' }</span>
        </>
    );
};

export default FormInput;
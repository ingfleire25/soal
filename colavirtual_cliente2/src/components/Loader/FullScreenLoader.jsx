import React from 'react'
import { contenedor, loader } from './FullScreenLoader.module.css'

const FullScreenLoader = () => {
    return (
        <div className={ contenedor }>
            <div className={ loader }></div>
        </div>
    )
}

export default FullScreenLoader
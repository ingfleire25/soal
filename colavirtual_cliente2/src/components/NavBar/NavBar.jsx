import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NavBar.module.css'
import logo from '../../assets/imgs/logo_blanco.png'

const NavBar = () => {
    return (
        <header className={styles.container}>
            <nav className={styles.navbar}>
                <p><Link to='/'><img className={styles.logo} src={logo} alt='PDVSA, S.A.' /></Link></p>
                <ul className={styles.menuList}>
                    <li><Link to='/solicitudes'>Solicitudes</Link></li>
                    <li><Link to='/reportes'>Reportes</Link></li>
                    <li><Link to='/asignar-analista'>Asignar-Analista</Link></li>
                    <li><Link to='/cerrar-sesion'>Cerrar sesión</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar
import React, { useState } from 'react';
import { contenedor, datos, ubicacion, categorizacion, botones } from './SolicitudFormulario.module.css';
import FormInput from '../FormComponents/FormInput';
import FormSelect from '../FormComponents/FormSelect';
import FormCheckboxesList from '../FormComponents/FormCheckboxesList';
import { validarFormato } from './validarFormato';
import { validarLlenado } from './validarLlenado';
import { getUsuario, postSolicitud, consultaSiga } from '../../services';
import FullScreenLoader from '../Loader/FullScreenLoader';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

const SolicitudFormulario = () => {
    // ... (tu código existente)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validarLlenado(input);
        if (!Object.keys(err).length) {
            const lista = input.tipos.sort((a, b) => a.tx_nombre.localeCompare(b.tx_nombre)).reduce((prev, curr, idx) => {
                return prev + `<li>${input.tipos[idx].tx_nombre}</li>`;
            }, "");
            Swal.fire({
                title: '¿Crear solicitud con los siguientes tipos y fecha?',
                icon: 'question',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                denyButtonText: `Borrar`,
                cancelButtonText: 'Volver',
                confirmButtonColor: '#1b26ca',
                denyButtonColor: '#ca1b26',
                html: `<ul align='center'><span class='bold'>Tópicos:</span>${lista}</ul><br><p><span class='bold'>Fecha:</span> ${input.fh_atencion}</p>`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let cuerpo = { ...input, tipos: input.tipos.map(t => t.id) };

                    // Verificar si "CREAR CASO SIGA" está en input.tipos
                    const crearCasoSiga = input.tipos.some(tipo => tipo.tx_nombre === "CREAR CASO SIGA");

                    if (crearCasoSiga) {
                        // Llamar a la API crearCasoConRegistroTrabajo
                        try {
                            setLoading(true);
                            const response = await fetch(`/api/crearCasoConRegistroTrabajo/${input.cedula}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (!response.ok) {
                                throw new Error('Error al crear caso en SIGA');
                            }
                            const data = await response.json();
                            Swal.fire('Caso en SIGA creado con éxito', '', 'success');
                            console.log(data);
                        } catch (error) {
                            Swal.fire('Error al crear caso en SIGA', error.message, 'error');
                        } finally {
                            setLoading(false);
                        }
                    } else {
                        // Lógica original para postSolicitud
                        const res = await Swal.fire({
                            title: 'Copia de Solicitud',
                            icon: 'question',
                            text: '¿Quisiera recibir una copia de la solicitud creada en un correo alternativo?',
                            input: 'email',
                            inputLabel: 'Correo alternativo',
                            inputPlaceholder: 'usuario@correo.com',
                            showDenyButton: true,
                            denyButtonText: 'No',
                            confirmButtonText: 'Enviar'
                        });

                        if (res.isConfirmed) {
                            if (res.value) {
                                cuerpo = { ...cuerpo, correo_alt: res.value };
                            }
                        }

                        try {
                            setLoading(true);
                            const solicitud = await postSolicitud(cuerpo);
                            Swal.fire({
                                title: '¡Solicitud creada con éxito!',
                                html: `<p class='bold'>Su número de ticket es: ${solicitud.n_ticket}</p><p>En breve llegará a su bandeja de correo un mensaje con los detalles de su solicitud<p/>`,
                                icon: 'success'
                            });
                        } catch (error) {
                            Swal.fire('Error al guardar la solicitud', error.statusText, 'error');
                        } finally {
                            setLoading(false);
                            navigate('/');
                        }
                    }
                    stateReset();
                } else if (result.isDenied) {
                    stateReset();
                    Swal.fire('Solicitud Eliminada', '', 'success');
                }
            });
        } else {
            setError(err);
        }
    };

    // ... (el resto de tu código)
};

//export default SolicitudFormulario;
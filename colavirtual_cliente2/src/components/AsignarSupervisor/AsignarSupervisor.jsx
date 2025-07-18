import React, { useState } from 'react';
import { contenedor, datos, ubicacion, botones } from './SolicitudFormulario.module.css';
import FormInput from '../FormComponents/FormInput';
import FormSelect from '../FormComponents/FormSelect';
import { validarFormato } from '../AsignarSupervisor/validarFormato';
import { validarLlenado } from '../AsignarSupervisor/validarLlenado';
import { getUsuario, postSupervisor } from '../../services'; // Mantenemos postSolicitud por si la lógica posterior lo requiere
import FullScreenLoader from '../Loader/FullScreenLoader';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';


const AsignarAnalista = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = {
    solicitanteId: '',
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    estado: '0',
    indicador: '',
    zona: '0',
    area: '0',
    localidad: '0',
    uaId: '0',
  };
  const [input, setInput] = useState(initialState);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const buscarPorCI = async () => {
    if (!input.cedula) return false;
    setLoading(true);
    setInput({
      ...input,
      solicitanteId: '',
      nombre: '',
      apellido: '',
      correo: '',
      estado: '0',
      indicador: '',
    });
    try {
      const u = await getUsuario(input.cedula);
      setInput({
        ...input,
        solicitanteId: u.uuid,
        nombre: u.tx_nombre,
        apellido: u.tx_apellido,
        correo: u.tx_correo,
        estado: u.tx_estado,
        indicador: u.tx_indicador,
      });
    } catch (error) {
      Swal.fire(error.statusText, '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ name, value }) => {
    if (name === 'cedula') {
      if (!isNaN(value)) {
        setInput({
          ...input,
          cedula: value,
        });
      }
    } else {
      setInput({
        ...input,
        [name]: value,
      });
    }
    setError(validarFormato({ ...input, [name]: value }));
  };

  const handleSubmit = async (e) => {
          e.preventDefault();
          const err = validarLlenado(input);
          if (!Object.keys(err).length) {
              
              
              const result = await Swal.fire({
                  title: '¿Asignar analista a la unidad de atencion?',
                  icon: 'question',
                  showDenyButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Asignar',
                  denyButtonText: `Borrar`,
                  cancelButtonText: 'Volver',
                  confirmButtonColor: '#1b26ca',
                  denyButtonColor: '#ca1b26',
                  html: `<ul align='center'><span class='bold'>Analista:</span>${input.nombre}${input.apellido}</ul><br><p><span class='bold'>Unidad de Atencion:</span> ${input.uaId}</p>`
              });
      
              if (result.isConfirmed) {
                  let cuerpo = { ...input};
                        
                      
                  try {
                      setLoading(true);
                      const solicitud = await postSupervisor(cuerpo);
                      // console.log(solicitud)
                      // console.log(cuerpo)
                      Swal.fire({
                          title: 'Analista asignado con éxito!',
                          html: `<p class='bold'>El analista ha sido asignado con exito en la unidad indicada<p/>`,
                          icon: 'success'
                      });
                  } catch (error) {
                      Swal.fire('Error al guardar la solicitud', error.statusText, 'error');
                  } finally {
                      setLoading(false);
                      navigate('/');
                  }
      
                  stateReset();
              } else if (result.isDenied) {
                  stateReset();
                  Swal.fire('Solicitud Eliminada', '', 'success');
              }
          } else {
              setError(err);
          }
      };

  const stateReset = () => {
    setInput(initialState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? <FullScreenLoader /> : null}
      <div className={`${contenedor} `}>
        <div className={`section ${datos} `}>
          <h2>Asignar Supervisor</h2>
          <div className="input-wrapper-col">
            <label htmlFor="cedula">
              <strong>Cédula:</strong>
            </label>
            <div className="input-wrapper-row">
              <input
                type="text"
                name="cedula"
                id="cedula"
                onChange={(e) => handleChange(e.target)}
                value={input.cedula}
              />
              <button className="btn btn-primary-lined-fit" type="button" onClick={buscarPorCI}>
                Buscar
              </button>
            </div>
            <span className="small error">{error.cedula ? error.cedula : '\u00A0'}</span>
          </div>
          <div className="input-wrapper-row">
            <div className="input-wrapper-col">
              <FormInput
                label={'Nombre:'}
                attributes={{
                  type: 'text',
                  name: 'nombre',
                  id: 'nombre',
                  value: input.nombre,
                }}
                errorMsg={error.nombre}
                onChange={(e) => handleChange(e.target)}
              />
            </div>
            <div className="input-wrapper-col">
              <FormInput
                label={'Apellido:'}
                attributes={{
                  type: 'text',
                  name: 'apellido',
                  id: 'apellido',
                  value: input.apellido,
                }}
                errorMsg={error.apellido}
                onChange={(e) => handleChange(e.target)}
              />
            </div>
            <div className="input-wrapper-col">
              <FormInput
                label={'Correo:'}
                attributes={{
                  type: 'text',
                  name: 'correo',
                  id: 'correo',
                  value: input.correo,
                }}
                errorMsg={error.correo}
                onChange={(e) => handleChange(e.target)}
              />
            </div>
            <div className="input-wrapper-col">
              <label htmlFor="estado">
                <strong>Estado:</strong>
              </label>
              <select name="estado" id="estado" onChange={(e) => handleChange(e.target)} value={input.estado}>
                <option value="0">Seleccione una opción</option>
                {['ACTIVO', 'JUBILADO', 'SOBREVIVIENTE'].map((estado, i) => (
                  <option key={i} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              <span className="small error">{error.estado ? error.estado : '\u00A0'}</span>
            </div>
          </div>
          <div className="input-wrapper-row">
            {input.estado === 'ACTIVO' ? (
              <div className="input-wrapper-col">
                <FormInput
                  label={'Indicador:'}
                  attributes={{
                    type: 'text',
                    name: 'indicador',
                    id: 'indicador',
                    value: input.indicador,
                  }}
                  errorMsg={error.indicador}
                  onChange={(e) => handleChange(e.target)}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={`section ${ubicacion} `}>
          <h2>Ubicación CAIT/CAIJ</h2>
          <div className="input-wrapper-col">
            <FormSelect
              label={'Zona:'}
              attributes={{
                name: 'zona',
                id: 'zona',
                value: input.zona,
              }}
              url={'/api/zonas?activo=true'}
              errorMsg={error.zona}
              onChange={(e) => handleChange(e.target)}
            />
          </div>
          <div className="input-wrapper-col">
            <FormSelect
              label={'Área:'}
              attributes={{
                name: 'area',
                id: 'area',
                value: input.area,
              }}
              url={input.zona !== '0' ? `/api/zonas/${input.zona}/areas?activo=true` : ''}
              errorMsg={error.area}
              onChange={(e) => handleChange(e.target)}
            />
          </div>
          <div className="input-wrapper-col">
            <FormSelect
              label={'Localidad:'}
              attributes={{
                name: 'localidad',
                id: 'localidad',
                value: input.localidad,
              }}
              url={input.area !== '0' ? `/api/areas/${input.area}/localidades?activo=true` : ''}
              errorMsg={error.localidad}
              onChange={(e) => handleChange(e.target)}
            />
          </div>
          <div className="input-wrapper-col">
            <FormSelect
              label={'Unidad de Atención:'}
              attributes={{
                name: 'uaId',
                id: 'uaId',
                value: input.uaId,
              }}
              url={input.localidad !== '0' ? `/api/localidades/${input.localidad}/unidades-atencion?activo=true` : ''}
              errorMsg={error.uaId}
              onChange={(e) => handleChange(e.target)}
            />
          </div>
        </div>
        <div className={botones}>
          <button className="btn btn-neutral-lined" type="reset" onClick={stateReset}>
            Cancelar
          </button>
          <button className="btn btn-secondary-full" type="submit">
            Asignar
          </button>
        </div>
      </div>
    </form>
  );
};

export default AsignarAnalista;
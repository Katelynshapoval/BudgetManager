import "./Presupuesto.css";
import Accordion from "../../components/Accordion/Accordion";
import { useState } from "react";
import { RiEditLine } from "react-icons/ri";

function Presupuesto() {
  return (
    <div className="presupuesto">
      <div className="mainPanel">
        <h1>Panel de Presupuestos</h1>
        <div className="accordions">
          <Accordion title={"Presupuestos"}>
            <div className="tableParent">
              <div className="filter">
                <label htmlFor="departamento" className="lightText">
                  Filtrar por departamento:
                </label>
                <select id="departamento">
                  <option value="">Todos</option>
                  <option>Recursos Humanos</option>
                  <option>Tecnología</option>
                  <option>Operaciones</option>
                  <option>Marketing</option>
                </select>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Asignado</th>
                    <th>Gastado</th>
                    <th>Disponible</th>
                    <th className="actionCell">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Recursos Humanos</td>
                    <td>$2,500,000.00</td>
                    <td>$1,875,000.00</td>
                    <td>$625,000.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                  <tr>
                    <td>Tecnología</td>
                    <td>$2,300,000.00</td>
                    <td>$2,200,000.00</td>
                    <td>$100,000.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                  <tr>
                    <td>Operaciones</td>
                    <td>$2,100,000.00</td>
                    <td>$2,100,000.00</td>
                    <td>$0.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>$1,950,000.00</td>
                    <td>$1,950,000.00</td>
                    <td>$0.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion>
          <Accordion title={"Plan de Inversión"}>
            <div className="tableParent">
              <div className="filter">
                <label htmlFor="departamento">Filtrar por departamento:</label>
                <select id="departamento">
                  <option value="">Todos</option>
                  <option>Recursos Humanos</option>
                  <option>Tecnología</option>
                  <option>Operaciones</option>
                  <option>Marketing</option>
                </select>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Asignado</th>
                    <th>Gastado</th>
                    <th>Disponible</th>
                    <th className="actionCell">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Tecnología</td>
                    <td>$300,000.00</td>
                    <td>$200,000.00</td>
                    <td>$100,000.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                  <tr>
                    <td>Operaciones</td>
                    <td>$2,100,000.00</td>
                    <td>$2,100,000.00</td>
                    <td>$0.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>$1,950,000.00</td>
                    <td>$1,950,000.00</td>
                    <td>$0.00</td>
                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default Presupuesto;

import "./Proveedores.css";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";

function Proveedor() {
  return (
    <div className="page proveedores">
      <h1>Panel de Proveedores</h1>
      <div className="buttonsProveedores">
        <div className="searchByName">
          <CiSearch className="search-icon iconProveedores" />
          <input type="text" placeholder="Buscar por nombre" />
        </div>
        <button className="nuevoProveedor">
          <IoAddOutline className="iconProveedores" />
          Nuevo proveedor
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th className="actionCell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sistemas Corporativos S.A.</td>
            <td>contacto@sistemascorp.com</td>
            <td>+52 55 1234 5678</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Tech Solutions México</td>
            <td>ventas@techsolutions.mx</td>
            <td>+52 55 8765 4321</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Oficina Global</td>
            <td>info@oficinaglobal.com</td>
            <td>+52 55 2468 1357</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Servicios Integrales Pro</td>
            <td>servicios@integralespro.mx</td>
            <td>+52 55 9876 5432</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Distribuidora Nacional</td>
            <td>admin@distribuidoranacional.com</td>
            <td>+52 55 3691 2580</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Consultoría Empresarial</td>
            <td>contacto@consultoriaempresarial.mx</td>
            <td>+52 55 7531 9514</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Suministros Industriales</td>
            <td>ventas@suministrosindustriales.com</td>
            <td>+52 55 1592 7538</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
          <tr>
            <td>Tecnología Avanzada</td>
            <td>info@tecavanzada.mx</td>
            <td>+52 55 9517 5362</td>
            <td className="actionCell">
              <RiEditLine className="tableActionIcon" />
              <MdDeleteOutline className="tableActionIcon" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Proveedor;

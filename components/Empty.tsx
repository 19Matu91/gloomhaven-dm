import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Empty = () => {
  return (
    <div className="empty">
      <FontAwesomeIcon icon={faBan} height="48px" />
      <div>Sin Resultados</div>
      <div>Revisa los Ajustes o cambia los filtros de búsqueda</div>
    </div>
  );
};

export default Empty;

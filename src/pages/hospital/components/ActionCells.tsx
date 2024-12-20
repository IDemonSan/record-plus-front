import { State } from "@/constants/state";
import { HospitalListDTO } from "../types/HospitalListDTO";
import { Tooltip } from "@nextui-org/react";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";

interface ActionsCellProps {
  hospital: HospitalListDTO;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsCell({ hospital, onEdit, onDelete }: ActionsCellProps) {
  const isInactive =
    hospital.state.includes(State.INACTIVO) ||
    hospital.state.includes(State.ELIMINADO);

  return (
    <div className="relative flex items-center justify-center w-full gap-2">
      <Tooltip content="Editar hospital">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onEdit}
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Tooltip content="Eliminar hospital">
        <span
          className={`text-lg transition-all duration-200 ${
            isInactive
              ? "text-danger/40 pointer-events-none cursor-not-allowed opacity-70"
              : "text-danger cursor-pointer active:opacity-50 hover:opacity-80"
          }`}
          onClick={isInactive ? undefined : onDelete}
        >
          <DeleteIcon />
        </span>
      </Tooltip>
    </div>
  );
}

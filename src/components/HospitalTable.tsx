import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  getKeyValue,
  Pagination as TablePagination,
} from "@nextui-org/react";
import { statusColorMap } from "@/constants/statusColorMap";
import { EyeIcon } from "@/icons/EyeIcon";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { useHospitalContext } from "@/contexts/hospital/hospitalContext";
import { ModalConfirmDelete } from "./ModalConfirmDelete";
import { useNavigate } from "react-router-dom";

export function HospitalTable() {
  const navigate = useNavigate();

  const {
    hospitals,
    error,
    setPage,
    currentPage,
    totalPages,
    isDeleting,
    isModalOpen,
    closeModal,
    handleDeleteClick,
    handleConfirmDelete,
  } = useHospitalContext();

  const handleEdit = React.useCallback(
    (id: number) => {
      navigate(`/hospital/${id}/edit`);
    },
    [navigate]
  );

  const renderCell = React.useCallback(
    (hospital: Hospital, columnKey: React.Key) => {
      const cellValue = hospital[columnKey as keyof Hospital];

      switch (columnKey) {
        case "state":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[hospital.state]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center w-full gap-2">
              <Tooltip content="Ver detalles">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Editar hospital">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleEdit(hospital.id)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip content="Eliminar hospital">
                <span
                  className={`text-lg text-danger cursor-pointer active:opacity-50 ${
                    isDeleting ? "opacity-50" : ""
                  }`}
                  onClick={() => !isDeleting && handleDeleteClick(hospital.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return getKeyValue(hospital, columnKey as string);
      }
    },
    [handleEdit, handleDeleteClick, isDeleting]
  );

  const columns = [
    { name: "Nombre", uuid: "name" },
    { name: "Teléfono", uuid: "phone" },
    { name: "Correo electrónico", uuid: "email" },
    { name: "RUC", uuid: "ruc" },
    { name: "Estado", uuid: "state" },
    { name: "Acciones", uuid: "actions" },
  ];

  type Hospital = (typeof hospitals)[0];

  return (
    <>
      <Table
        aria-label="Tabla de hospitales"
        bottomContent={
          !error &&
          hospitals.length > 0 && (
            <div className="flex w-full justify-start">
              <TablePagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={currentPage + 1}
                total={totalPages}
                onChange={(page) => setPage(page - 1)}
              />
            </div>
          )
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uuid}
              align={column.uuid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={error ? [] : hospitals}
          emptyContent={
            error
              ? "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde."
              : "No se encontraron resultados..."
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalConfirmDelete
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Eliminar Hospital"
        message="¿Está seguro que desea eliminar este hospital? Esta acción no se puede deshacer."
      />
    </>
  );
}

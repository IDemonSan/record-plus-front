import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useHospitalContext } from "@/contexts/hospital/hospitalContext";
import { useStates } from "@/hooks/state/useState";

export function HospitalEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    getHospital,
    hospitalDetail,
    loadingDetail,
    detailError,
    updateHospital,
    isUpdating,
  } = useHospitalContext();

  const { state } = useStates();
  const [stateValue, setStateValue] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!id || isInitialized) return;

    const hospitalId = parseInt(id);
    if (isNaN(hospitalId)) return;

    getHospital(hospitalId)
      .then((hospital) => {
        if (hospital) {
          setStateValue(hospital.stateId.toString());
          setIsInitialized(true);
        }
      })
      .catch(console.error);
  }, [id, getHospital, isInitialized]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const formData = new FormData(event.currentTarget);
    const hospitalData = {
      name: formData.get("name") as string,
      ruc: formData.get("ruc") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      stateId: parseInt(stateValue),
    };

    try {
      await updateHospital(parseInt(id), hospitalData);
      navigate(-1);
    } catch (error) {
      console.error("Error updating hospital:", error);
    }
  };

  if (loadingDetail) return <div>Cargando...</div>;
  if (detailError) return <div>Error: {detailError}</div>;
  if (!hospitalDetail) return <div>No se encontró el hospital</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editar Hospital</h1>
        <Button color="danger" variant="light" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>

      <Form
        method="post"
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <Input
          type="text"
          name="name"
          label="Nombre del Hospital"
          placeholder="Ingrese el nombre"
          defaultValue={hospitalDetail.name}
          isRequired
        />

        <Input
          type="text"
          name="ruc"
          label="RUC"
          placeholder="Ingrese el RUC"
          defaultValue={hospitalDetail.ruc}
          isRequired
        />

        <Input
          type="email"
          name="email"
          label="Correo electrónico"
          placeholder="Ingrese el correo"
          defaultValue={hospitalDetail.email}
          isRequired
        />

        <Input
          type="tel"
          name="phone"
          label="Teléfono"
          placeholder="Ingrese el teléfono"
          defaultValue={hospitalDetail.phone}
          isRequired
        />

        <Input
          type="text"
          name="address"
          label="Dirección"
          placeholder="Ingrese la dirección"
          defaultValue={hospitalDetail.address}
          isRequired
        />

        <Select
          label="Estados"
          selectedKeys={stateValue ? [stateValue] : []}
          onSelectionChange={(keys) =>
            setStateValue(Array.from(keys)[0] as string)
          }
        >
          {state.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.name}
            </SelectItem>
          ))}
        </Select>

        <div className="col-span-2 flex justify-end gap-2">
          <Button type="submit" color="primary" isLoading={isUpdating}>
            Actualizar
          </Button>
        </div>
      </Form>
    </div>
  );
}
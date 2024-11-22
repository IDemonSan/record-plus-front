import { HospitalCreateValues } from "../models/hospitalCreateSchema";
import { HospitalCreateRequest } from "../types/HospitalCreateRequest";

export const toHospitalCreateRequest = (
  values: HospitalCreateValues
): HospitalCreateRequest => ({
  name: values.name,
  address: values.address,
  phone: values.phone,
  email: values.email,
  ruc: values.ruc,
  stateId: values.stateId,
});
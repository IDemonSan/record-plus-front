import { useState, useEffect, useCallback } from "react";
import {
  createHospital,
  deleteHospital,
  getHospital,
  getHospitals,
  updateHospital,
} from "@/services/hospitalService";
import { HospitalListDTO } from "@/types/DTO/hospital/HospitalListDTO";
import { HospitalCreateRequest } from "@/types/DTO/hospital/HospitalCreateRequest";
import { useDebounce } from "../useDebounce";

// Types
interface HospitalState {
  data: HospitalListDTO[];
  detail: HospitalCreateRequest | null;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  status: {
    loading: boolean;
    loadingDetail: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
  };
  errors: {
    main: string | null;
    detail: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
}

const initialState: HospitalState = {
  data: [],
  detail: null,
  pagination: {
    page: 0,
    pageSize: 20,
    totalPages: 0,
  },
  status: {
    loading: false,
    loadingDetail: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
  errors: {
    main: null,
    detail: null,
    create: null,
    update: null,
    delete: null,
  },
};

export const useHospitals = () => {
  const [state, setState] = useState<HospitalState>(initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Función auxiliar para actualizar el estado
  const updateState = (newState: Partial<HospitalState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // Función auxiliar para manejar errores
  const handleError = (
    type: keyof HospitalState["errors"],
    message: string
  ) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [type]: message },
      status: {
        ...prev.status,
        [`is${type.charAt(0).toUpperCase() + type.slice(1)}ing`]: false,
      },
    }));
  };

  const fetchHospitals = useCallback(
    async (page: number) => {
      try {
        updateState({
          status: { ...state.status, loading: true },
          errors: { ...state.errors, main: null },
        });

        const response = await getHospitals({
          pageNumber: page,
          pageSize: state.pagination.pageSize,
          name: debouncedSearch || undefined,
          ruc: debouncedSearch || undefined,
        });

        updateState({
          data: response.content,
          pagination: {
            ...state.pagination,
            totalPages: response.totalPages,
          },
          status: { ...state.status, loading: false },
        });
      } catch (error) {
        handleError("main", "Error al cargar hospitales");
        console.error(error);
      }
    },
    [debouncedSearch, state.errors, state.pagination, state.status]
  );

  // Efecto para búsqueda y paginación
  useEffect(() => {
    if (debouncedSearch && state.pagination.page !== 0) {
      updateState({ pagination: { ...state.pagination, page: 0 } });
      return;
    }
    fetchHospitals(state.pagination.page);
  }, [debouncedSearch, state.pagination, fetchHospitals]);

  // Operaciones CRUD simplificadas
  const crud = {
    create: async (data: HospitalCreateRequest) => {
      try {
        updateState({ status: { ...state.status, isCreating: true } });
        const result = await createHospital(data);
        await fetchHospitals(0);
        updateState({ pagination: { ...state.pagination, page: 0 } });
        return result;
      } catch (error) {
        handleError("create", "Error al crear el hospital");
        throw error;
      }
    },

    read: async (id: number) => {
      try {
        updateState({ status: { ...state.status, loadingDetail: true } });
        const data = await getHospital(id);
        updateState({ detail: data });
        return data;
      } catch (error) {
        handleError("detail", "Error al obtener el hospital");
        throw error;
      }
    },

    update: async (id: number, data: HospitalCreateRequest) => {
      try {
        updateState({ status: { ...state.status, isUpdating: true } });
        const result = await updateHospital(id, data);
        await fetchHospitals(state.pagination.page);
        return result;
      } catch (error) {
        handleError("update", "Error al actualizar el hospital");
        throw error;
      }
    },

    delete: async (id: number) => {
      try {
        updateState({ status: { ...state.status, isDeleting: true } });
        await deleteHospital(id);
        await fetchHospitals(0);
        updateState({ pagination: { ...state.pagination, page: 0 } });
        return true;
      } catch {
        handleError("delete", "Error al eliminar el hospital");
        return false;
      }
    },
  };

  return {
    // Data
    hospitals: state.data,
    hospitalDetail: state.detail,

    // Pagination
    currentPage: state.pagination.page,
    totalPages: state.pagination.totalPages,
    setPage: (page: number) =>
      updateState({ pagination: { ...state.pagination, page } }),
    setPageSize: (pageSize: number) =>
      updateState({ pagination: { ...state.pagination, pageSize } }),

    // Search
    setSearchQuery,

    // Status
    loading: state.status.loading,
    loadingDetail: state.status.loadingDetail,
    isCreating: state.status.isCreating,
    isUpdating: state.status.isUpdating,
    isDeleting: state.status.isDeleting,

    // Errors
    error: state.errors.main,
    detailError: state.errors.detail,
    createError: state.errors.create,
    updateError: state.errors.update,
    deleteError: state.errors.delete,

    // CRUD operations
    createHospital: crud.create,
    getHospital: crud.read,
    updateHospital: crud.update,
    deleteHospital: crud.delete,
  } as const;
};

import { create } from "zustand";

import { useRequestService as service, type NewRequest, type Request } from "@/services/useRequestService";
interface Store {
    requests: Request[];
    loading: boolean;
    error: string | undefined;

    getRequests: () => Promise<void>;
    createRequest: (payload: NewRequest) => Promise<void>;
    updateRequest: (id: number, updated: Partial<Request>) => Promise<void>;
    // deleteRequest: (id: number) => Promise<void>;
}

const useRequestStore = create<Store>((set) => {
    const requests: Request[] = [];
    const loading: boolean = false;
    const error: string | undefined = undefined;
    const getRequests = async () => {
        try {
            set({ loading: true });
            const requests = await service.getRequests();
            set({ requests });
        } catch (error) {
            console.error("Error fetching requests:", error);
            set({ error: error as string });
        } finally {
            set({ loading: false });
        }
    }
    const createRequest = async (request: NewRequest) => {
        try {
            set({ loading: true });
            const newRequest = await service.createRequest(request);
            set((state) => ({ requests: [newRequest, ...state.requests] }));
        } catch (error) {
            console.error("Error creating request:", error);
            set({ error: error as string });
        } finally {
            set({ loading: false });
        }
    }
    const updateRequest = async (id: number, updated: Partial<Request>) => {
        try {
            set({ loading: true });
            await service.updateRequest(id, updated);
            set((state) => ({
                requests: state.requests.map((request) =>
                    request.id === id ? { ...request, ...updated } : request,
                ),
            }));
        } catch (error) {
            console.error("Error updating request:", error);
            set({ error: error as string });
        } finally {
            set({ loading: false });
        }
    }
/*
    const deleteRequest = async (id: number) => {
        try {
            set({ loading: true });
            await service.deleteRequest(id);
            set((state) => ({
                requests: state.requests.filter((request) => request.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting request:", error);
            set({ error: error as string });
        } finally {
            set({ loading: false });
        }
    }

    */
    
    return {
        requests,
        loading,
        error,
        getRequests,
        createRequest,
        updateRequest,
        // deleteRequest,
    };

})

export default useRequestStore;
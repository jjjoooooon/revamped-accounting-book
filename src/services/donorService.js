import { toast } from "sonner";

export const donorService = {
    getAll: async (search = "") => {
        try {
            const res = await fetch(`/api/donors?search=${search}`);
            if (!res.ok) throw new Error("Failed to fetch donors");
            return await res.json();
        } catch (error) {
            console.error("Error fetching donors:", error);
            toast.error("Failed to load donors");
            return [];
        }
    },

    getById: async (id) => {
        try {
            const res = await fetch(`/api/donors/${id}`);
            if (!res.ok) throw new Error("Failed to fetch donor");
            return await res.json();
        } catch (error) {
            console.error("Error fetching donor:", error);
            toast.error("Failed to load donor details");
            return null;
        }
    },

    create: async (data) => {
        try {
            const res = await fetch("/api/donors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create donor");
            }
            return await res.json();
        } catch (error) {
            console.error("Error creating donor:", error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const res = await fetch(`/api/donors/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update donor");
            }
            return await res.json();
        } catch (error) {
            console.error("Error updating donor:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const res = await fetch(`/api/donors/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete donor");
            }
            return true;
        } catch (error) {
            console.error("Error deleting donor:", error);
            throw error;
        }
    },
};

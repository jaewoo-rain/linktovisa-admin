import axios from "axios";

export type Role = "employer" | "seeker";

export type ListResponse = {
    success: boolean;
    role: Role;
    page: number;
    limit: number;
    total: number;
    items: any[];
};

export type DetailResponse = {
    success: boolean;
    item: any;
};

export async function fetchConsultationList(params: {
    role: Role;
    page?: number;
    limit?: number;
    q?: string;
}) {
    const { role, page = 1, limit = 50, q = "" } = params;
    const res = await axios.get<ListResponse>("/api/consultation/list", {
        params: { role, page, limit, q },
    });
    return res.data;
}

export async function fetchConsultationDetail(params: { role: Role; id: string }) {
    const res = await axios.get<DetailResponse>("/api/consultation/detail", {
        params,
    });
    return res.data;
}

export async function deleteConsultation(params: { role: Role; id: string }) {
    const res = await axios.delete<{ success: boolean; deletedId?: string }>(
        "/api/consultation/delete",
        { params }
    );
    return res.data;
}
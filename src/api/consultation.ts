// src/api/consultation.ts
import axios from "axios";

export function submitConsultation(data: any) {
    return axios.post("/api/consultation", data);
}

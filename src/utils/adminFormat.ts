export function formatDate(d: any) {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleString();
}

export function joinPhone(parts: any[]) {
    return parts.filter(Boolean).join("-") || "-";
}

export function safe(v: any) {
    if (v === null || v === undefined) return "";
    return String(v);
}

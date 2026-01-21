import { Role } from "../../api/adminConsultation";
import AdminRoleTabs from "./AdminRoleTabs";
import AdminSearchBar from "./AdminSearchBar";

export default function AdminHeader({
    role,
    total,
    onRoleChange,
    onSearch,
}: {
    role: Role;
    total: number;
    onRoleChange: (role: Role) => void;
    onSearch: (q: string) => void;
}) {
    const title = role === "employer" ? "구인자(Employer)" : "구직자(Seeker)";

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-2xl font-extrabold">Admin</h1>
                <p className="text-gray-600 mt-1">
                    {title} 신청 내역 ({total.toLocaleString()}건)
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <AdminRoleTabs role={role} onChange={onRoleChange} />
                <AdminSearchBar onSearch={onSearch} />
            </div>
        </div>
    );
}

import { Role } from "../../api/adminConsultation";

export default function AdminRoleTabs({
    role,
    onChange,
}: {
    role: Role;
    onChange: (role: Role) => void;
}) {
    return (
        <div className="inline-flex rounded-xl bg-white border p-1">
            <button
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${role === "employer" ? "bg-gray-900 text-white" : "text-gray-700"
                    }`}
                onClick={() => onChange("employer")}
            >
                Employer
            </button>
            <button
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${role === "seeker" ? "bg-gray-900 text-white" : "text-gray-700"
                    }`}
                onClick={() => onChange("seeker")}
            >
                Seeker
            </button>
        </div>
    );
}

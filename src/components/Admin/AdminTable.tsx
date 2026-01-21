import { Role } from "../../api/adminConsultation";
import { formatDate, joinPhone, safe } from "../../utils/adminFormat";

type Column = { key: string; label: string };

export default function AdminTable({
    role,
    items,
    loading,
    selectedId,
    onSelect,
}: {
    role: Role;
    items: any[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (id: string) => void;
}) {
    const columns: Column[] =
        role === "employer"
            ? [
                { key: "company", label: "회사명" },
                { key: "manager", label: "담당자" },
                { key: "email", label: "이메일" },
                { key: "phone", label: "연락처" },
                { key: "createdAt", label: "신청일" },
            ]
            : [
                { key: "name", label: "이름" },
                { key: "country", label: "국적" },
                { key: "lang", label: "상담언어" },
                { key: "channel", label: "채널" },
                { key: "createdAt", label: "신청일" },
            ];

    function mapRow(it: any) {
        if (role === "employer") {
            const email =
                safe(it?.basicInfo?.managerEmailId) && safe(it?.basicInfo?.managerEmailDomain)
                    ? `${it.basicInfo.managerEmailId}@${it.basicInfo.managerEmailDomain}`
                    : "";

            return {
                company: safe(it?.basicInfo?.companyName) || "-",
                manager: safe(it?.basicInfo?.managerName) || "-",
                email: email || "-",
                phone: joinPhone([it?.basicInfo?.phone1, it?.basicInfo?.phone2, it?.basicInfo?.phone3]),
                createdAt: formatDate(it?.createdAt),
            };
        }

        return {
            name: safe(it?.basicInfo?.name) || "-",
            country: safe(it?.consultation?.country?.label) || "-",
            lang: safe(it?.consultation?.lang?.label) || "-",
            channel: safe(it?.consultation?.channel) || "-",
            createdAt: formatDate(it?.createdAt),
        };
    }

    return (
        <div className="overflow-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                                {c.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                                로딩중...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                                데이터 없음
                            </td>
                        </tr>
                    ) : (
                        items.map((it) => {
                            const isSelected = selectedId === it._id;
                            const row = mapRow(it);

                            return (
                                <tr
                                    key={it._id}
                                    className={`border-t cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-100" : ""
                                        }`}
                                    onClick={() => onSelect(it._id)}
                                >
                                    {columns.map((c) => (
                                        <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                                            {row[c.key as keyof typeof row] || "-"}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

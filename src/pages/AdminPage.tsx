import { useEffect, useState } from "react";
import { fetchConsultationDetail, fetchConsultationList, Role } from "../api/adminConsultation";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminPagination from "../components/Admin/AdminPagination";
import AdminTable from "../components/Admin/AdminTable";
import AdminDetailPanel from "../components/Admin/AdminDetailPanel";

const ADMIN_PASSWORD = "2026";

export default function AdminPage() {
    /** 🔐 인증 여부 */
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");

    /** 기존 상태들 */
    const [role, setRole] = useState<Role>("employer");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const limit = 50;

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<any | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    /** 🔐 비밀번호 확인 */
    const handlePasswordSubmit = () => {
        if (password === ADMIN_PASSWORD) {
            setAuthorized(true);
        } else {
            alert("비밀번호가 틀렸습니다");
            setPassword("");
        }
    };

    /** 🔒 인증 안되었으면 비밀번호 화면만 보여줌 */
    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
                    <h1 className="text-2xl font-bold text-center">관리자 접근</h1>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                        placeholder="비밀번호 입력"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={handlePasswordSubmit}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        들어가기
                    </button>
                </div>
            </div>
        );
    }

    /** ================= 기존 로직 ================= */

    const loadList = async (opts?: { q?: string; page?: number; role?: Role }) => {
        setLoading(true);
        try {
            const nextRole = opts?.role ?? role;
            const nextPage = opts?.page ?? page;
            const nextQ = opts?.q ?? q;

            const data = await fetchConsultationList({
                role: nextRole,
                page: nextPage,
                limit,
                q: nextQ,
            });

            setItems(data.items || []);
            setTotal(data.total || 0);
        } catch (e) {
            console.error(e);
            alert("목록 조회 실패");
        } finally {
            setLoading(false);
        }
    };

    const loadDetail = async (id: string) => {
        setSelectedId(id);
        setDetailLoading(true);
        try {
            const data = await fetchConsultationDetail({ role, id });
            setDetail(data.item);
        } catch (e) {
            console.error(e);
            alert("상세 조회 실패");
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        loadList();
        setSelectedId(null);
        setDetail(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, page]);

    const handleRoleChange = (r: Role) => {
        setRole(r);
        setPage(1);
    };

    const handleSearch = async (query: string) => {
        setQ(query);
        setPage(1);
        await loadList({ q: query, page: 1 });
        setSelectedId(null);
        setDetail(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6 space-y-4">
                <AdminHeader
                    role={role}
                    total={total}
                    onRoleChange={handleRoleChange}
                    onSearch={handleSearch}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* List */}
                    <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm overflow-hidden">
                        <AdminPagination
                            page={page}
                            total={total}
                            limit={limit}
                            loading={loading}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() => setPage((p) => p + 1)}
                        />

                        <AdminTable
                            role={role}
                            items={items}
                            loading={loading}
                            selectedId={selectedId}
                            onSelect={loadDetail}
                        />
                    </div>

                    {/* Detail */}
                    <AdminDetailPanel
                        role={role}
                        selectedId={selectedId}
                        loading={detailLoading}
                        detail={detail}
                    />
                </div>
            </div>
        </div>
    );
}

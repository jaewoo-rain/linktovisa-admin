// 파일: src/components/Admin/AdminDetailPanel.tsx
import { Role } from "../../api/adminConsultation";
import { formatDate, joinPhone } from "../../utils/adminFormat";

type Props = {
    role: Role;
    selectedId: string | null;
    loading: boolean;
    detail: any | null;

    // ✅ 삭제 기능 추가
    onDelete: (id: string) => void;
    deleting: boolean;
};

export default function AdminDetailPanel({
    role,
    selectedId,
    loading,
    detail,
    onDelete,
    deleting,
}: Props) {
    return (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="px-4 py-3 border-b flex items-start justify-between gap-3">
                <div>
                    <div className="font-bold">상세</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {selectedId ? `ID: ${selectedId}` : "목록에서 한 항목을 선택하세요"}
                    </div>
                </div>

                {/* ✅ 삭제 버튼 */}
                <button
                    className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-40"
                    disabled={!selectedId || loading || deleting}
                    onClick={() => selectedId && onDelete(selectedId)}
                >
                    {deleting ? "삭제 중..." : "삭제"}
                </button>
            </div>

            {/* 본문 */}
            <div className="p-4">
                {loading ? (
                    <div className="text-gray-500">불러오는 중...</div>
                ) : !detail ? (
                    <div className="text-gray-500">선택된 항목 없음</div>
                ) : (
                    <div className="space-y-4">
                        {role === "employer" ? (
                            <div className="space-y-4">
                                {/* Basic */}
                                <div className="space-y-2">
                                    <div className="text-lg font-extrabold">
                                        {detail?.basicInfo?.companyName || "-"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        대표: {detail?.basicInfo?.ceoName || "-"} / 사업자번호:{" "}
                                        {detail?.basicInfo?.bizRegNumber || "-"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        담당자: {detail?.basicInfo?.managerName || "-"} /{" "}
                                        {detail?.basicInfo?.managerEmailId &&
                                            detail?.basicInfo?.managerEmailDomain
                                            ? `${detail.basicInfo.managerEmailId}@${detail.basicInfo.managerEmailDomain}`
                                            : "-"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        연락처:{" "}
                                        {joinPhone([
                                            detail?.basicInfo?.phone1,
                                            detail?.basicInfo?.phone2,
                                            detail?.basicInfo?.phone3,
                                        ])}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        신청일: {formatDate(detail?.createdAt)}
                                    </div>
                                </div>

                                {/* Conditions */}
                                <div className="pt-3 border-t">
                                    <div className="font-bold mb-2">근무 조건</div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <div>담당 업무: {detail?.conditions?.task || "-"}</div>
                                        <div>
                                            근무 요일:{" "}
                                            {(detail?.conditions?.workDays || []).join(", ") || "-"}
                                        </div>
                                        <div>
                                            근무 시간: {detail?.conditions?.startTime || "-"} ~{" "}
                                            {detail?.conditions?.endTime || "-"}
                                        </div>
                                        <div>
                                            근무 형태:{" "}
                                            {(detail?.conditions?.jobTypes || []).join(", ") || "-"}
                                        </div>
                                        <div>급여(원): {detail?.conditions?.salaryRaw || "-"}</div>
                                    </div>
                                </div>

                                {/* Additional */}
                                <div className="pt-3 border-t">
                                    <div className="font-bold mb-2">추가 정보</div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <div>
                                            경력: {(detail?.additional?.careers || []).join(", ") || "-"}
                                        </div>
                                        <div>
                                            복지/혜택:{" "}
                                            {(detail?.additional?.welfares || []).join(", ") || "-"}
                                        </div>
                                        <div>
                                            한국어 수준:{" "}
                                            {(detail?.additional?.koreanLevels || []).join(", ") || "-"}
                                        </div>
                                        <div>우대조건: {detail?.additional?.preference || "-"}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Basic */}
                                <div className="space-y-2">
                                    <div className="text-lg font-extrabold">
                                        {detail?.basicInfo?.name || "-"}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        생년월일:{" "}
                                        {detail?.basicInfo?.birth
                                            ? `${detail.basicInfo.birth.year}-${detail.basicInfo.birth.month}-${detail.basicInfo.birth.day}`
                                            : "-"}
                                        {" / "}
                                        성별: {detail?.basicInfo?.gender || "-"}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        연락처:{" "}
                                        {detail?.basicInfo?.phone
                                            ? joinPhone([
                                                detail.basicInfo.phone.p1,
                                                detail.basicInfo.phone.p2,
                                                detail.basicInfo.phone.p3,
                                            ])
                                            : "-"}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        신청일: {formatDate(detail?.createdAt)}
                                    </div>
                                </div>

                                {/* Consultation */}
                                <div className="pt-3 border-t">
                                    <div className="font-bold mb-2">상담 정보</div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <div>
                                            국적: {detail?.consultation?.country?.label || "-"}
                                            {detail?.consultation?.country?.value
                                                ? ` (${detail.consultation.country.value})`
                                                : ""}
                                        </div>
                                        <div>
                                            언어: {detail?.consultation?.lang?.label || "-"}
                                            {detail?.consultation?.lang?.value
                                                ? ` (${detail.consultation.lang.value})`
                                                : ""}
                                        </div>
                                        <div>채널: {detail?.consultation?.channel || "-"}</div>
                                        <div className="break-all">
                                            링크: {detail?.consultation?.channelLink || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

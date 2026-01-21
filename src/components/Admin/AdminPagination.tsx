export default function AdminPagination({
    page,
    total,
    limit,
    loading,
    onPrev,
    onNext,
}: {
    page: number;
    total: number;
    limit: number;
    loading: boolean;
    onPrev: () => void;
    onNext: () => void;
}) {
    const maxPage = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">
                페이지 {page} / {maxPage}
            </div>
            <div className="flex gap-2">
                <button
                    className="px-3 py-2 rounded-xl border text-sm disabled:opacity-40"
                    disabled={page <= 1 || loading}
                    onClick={onPrev}
                >
                    이전
                </button>
                <button
                    className="px-3 py-2 rounded-xl border text-sm disabled:opacity-40"
                    disabled={page >= maxPage || loading}
                    onClick={onNext}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

import { useState } from "react";

export default function AdminSearchBar({
    defaultValue = "",
    onSearch,
    placeholder = "검색 (이름/회사/담당자/번호)",
}: {
    defaultValue?: string;
    onSearch: (q: string) => void;
    placeholder?: string;
}) {
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="flex gap-2">
            <input
                className="h-10 w-64 rounded-xl border px-3 bg-white"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch(value);
                }}
            />
            <button
                className="h-10 px-4 rounded-xl bg-gray-900 text-white font-semibold"
                onClick={() => onSearch(value)}
            >
                검색
            </button>
        </div>
    );
}

import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedClient: MongoClient | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) return res.status(500).json({ message: "Missing MONGODB_URI" });

        if (!cachedClient) {
            cachedClient = new MongoClient(uri);
            await cachedClient.connect();
        }

        const db = cachedClient.db();

        const role = (req.query.role as string) || "seeker";
        const collection = role === "employer" ? db.collection("employer") : db.collection("seeker");

        const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt((req.query.limit as string) || "50", 10), 1), 200);
        const skip = (page - 1) * limit;

        const q = ((req.query.q as string) || "").trim();

        // ✅ 간단 검색(없으면 전체)
        const filter =
            q.length > 0
                ? {
                    $or: [
                        { "basicInfo.name": { $regex: q, $options: "i" } }, // seeker
                        { "basicInfo.companyName": { $regex: q, $options: "i" } }, // employer
                        { "basicInfo.ceoName": { $regex: q, $options: "i" } },
                        { "basicInfo.managerName": { $regex: q, $options: "i" } },
                        { "basicInfo.bizRegNumber": { $regex: q, $options: "i" } },
                    ],
                }
                : {};

        const [items, total] = await Promise.all([
            collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
            collection.countDocuments(filter),
        ]);

        // ObjectId 직렬화
        const serialized = items.map((it: any) => ({ ...it, _id: String(it._id) }));

        return res.status(200).json({
            success: true,
            role,
            page,
            limit,
            total,
            items: serialized,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
}

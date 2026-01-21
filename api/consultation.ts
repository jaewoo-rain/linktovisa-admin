// api/consultation.ts
import { MongoClient } from "mongodb";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedClient: MongoClient | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
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

        const { role = "seeker", ...data } = req.body;

        const collection =
            role === "employer" ? db.collection("employer") : db.collection("seeker");

        const result = await collection.insertOne({
            ...data, // role 제외한 데이터만 저장
            // role, // 필요하면 role만 따로 저장
            createdAt: new Date(),
        });

        return res.status(200).json({ success: true, id: result.insertedId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
}

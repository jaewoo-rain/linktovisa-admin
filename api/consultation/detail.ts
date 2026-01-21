import { MongoClient, ObjectId } from "mongodb";
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
        const id = (req.query.id as string) || "";
        if (!id) return res.status(400).json({ message: "Missing id" });

        const collection = role === "employer" ? db.collection("employer") : db.collection("seeker");

        const doc = await collection.findOne({ _id: new ObjectId(id) });
        if (!doc) return res.status(404).json({ message: "Not found" });

        return res.status(200).json({ success: true, item: { ...doc, _id: String(doc._id) } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
}

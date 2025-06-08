// api/water.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("farfit");
  const { fid } = req.query as { fid?: string };

  if (!fid) {
    return res.status(400).json({ error: "Missing fid" });
  }

  switch (req.method) {
    case "GET": {
      const rec = await db.collection("water").findOne({ fid });
      return res.status(200).json({ cups: rec?.cups ?? 0 });
    }

    case "POST": {
      const { cups } = req.body as { cups: number };
      await db
        .collection("water")
        .updateOne(
          { fid },
          { $set: { cups, updatedAt: new Date() } },
          { upsert: true }
        );
      return res.status(200).json({ cups });
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

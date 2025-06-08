// api/foods.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("farfit");
  const { fid, id } = req.query as { fid?: string; id?: string };

  if (!fid) {
    return res.status(400).json({ error: "Missing fid" });
  }

  switch (req.method) {
    case "GET": {
      const foods = await db
        .collection("foods")
        .find({ fid })
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json(foods);
    }

    case "POST": {
      const { name, calories, amount, unit, category, image } = req.body;
      const doc = {
        fid,
        name,
        calories,
        amount,
        unit,
        category,
        image,
        createdAt: new Date(),
      };
      const result = await db.collection("foods").insertOne(doc);
      return res.status(201).json({ ...doc, _id: result.insertedId });
    }

    case "DELETE": {
      if (!id) return res.status(400).json({ error: "Missing id" });
      await db
        .collection("foods")
        .deleteOne({ _id: new ObjectId(id), fid });
      return res.status(200).json({ success: true });
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

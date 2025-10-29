import { NextApiRequest, NextApiResponse } from "next";
import { searchBooks } from "../../../utils/books";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q: query, startIndex = "0" } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const result = await searchBooks(query, parseInt(startIndex as string));
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in books search API:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to search books",
    });
  }
}

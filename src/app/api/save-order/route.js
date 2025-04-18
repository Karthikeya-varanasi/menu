// /app/api/save-order/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dinjitgrid:0XSnlTes5V3oeGAn@dinjitgrid.t8kcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri);

export async function POST(req) {
  const body = await req.json();
  try {
    await client.connect();
    const db = client.db("menuApp");
    const collection = db.collection("orders");
    await collection.insertOne(body);
    return NextResponse.json({ success: true, message: "Order saved!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error saving order." });
  } finally {
    await client.close();
  }
}

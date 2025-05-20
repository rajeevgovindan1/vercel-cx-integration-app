export default async function handler(req, res) {
  console.log("Handling /api/hello");
  res.status(200).json({ message: "Hello from Vercel + OpenTelemetry!" });
}


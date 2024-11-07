import fs from "fs";
import path from "path";

export default function handler({ req, res }: { req: any; res: any }) {
  const { id } = req.query;
  const filePath = path.resolve("path_to_pdfs", `${id}.pdf`); // Replace 'path_to_pdfs' with the actual path to your PDFs

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send("PDF not found");
  }
}

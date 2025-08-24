import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
		cb(null, uploadsDir) // usar ruta absoluta ya creada
    },
    filename:(req,file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

	const fileFilter = (req: any, file:any, cb:any)=>{
		if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
			cb(null, true);
		}else{
			cb(new Error("Solo se permiten archivos de imagen y video"), false);
		}
	}
	const upload = multer({
		storage: storage,
		fileFilter: fileFilter
	});

export const uploadArray = (fieldName: string, maxCount: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        console.error("Error en Multer:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

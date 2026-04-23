import multer from "multer";

// This is where the attachments are stored. ".diskStorage" means store uploaded files on disk (server filesystem).
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This is where to store the uploaded files.
    cb(null, "./frontend/images");
    // The callback format is :- cb(error, destinationPath).
    // cb(null, "./frontend/images") = No error, Save file inside ./frontend/images.
  },
  filename: function (req, file, cb) {
    // This is how file is named.
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
/*
    req - request object
    file - uploaded file info
    cb - callback function
*/

// Create and export upload middleware.
// This is used in routes.
export const upload = multer({
  storage, // Use the diskStorage configuration defined above.
  limits: {
    // This restricts maximum file size.
    fileSize: 1 * 1000 * 1000,
    // 1 * 1000 * 1000 bytes = 1MB
  },
});

/*
Client uploads file
↓
Multer middleware runs
↓
File stored in /frontend/images
↓
File info added to req.file
↓
Controller runs
*/

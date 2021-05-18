import * as mime from "mime-types";
import * as multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname.replace("middleware", "uploads/"));
  },

  filename: function (req: any, file: any, cb: any) {
    cb(
      null,
      `${`tacn${Date.now()}${Math.floor(
        Math.random() * 100 + 1
      )}`}.${mime.extension(file.mimetype)}`
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};

// const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter }).any();

export function uploadMiddleware(check = true, prefix = "tacn") {
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.json({
          status: 1,
          code: 9,
          msg: "File không hợp lệ",
        });
      }
      req.file = req.files.map(
        ({ filename }) =>
          `http://${process.env.HOST}:${process.env.PORT}/${filename}`
      );
      next();
    });
  };
}

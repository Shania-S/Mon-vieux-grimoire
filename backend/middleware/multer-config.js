const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MIME_TYPES = {
  'image/jpg': 'webp',
  'image/jpeg': 'webp',
  'image/png': 'webp',
  'image/webp': 'webp',
  'image/avif': 'webp',
};

//spécifier le dossier de destination où les fichiers uploadés seront enregistrés.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // gère l'upload du fichier image vers le dossier spécifié ('images') avec un nom de fichier unique généré à partir de l'heure actuelle.
  filename: (req, file, callback) => {
    var name = file.originalname.split(' ').join('_');
    name = name.slice(0, name.lastIndexOf('.'));
    console.log('filenamee', name);
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // nom et timestamp pour le rendre unique et l'extension
  },
});

const upload = multer({ storage }).single('image');

const compressImage = async (filePath) => {
  // générer des noms de fichier uniques, ce qui garantit qu'aucun fichier n'est écrasé et que chaque fichier compressé a un nom distinct.
  const finalCompressedPath = filePath.replace(
    /(\.\w+)$/,
    `-${crypto.randomBytes(4).toString('hex')}.webp`
  );
  console.log('Original file path:', filePath);
  console.log('Final compressed file path:', finalCompressedPath);

  try {
    //utilise sharp pour convertir et compresser le fichier en format WebP avec une qualité de 50%.
    //prend en charge la conversion du fichier original en WebP et enregistre le fichier compressé à finalCompressedPath.
    await sharp(filePath).webp({ quality: 50 }).toFile(finalCompressedPath);

    console.log('Fichier compressé enregistré à:', finalCompressedPath);
    return finalCompressedPath;
  } catch (err) {
    console.error('Erreur pendant le sharp:', err);
    throw err; // rethrow the error to be caught in the middleware
  }
};

module.exports = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (!req.file) {
      return next();
    }

    try {
      const compressedFilePath = await compressImage(req.file.path);
      req.file.path = compressedFilePath;
      req.file.filename = path.basename(compressedFilePath);
      next();
    } catch (compressionErr) {
      console.error('Echec de la compression du fichier:', compressionErr);
      return res
        .status(500)
        .send({ error: 'Echec de la compression du fichier' });
    }
  });
};

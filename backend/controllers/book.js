const Book = require('../models/Book');
const fs = require('fs');

// Get all the books in the database
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// See details of a single book
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Get 3 books with the best rating
exports.getThreeBestBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error('Une erreur est survenue:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

// Add a new book
exports.addBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: imageUrl,
    });

    book
      .save()
      .then(() => {
        res.status(201).json({ message: 'Livre enregistré' });
      })
      .catch((error) => {
        res.status(400).json({ error: 'Livre non enregistré' });
      });
  } catch (error) {
    res.status(400).json({ error: 'Format de données invalide' });
  }
};

// Update an existing book
exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };

  delete bookObject._userId;
  // verifier si c bien user a qui appartient cet objet qui cherche a modifier
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Livre modifié' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Delete an existing book
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Rate an existing book
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;

  if (rating >= 0 && rating <= 5) {
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: 'Livre pas trouvé' });
        }

        // Check if the user has already rated the book
        const existingRating = book.ratings.find(
          (r) => r.userId.toString() === userId
        );

        if (existingRating) {
          return res
            .status(400)
            .json({ message: 'Vous avez déjà noté ce livre' });
        }

        const newRating = {
          userId: userId,
          grade: rating,
        };

        // Add the rating
        Book.updateOne(
          { _id: req.params.id },
          { $push: { ratings: newRating } }
        )
          .then(() => {
            // Recalculate average rating
            const totalRatings = book.ratings.length + 1;
            const sumRatings =
              book.ratings.reduce((sum, rating) => sum + rating.grade, 0) +
              rating;
            const averageRating = Math.ceil(sumRatings / totalRatings); // round up

            // Update average rating
            Book.updateOne(
              { _id: req.params.id },
              { $set: { averageRating: averageRating } }
            )
              .then(() => {
                // Fetch the updated book to return it in the response
                Book.findOne({ _id: req.params.id })
                  .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                  })
                  .catch((error) =>
                    res.status(500).json({
                      error: 'Impossible de récupérer le livre modifié',
                    })
                  );
              })
              .catch((error) => res.status(500).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res.status(400).json({ message: 'Note non valide' });
  }
};

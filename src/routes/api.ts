import express from 'express';
import {Author} from "../controller/author";
import {Publisher} from "../controller/publisher";
import {Book} from "../controller/book";
const router = express.Router();

const author = new Author();
const publisher = new Publisher();
const book = new Book();
router.get("/authors", author.getAllAuthors);
router.post("/authors", author.createAuthor);
router.get("/authors/:id", author.getAuthor);
router.patch("/authors/:id", author.updateAuthor);
router.delete("/authors/:id", author.deleteAuthor);
router.get("/publishers", publisher.getAllPublishers);
router.post("/publishers", publisher.createPublisher);
router.get("/publishers/:id", publisher.getPublisher);
router.patch("/publishers/:id", publisher.updatePublisher);
router.delete("/publishers/:id", publisher.deletePublisher);
router.get("/books", book.getAllBooks);
router.post("/books", book.createBook);
router.get("/books/:id", book.getBook);
router.patch("/books/:id", book.updateBook);
router.delete("/books/:id", book.deleteBook);

export = router;

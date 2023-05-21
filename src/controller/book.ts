import { RequestHandler, Router, Request, Response } from 'express';
import * as libraries from '../models/libraries';

interface IBook {
    book_id: number;
    title: string;
    authors?: any;
    publisher?: any;
    introduction?: any;
    read: boolean;
}

export class Book {
    getAllBooks: RequestHandler = async (req, res) => {
        try {
            var allBooks = await libraries.modelBook.find({}, {'create_at':0, 'update_at':0}).populate('publisher');
	    if (allBooks.length < 1) {
                res.status(200).json(allBooks);
	        return;
	    }
            const books: IBook[] = [];
	    for (var i = 0; i < allBooks.length; i++) {

		const book: IBook = {
		    book_id : allBooks[i].book_id,
		    title : allBooks[i].title,
		    introduction : allBooks[i].introduction? allBooks[i].introduction: '',
		    read : allBooks[i].read? allBooks[i].read : false,
		    authors : null,
		    publisher : null
		};
	        	
		if (allBooks[i].authors) {
		    const authors = await libraries.modelAuthor.find(
			    { author_id: {$in: allBooks[i].authors} },
			    { name: 1 }).select('name');
		    if (authors) book.authors = authors.map(item => item.name);
		}
	        
		if (allBooks[i].publisher) {
		    const publisher = await libraries.modelPublisher.findOne({ publisher_id: allBooks[i].publisher }).select('name');
		    if (publisher) book.publisher = publisher.name;
		}
		books.push(book);
	    }
            //res.status(200).json(allBooks);
	    res.status(200).json(books);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    createBook: RequestHandler = async (req, res) => {
	if (!req.body.title) {
	    console.log('title is missing.');
            res.status(500).json(`parameter title is not exist`);
	    return;
	}

        try {
            const data = new libraries.modelBook({
		title: req.body.title,
		authors: [],
		publisher: null,
		introduction: req.body.introduction? req.body.introduction : null,
		read: req.body.read? req.body.read : false
            });
	    const authors: number[] = [];
	    if (req.body.authors) {
	        for (const num of req.body.authors) {
		    const author = await libraries.modelAuthor.findOne({ author_id: num }).select('author_id');
		    if (author) authors.push(num);
		}
                if (authors.length > 0) data.authors = authors;
	    }
	    if (req.body.publisher) {
                const publisher = await libraries.modelPublisher.findOne({ publisher_id: req.body.publisher }).select('publisher_id');
		if (publisher) data.publisher = req.body.publisher;
	    }
            const book = await data.save();
            res.status(200).json(book);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    getBook: RequestHandler = async (req, res) => {
        try {
            const book = await libraries.modelBook.findOne({ book_id: req.params.id });
            if (book === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
		return;
            }
	    const data: IBook = {
		book_id : book.book_id,
		title : book.title,
		introduction : book.introduction? book.introduction: '',
		read : book.read? book.read : false,
		authors : null,
		publisher : null
	    };
	        	
	    if (book.authors) {
	       const authors = await libraries.modelAuthor.find(
			    { author_id: {$in: book.authors} },
			    { name: 1 }).select('name');
	       if (authors) data.authors = authors.map(item => item.name);
	    }
	        
	    if (book.publisher) {
		const publisher = await libraries.modelPublisher.findOne({ publisher_id: book.publisher }).select('name');
		if (publisher) data.publisher = publisher.name;
	    }
            res.status(200).json(data);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    updateBook: RequestHandler = async (req, res) => {
        try {
	    const data = req.body;
            if (req.body.authors) {
		const authors: number[] = [];
                for (const num of req.body.authors) {
		    const author = await libraries.modelAuthor.findOne({ author_id: num }).select('author_id');
		    if (author) authors.push(num);
	        }
                data.authors = authors;
	    }
	    if (req.body.publisher) {
	        const publisher = await libraries.modelPublisher.findOne({ publisher_id: req.body.publisher }).select('publisher_id');
		if (!publisher) data.publisher = null;
	    }
            const book = await libraries.modelBook.findOneAndUpdate({ book_id: req.params.id }, { $set: data }, { new: true });
            if (book === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
		console.log(book);
                res.status(200).json(book);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    deleteBook: RequestHandler = async (req, res) => {
        try {
	    console.log(req.params.id);
            const book = await libraries.modelBook.findOneAndDelete({ book_id: req.params.id });
            if (book === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
                res.status(200).json(book);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };
}

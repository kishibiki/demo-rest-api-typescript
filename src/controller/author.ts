import { RequestHandler, Router, Request, Response } from "express";
import * as libraries from "../models/libraries";

export class Author {
    getAllAuthors: RequestHandler = async (req, res) => {
        try {
            const allAuthors = await libraries.modelAuthor.find({});
            res.status(200).json(allAuthors);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    createAuthor: RequestHandler = async (req, res) => {
	if (!req.body.name) {
	    console.log('name is missing.');
            res.status(500).json(`parameter name is not exist`);
	    return;
	}
        const data = new libraries.modelAuthor({
	    name: req.body.name,
	    gender: req.body.gender　?　req.body.gender　: 1
	});

        try {
            //const author = await libraries.modelAuthor.create(req.body);
            const author = await data.save();
            res.status(200).json(author);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    getAuthor: RequestHandler = async (req, res) => {
        try {
            const author = await libraries.modelAuthor.findOne({ author_id: req.params.id });
            if (author === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            }
            res.status(200).json(author);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    updateAuthor: RequestHandler = async (req, res) => {
	console.log(req.body);
	if (!req.body.name) {
	    console.log('name is missing.');
            res.status(500).json(`parameter name is not exist`);
	    return;
	}
        try {
            const author = await libraries.modelAuthor.findOneAndUpdate({ author_id: req.params.id }, { $set: req.body }, { new: true });
            if (author === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
		console.log(author);
                res.status(200).json(author);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    deleteAuthor: RequestHandler = async (req, res) => {
        try {
	    console.log(req.params.id);
            const author = await libraries.modelAuthor.findOneAndDelete({ author_id: req.params.id });
            if (author === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
                res.status(200).json(author);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };
}

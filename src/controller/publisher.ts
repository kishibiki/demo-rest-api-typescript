import { RequestHandler, Router, Request, Response } from "express";
import * as libraries from "../models/libraries";

export class Publisher {
    getAllPublishers: RequestHandler = async (req, res) => {
        try {
            const allPublishers = await libraries.modelPublisher.find({});
            res.status(200).json(allPublishers);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    createPublisher: RequestHandler = async (req, res) => {
	if (!req.body.name) {
	    console.log('name is missing.');
            res.status(500).json(`parameter name is not exist`);
	    return;
	}
        const data = new libraries.modelPublisher({
	    name: req.body.name,
	});

        try {
            const publisher = await data.save();
            res.status(200).json(publisher);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    getPublisher: RequestHandler = async (req, res) => {
        try {
            const publisher = await libraries.modelPublisher.findOne({ publisher_id: req.params.id });
            if (publisher === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            }
            res.status(200).json(publisher);
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    updatePublisher: RequestHandler = async (req, res) => {
	console.log(req.body);
	if (!req.body.name) {
	    console.log('name is missing.');
            res.status(500).json(`parameter name is not exist`);
	    return;
	}
        try {
            const publisher = await libraries.modelPublisher.findOneAndUpdate({ publisher_id: req.params.id }, { $set: req.body }, { new: true });
            if (publisher === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
		console.log(publisher);
                res.status(200).json(publisher);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };

    deletePublisher: RequestHandler = async (req, res) => {
        try {
	    console.log(req.params.id);
            const publisher = await libraries.modelPublisher.findOneAndDelete({ publisher_id: req.params.id });
            if (publisher === null) {
		console.log(`${req.params.id} is not exist`);
                res.status(500).json(`${req.params.id} is not exist`);
            } else {
                res.status(200).json(publisher);
	    }
        }
        catch (err) {
	    console.log(err);
            res.status(500).json(err);
        }
    };
}

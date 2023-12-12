import {DBType} from "../db/db";
import express, {Response} from "express";
import {RequestWithParams, RequestWithQuery} from "../types";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
export const getInterestingRouter = (db: DBType) => {
    const router = express.Router()

    router.get('/books', (req: RequestWithQuery<QueryCoursesModel>,
                          res) => {

        res.json({title: 'books'})
    })

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                        res) => {
        res.json ({title: 'data by id' + req.params.id})
    })



    return router
}

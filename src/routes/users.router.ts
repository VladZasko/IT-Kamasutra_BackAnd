import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import express, {Response} from "express";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {CourseType, DBType} from "../db/db";
import {HTTP_STATUSES} from "../utils";

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}


export const getUsersRouter = (db: DBType) => {
    const router = express.Router()
    router.get('/', (req: RequestWithQuery<QueryCoursesModel>,
                                   res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;

        if (req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title as string) > -1)
        }


        res.json(foundCourses.map(dbCourse => {
            return{
                id: dbCourse.id,
                title: dbCourse.title
            }
        }))
    })
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                                       res: Response<CourseViewModel>) => {
        const foundCourse= db.courses.find(c => c.id === +req.params.id);

        if(!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json ({
            id: foundCourse.id,
            title: foundCourse.title
        })
    })
    router.post('/', (req: RequestWithBody<CreateCourseModel>,
                                    res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const createdCourse:CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        }

        db.courses.push(createdCourse)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json({
                id: createdCourse.id,
                title: createdCourse.title
            })
    })
    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                                          res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus (HTTP_STATUSES.NO_CONTENT_204)
    })
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
                                       res) => {
        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const foundCourse= db.courses.find(c => c.id === +req.params.id);
        if(!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundCourse.title = req.body.title;

        res.sendStatus (HTTP_STATUSES.NO_CONTENT_204)
    })
    return router
}


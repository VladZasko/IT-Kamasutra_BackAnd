import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import express, {Response} from "express";
import {CourseType, DBType, UserCourseBindingType, UserType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import {UserCourseBindingViewModel} from "./models/UserCourseBindingViewModel";
import {CreateUserCourseBindingModel} from "./models/CreateUserCourseBindingModel";


export const mapEntityToViewModel = (dbEntity: UserCourseBindingType, user: UserType, course: CourseType): UserCourseBindingViewModel => {
    return {
        userId: dbEntity.userId,
        courseId: dbEntity.courseId,
        userName: user.userName,
        courseTitle: course.title,
    }
}


export const getUsersCoursesBindingRouter = (db: DBType) => {
    const router = express.Router()

    router.post('/', (req: RequestWithBody<CreateUserCourseBindingModel>,
                                    res: Response<UserCourseBindingViewModel>) => {

        const user = db.users.find(u => u.id === req.body.userId)
        const course = db.courses.find(u => u.id === req.body.courseId)

        if (!user || !course) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const alreadyExistedBinding = db
            .userCourseBindings
            .find(b => b.userId === user.id && b.courseId === course.id);

        if (alreadyExistedBinding === null) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }


        const createdEntity:UserCourseBindingType = {
            userId: user.id,
            courseId: course.id,
            date: new Date()
        }

        db.userCourseBindings.push(createdEntity)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityToViewModel(createdEntity, user, course))
    })

    return router
}


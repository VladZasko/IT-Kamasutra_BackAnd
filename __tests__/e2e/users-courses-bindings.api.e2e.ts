import request from 'supertest'
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {RouterPaths} from "../../src/routerPaths";
import {usersTestManager} from "./utils/usersTestManager";
import {usersCoursesBindingTestManager} from "./utils/usersCoursesBindingTestManager";
import {
    CreateUserCourseBindingModel
} from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";
import {courseTestManager} from "./utils/cursesTestManager";


const getRequest = () => {
    return request(app)
}
describe('tests for /users-courses-bindings' , () => {
    beforeAll(async() => {
        await request(app).delete(`${RouterPaths.__tests__}/data`)
    })

    it(`should create entity with correct input data`, async () => {
        const createUserResult = await usersTestManager.createUser({userName: 'dimych'});
        const createCourseResult = await courseTestManager.createCourse({title: 'Front-End'});

        const data: CreateUserCourseBindingModel = {
            userId: createUserResult.createdEntity.id,
            courseId: createCourseResult.createdEntity.id
        }

        await usersCoursesBindingTestManager.createBinding(data)

    })

    it(`shouldn't create course binding because courseBinding is already exists`, async () => {
        const createUserResult = await usersTestManager.createUser({userName: 'dimych'});
        const createCourseResult = await courseTestManager.createCourse({title: 'Front-End'});

        const data: CreateUserCourseBindingModel = {
            userId: createUserResult.createdEntity.id,
            courseId: createCourseResult.createdEntity.id
        }

        await usersCoursesBindingTestManager.createBinding(data)
        await usersCoursesBindingTestManager.createBinding(data, HTTP_STATUSES.BAD_REQUEST_400)

    })

    afterAll(done => {
        done()
    })
})
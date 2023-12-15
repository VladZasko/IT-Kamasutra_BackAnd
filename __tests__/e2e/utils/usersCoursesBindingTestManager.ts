import request from "supertest";
import {app} from "../../../src/app";
import {RouterPaths} from "../../../src/routerPaths";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {CreateUserModel} from "../../../src/features/users/models/CreateUserModel";
import {
    CreateUserCourseBindingModel
} from "../../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";

export const usersCoursesBindingTestManager = {
    async createBinding(data: CreateUserCourseBindingModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response =  await request(app)
            .post(RouterPaths.usersCourseBinding)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                userId: data.userId,
                courseId: data.courseId,
                userName: expect.any(String),
                courseTitle: expect.any(String)
            })
        }
        return {response: response, createdEntity: createdEntity};
    }
}
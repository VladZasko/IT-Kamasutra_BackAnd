import request from "supertest";
import {app} from "../../../src/app";
import {RouterPaths} from "../../../src/routerPaths";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {CreateCourseModel} from "../../../src/features/curses/models/CreateCurseModel";

export const courseTestManager = {
    async createCourse(data: CreateCourseModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const response =  await request(app)
            .post(RouterPaths.courses)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(Number),
                title: data.title
            })
        }
        return {response: response, createdEntity: createdEntity};
    }
}
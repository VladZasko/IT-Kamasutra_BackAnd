import express from "express";
import {getCoursesRouter} from "./features/curses/courses.router";
import {db} from "./db/db";
import {getTestsRouter} from "./routes/tests";
import {getUsersRouter} from "./features/users/users.router";
import {RouterPaths} from "./routerPaths";
import {getUsersCoursesBindingRouter} from "./features/users-courses-bindings/users-courses-bindings.router";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.__tests__, getTestsRouter(db))
app.use(RouterPaths.usersCourseBinding, getUsersCoursesBindingRouter(db))
/*app.use("/interesting", getInterestingRouter(db))*/
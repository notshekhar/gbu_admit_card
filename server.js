const express = require("express")
const cookieParser = require("cookie-parser")

require("dotenv").config()

const { errorHandler } = require("./serverJS/error")
const {
    getDetails,
    checkFeeStatus,
    login,
    auth,
    getSchools,
    getBatches,
    getProgrammes,
    getSpecialization,
    getStudentsData,
    updateData,
} = require("./serverJS/db")

const app = express()
app.use(express.json(), cookieParser())

app.get("/:anything", async (req, res, next) => {
    const { anything } = req.params
    if (anything != "admin") res.redirect("/")
    else {
        try {
            let { token } = req.cookies
            if (token) {
                let a = await auth(token)
                if (a.auth) next()
                else res.redirect("/")
            } else res.redirect("/")
        } catch (err) {
            res.redirect("/")
        }
    }
})
app.use(express.static("public"))

app.post("/api/getdetails", async (req, res, next) => {
    let { roll_no, dob } = req.body
    let dateBirth = ""
    for (let i = 0; i < dob.length; i++) {
        if (dob[i] == "-") dateBirth += "/"
        else dateBirth += dob[i]
    }
    dateBirth = dateBirth.split("/").reverse().join("/")
    try {
        let feePaid = await checkFeeStatus(roll_no)
        if (feePaid) {
            let details = await getDetails(roll_no, dateBirth)
            res.json({ get: true, data: details })
        } else {
            res.json({
                get: false,
                message: "Fee Not paid contact in Administration Office",
            })
        }
    } catch (err) {
        next(err)
    }
})
app.post("/api/admin_login", async (req, res, next) => {
    let { username, password } = req.body
    try {
        let lin = await login(username, password)
        res.json(lin)
    } catch (err) {
        next(err)
    }
})
app.get("/api/auth", async (req, res, next) => {
    try {
        let { token } = req.cookies
        let au = await auth(token)
        res.json(au)
    } catch (err) {
        next(err)
    }
})
app.get("/api/get_schools", async (req, res, next) => {
    try {
        let data = await getSchools()
        res.json(data)
    } catch (err) {
        next(err)
    }
})
app.get("/api/get_programmes", async (req, res, next) => {
    try {
        let { school } = req.query
        let data = await getProgrammes(school)
        res.json(data)
    } catch (err) {
        next(err)
    }
})
app.get("/api/get_batches", async (req, res, next) => {
    try {
        let { school, programme } = req.query
        let data = await getBatches(school, programme)
        res.json(data)
    } catch (err) {
        next(err)
    }
})
app.get("/api/get_specialization", async (req, res, next) => {
    try {
        let { school, programme, batch } = req.query
        let data = await getSpecialization(school, programme, batch)
        res.json(data)
    } catch (err) {
        next(err)
    }
})
app.get("/api/get_students_data", async (req, res, next) => {
    try {
        let { school, programme, batch, specialization } = req.query
        let { token } = req.cookies
        let data = await getStudentsData(
            school,
            programme,
            batch,
            specialization,
            token
        )
        res.json(data)
    } catch (err) {
        next(err)
    }
})
app.get("/api/update", async (req, res, next) => {
    try {
        let { token } = req.cookies
        let { roll_no, data } = req.query
        let updated = await updateData(roll_no, token, data)
        res.json(updated)
    } catch (err) {
        next(err)
    }
})
app.use(errorHandler)
const server = app.listen(80 || process.env.PORT, () => {
    console.log(`listening to port -> ${server.address().port}`)
})

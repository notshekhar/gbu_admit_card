const mysql = require("mysql")
const { i, b64 } = require("nyz")
const { promisify } = require("util")
const { MD5, encodeJSON, decodeJSON } = require("./encryption")
const path = require("path")

let pool = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "shekhar2303",
    database: "students",
})

const query = promisify(pool.query).bind(pool)
const end = promisify(pool.end).bind(pool)

async function getDetails(roll, dob) {
    let data = await query(
        "select * from students where  Roll_Number=? and `Date of Birth`=?",
        [roll, dob]
    )
    if (data.length == 1) {
        let d = {}
        for (let k in data[0]) d[k] = data[0][k]
        i(
            d,
            b64(path.join(process.cwd(), `/public/${d["Photo Upload(.jpg)"]}`)),
            b64(path.join(process.cwd(), `/public/${d["Signature(.jpg)"]}`))
        )
    }
    return data
}
async function checkFeeStatus(roll_no) {
    let status = await query(
        "select `Fee Status` from students where Roll_number=?",
        [roll_no]
    )
    return status[0]["Fee Status"] == "Submitted" ? true : false
}

async function login(username, password) {
    let encryptPassword = MD5(password)
    let data = await query(
        "select * from users where username=? and password=?",
        [username, encryptPassword]
    )
    if (data.length == 1) {
        return { login: true, token: encodeJSON({ username, password }) }
    } else {
        return { login: false }
    }
}
async function auth(token) {
    let { username, password } = decodeJSON(token)
    let encryptPassword = MD5(password)
    let data = await query(
        "select * from users where username=? and password=?",
        [username, encryptPassword]
    )
    if (data.length == 1) {
        return { auth: true }
    } else {
        return { auth: false }
    }
}

async function getSchools(token) {
    // let { username, password } = decodeJSON(token)
    let schools = await query("select DISTINCT(SCHOOL) from students")
    // let batch = await query("select DISTINCT(Batch) from students")
    // let programme = await query("select DISTINCT(Programme) from students")
    // let specialization = await query(
    //     "select DISTINCT(Specialization) from students"
    // )
    return schools
}
async function getBatches(school, programme) {
    let batch = await query(
        "select DISTINCT(Batch) from students where SCHOOL=? and Programme=?",
        [school, programme]
    )
    return batch
}
async function getProgrammes(batch) {
    let programmes = await query(
        "select DISTINCT(Programme) from students where SCHOOL=?",
        [batch]
    )
    return programmes
}
async function getSpecialization(school, programme, batch) {
    let specializations = await query(
        "select DISTINCT(Specialization) from students where SCHOOL=? and Programme=? and Batch=?",
        [school, programme, batch]
    )
    return specializations
}
async function getStudentsData(
    school,
    programme,
    batch,
    specialization,
    token
) {
    let { username, password } = decodeJSON(token)
    let data = await query(
        "select Batch, SCHOOL, Programme, Semester, Roll_Number, Student_Name, `Fee Status` as FeeStatus from students where school=? and Programme=? and Batch=? and Specialization=?",
        [school, programme, batch, specialization]
    )
    let permission_level = await query(
        "select `Access level` as AccessLevel from users where username=? and password=?",
        [username, MD5(password)]
    )
    console.log(username, password, permission_level)
    return { data, permission: permission_level[0] }
}
async function updateData(roll_no, token, data) {
    if (!decodeJSON(token)) return { update: false }
    let { username, password } = decodeJSON(token)
    let user = await query(
        "select `Access level` as AccessLevel from users where username=? and password=?",
        [username, MD5(password)]
    )
    if (user.length != 1) return { update: false }
    if (user[0].AccessLevel != "Edit") return { update: false }

    let updated = await query(
        "update students SET `Fee Status`=? WHERE Roll_Number=?",
        [data, roll_no]
    )
    if (updated.affectedRows == 1) return { updated: true }
    else return { update: false }
}
// ;(async function test() {
//     let s = await updateData(
//         "18/BEC/046",
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoZWtoYXIiLCJwYXNzd29yZCI6InNoZWtoYXIyMzAzIiwiaWF0IjoxNjA5Nzc4ODczfQ.OQlyhZpaVxqxW5TZuJWRZmKuBzCT_QkMp2ibyi6lp5Q",
//         "Submitted"
//     )
//     console.log(s)
// })()

module.exports = {
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
}

// const URL =

// "https://raw.githubusercontent.com/notshekhar/gbu_attendance/master/images/"
const loading = document.querySelector(".loading")

function showLoading() {
    loading.style.display = "flex"
}
function hideLoading() {
    loading.style.display = "none"
}

const blobToBase64 = (blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise((resolve) => {
        reader.onloadend = () => {
            resolve(reader.result)
        }
    })
}

const URL = "/images/"
let images = [
    "_dsf8951.webp",
    "_dsf8963.webp",
    "_dsf8982.webp",
    "_dsf8724a.webp",
]
let i = 1
let im

let imagesURL = []

let images_loaded = false

showLoading()

images.forEach(async (image, i) => {
    let res = await fetch(`/images/${image}`)
    let data = await res.blob()
    let base64 = await blobToBase64(data)
    imagesURL.push(base64)
    if (i == images.length - 1) {
        hideLoading()
        images_loaded = true
    }
})
setInterval(() => {
    if (images_loaded) {
        im = imagesURL[i]
        cssv("im", `url(${im})`)
        i++
        i %= images.length
    }
}, 3000)

//get and set css variables
function cssv(name, value) {
    if (name[0] != "-") name = "--" + name //allow passing with or without --
    if (value) document.documentElement.style.setProperty(name, value)
    return getComputedStyle(document.documentElement).getPropertyValue(name)
}

function validImage(filename) {
    let v = /\.(jpe?g|tiff?|png|webp|bmp|raw)$/i.test(filename)
    if (!v) {
        alert(
            `Not valid Image only "jpeg", "jpg", "png", "raw", and "webp" images are allowed`
        )
        return false
    }
    // let pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i
    // let extension = pattern.exec(filename)[1]
    // console.log(extension)
    return true
}
// BUDDHA UNIVERSITY CS file FINAL.docx"
//file.file.file.docx

history.pushState({ page: "main" }, "", "")

//photo
const choose_photo = document.querySelector(".drop_photo > input")
const drag_drop = document.querySelector(".drop_photo")
const choose_div = document.querySelector(".drop_photo > .choose")
//file change
choose_photo.onchange = (e) => {
    let file = choose_photo.files[0]
    if (!validImage(file.name)) return
    if (file.size > 1048576) {
        alert("Photo size can't be more then 1mb re-upload")
        return
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        window.photo = reader.result
        drag_drop.innerHTML = file.name
        let image = new Image()
        image.src = reader.result
        image.height = 100
        drag_drop.prepend(image)
    }
}

//choose file click
// choose_div.onclick = (e) => {
//     choose_photo.click()
// }
drag_drop.onclick = (e) => {
    choose_photo.click()
}
//handling drag drop
drag_drop.ondragover = (e) => {
    e.preventDefault()
    drag_drop.classList.add("dragHover")
}
drag_drop.ondragleave = (e) => {
    e.preventDefault()
    drag_drop.classList.remove("dragHover")
}
drag_drop.ondrop = (e) => {
    drag_drop.classList.remove("dragHover")
    e.preventDefault()
    e.stopPropagation()
    choose_photo.files = e.dataTransfer.files
    let file = choose_photo.files[0]
    if (!validImage(file.name)) return
    if (file.size > 1048576) {
        alert("Photo size can't be more then 1mb re-upload")
        return
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        window.photo = reader.result
        drag_drop.innerHTML = file.name
        let image = new Image()
        image.src = reader.result
        image.height = 100
        drag_drop.prepend(image)
    }
}

//signature
const drop_signature = document.querySelector(".drop_signature")
const choose_signature = document.querySelector(".drop_signature > input")
const choose_signature_div = document.querySelector(".drop_signature > .choose")
//file change
choose_signature.onchange = (e) => {
    let file = choose_signature.files[0]
    if (!validImage(file.name)) return
    if (file.size > 1048576) {
        alert("Signature photo size can't be more then 1mb re-upload")
        return
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        window.signature = reader.result
        drop_signature.innerHTML = file.name
        let image = new Image()
        image.src = reader.result
        image.height = 100
        drop_signature.prepend(image)
    }
}

//choose file click
// choose_signature_div.onclick = (e) => {
//     choose_signature.click()
// }
drop_signature.onclick = (e) => {
    choose_signature.click()
}
//handling drag drop
drop_signature.ondragover = (e) => {
    e.preventDefault()
    drop_signature.classList.add("dragHover")
}
drop_signature.ondragleave = (e) => {
    e.preventDefault()
    drop_signature.classList.remove("dragHover")
}
drop_signature.ondrop = (e) => {
    drop_signature.classList.remove("dragHover")
    e.preventDefault()
    e.stopPropagation()
    choose_signature.files = e.dataTransfer.files
    let file = choose_signature.files[0]
    if (!validImage(file.name)) return
    if (file.size > 1048576) {
        alert("Signature photo size can't be more then 1mb re-upload")
        return
    }
    console.log("okay")
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        window.signature = reader.result
        drop_signature.innerHTML = file.name
        let image = new Image()
        image.src = reader.result
        image.height = 100
        drop_signature.prepend(image)
    }
}

//
const roll_no = document.querySelector(".roll_no")
const dob = document.querySelector(".birtday")

// roll_no.onkeydown = async (_) => {
//     let res = await fetch("/api/check_roll_no")
//     let data = res.body.json()
//     if (data.exist) console.log("roll no valid")
//     else console.log("not valid")
// }

const submit = document.querySelector(".submit")

const download_div = document.querySelector(".download")
const download_button = document.querySelector(".download > .header > .downbtn")

const canvas = document.querySelector(".download > .admit_card_image > canvas")
canvas.oncontextmenu = (e) => e.preventDefault()
const ctx = canvas.getContext("2d")

function resetForm() {
    roll_no.value = ""
    dob.value = ""
}

submit.onclick = async () => {
    let data = {
        roll_no: roll_no.value,
        dob: dob.value,
        photo: window.photo,
        signature_photo: window.signature,
    }
    for (let d in data) {
        if (!data[d]) {
            alert("Enter details in all Fields")
            return
        }
    }
    try {
        showLoading()
        let res = await fetch("/api/getdetails", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                roll_no: data.roll_no,
                dob: data.dob,
                photo,
                signature,
            }),
        })
        let resData = await res.json()
        if (resData.get) {
            console.log(resData)
            if (resData.data.length <= 0) {
                alert("No data found re-try entering roll no and date of birth")
                resetForm()
            } else {
                // put in details in canvas
                showDataOnCanvas(resData.data[0])
                //show download div
                download_div.style.display = "block"
                //push history
                history.pushState({ page: "download" }, "download", "download")
            }
        } else {
            alert(resData.message)
            // else
        }
        if (resData.error) alert(resData.message)
        hideLoading()
    } catch (err) {
        hideLoading()
        alert(err.message)
    }
}
window.onpopstate = (e) => {
    let page = e.state.page
    if (page == "main") {
        resetForm()
        download_div.style.display = "none"
    }
}

function showDataOnCanvas(details) {
    download_button.onclick = () => download(details.Roll_Number)
    function download(filename) {
        var link = document.createElement("a")
        link.download = `${filename}.png`
        link.href = canvas.toDataURL()
        link.click()
    }
    const student_copy_positions = {
        name_of_school: [218, 238],
        name_of_programme: [255, 270],
        programme_code: [204, 306],
        student_name: [224, 339],
        examination_duration: [228, 388],
        aadhar_id: [177, 545],
        roll_no: [578, 343],
        photo: [739, 148, 961, 339],
        signature: [738, 360, 965, 424],
    }

    const office_copy_positions = {
        name_of_school: [218, 1026],
        name_of_programme: [255, 1063],
        student_name: [224, 1105],
        aadhar_id: [177, 1146],
        roll_no: [588, 1105],
        photo: [739, 927, 961, 1118],
        signature: [738, 1139, 965, 1202],
    }
    // timing_morning_shift: [221, 424],
    // timing_evening_shift: [219, 477],

    function canvasText(text, x, y) {
        ctx.font = "bold 18px Arial"
        ctx.fillText(text, x, y)
    }
    function canvasImage(image, [x1, y1, x2, y2]) {
        let width = x2 - x1
        let height = y2 - y1
        ctx.drawImage(image, x1, y1, width, height)
        // ctx.fillStyle = "red"
        // ctx.fillRect(x1, y1, width, height)
        // ctx.fillStyle = "black"
    }

    function draw() {
        showLoading()
        let image = new Image()
        image.src = "../images/a4.png"
        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            hideLoading()
            canvasText(
                details.Student_Name,
                student_copy_positions.student_name[0],
                student_copy_positions.student_name[1]
            )
            canvasText(
                details.SCHOOL,
                student_copy_positions.name_of_school[0],
                student_copy_positions.name_of_school[1]
            )
            canvasText(
                details.Programme,
                student_copy_positions.name_of_programme[0],
                student_copy_positions.name_of_programme[1]
            )
            canvasText(
                details.Programme,
                student_copy_positions.programme_code[0],
                student_copy_positions.programme_code[1]
            )
            canvasText(
                details["Aadhar no"] ? details["Aadhar no"] : "",
                student_copy_positions.aadhar_id[0],
                student_copy_positions.aadhar_id[1]
            )
            canvasText(
                details.Roll_Number,
                student_copy_positions.roll_no[0],
                student_copy_positions.roll_no[1]
            )
            let photoImage = document.createElement("img")
            photoImage.src = photo
            // photoImage.src = window.photo
            photoImage.onload = () => {
                canvasImage(photoImage, student_copy_positions.photo)
                canvasImage(photoImage, office_copy_positions.photo)
            }
            let signaturePhoto = document.createElement("img")
            signaturePhoto.src = signature
            // signaturePhoto.src = window.signature
            signaturePhoto.onload = () => {
                canvasImage(signaturePhoto, student_copy_positions.signature)
                canvasImage(signaturePhoto, office_copy_positions.signature)
            }
            //office
            canvasText(
                details.Student_Name,
                office_copy_positions.student_name[0],
                office_copy_positions.student_name[1]
            )
            canvasText(
                details.SCHOOL,
                office_copy_positions.name_of_school[0],
                office_copy_positions.name_of_school[1]
            )
            canvasText(
                details.Programme,
                office_copy_positions.name_of_programme[0],
                office_copy_positions.name_of_programme[1]
            )
            canvasText(
                details["Aadhar no"] ? details["Aadhar no"] : "",
                office_copy_positions.aadhar_id[0],
                office_copy_positions.aadhar_id[1]
            )
            canvasText(
                details.Roll_Number,
                office_copy_positions.roll_no[0],
                office_copy_positions.roll_no[1]
            )
        }
    }
    draw()
}

let data = {
    "Aadhar Image(.jpg)": null,
    "Aadhar no": null,
    Batch: "2019-2022",
    "Date of Birth": "23/03/2000",
    Email: "notshekhar@gmail.com",
    Father_s_name: "Naresh Tyagi",
    "Fee Status": "Submitted",
    Gender: "Male",
    "Mobile no": "9027760089",
    "Photo Upload(.jpg)": null,
    Programme: "B.Tech",
    Roll_Number: "18/BEC/046",
    SCHOOL: "School of Information and Technology",
    Semester: "V",
    "Signature(.jpg)": null,
    Specialization: "Electronic and Communication",
    Student_Name: "Shekhar Tyagi",
    id: 1,
}
// showDataOnCanvas(data)

//admin login
const admin_login_btn = document.querySelector(".header > .admin > .login")
const login_wrap = document.querySelector(".login_wrap")
const close = [
    login_wrap.querySelector(".close"),
    login_wrap.querySelector(".close_btn"),
]
const username = login_wrap.querySelector(".username")
const password = login_wrap.querySelector(".password")
const submit_login_btn = login_wrap.querySelector("button")

let admin_login_shown = false

admin_login_btn.onclick = async () => {
    let res = await fetch("/api/auth")
    let data = await res.json()
    if (data.auth) {
        location.href = "/admin"
    } else {
        if (!admin_login_shown) {
            // console.log("okay")
            login_wrap.style.display = "block"
            admin_login_shown = !admin_login_shown
        }
    }
}
close.forEach((c) => {
    c.onclick = () => {
        if (admin_login_shown) {
            login_wrap.style.display = "none"
            admin_login_shown = !admin_login_shown
        }
    }
})

// submit_login_btn.onclick = async () => {
//
// }

submit_login_btn.addEventListener("click", async function () {
    let data = {
        username: username.value,
        password: password.value,
    }
    for (let key in data) {
        if (data[key].length == 0) {
            alert("Username or Password is missing")
            return
        }
    }
    let res = await fetch("/api/admin_login", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    let resData = await res.json()
    if (resData.login) {
        cookie.setItem("token", resData.token)
        location.href = "/admin"
    } else {
        alert("Wrong Password or Username")
    }
    console.log(resData)
})

// notsh3Khar

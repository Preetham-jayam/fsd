exports.getUser = (req, res) => {
    const id = req.profile._id
    let firstname = " "
    let lastname = " "
    let fullname = " "
    let role = 0
    if(req.profile.role == 0) {
        firstname= req.profile.student.firstName
        lastname= req.profile.student.lirstName
        courses = req.profile.student.courses
        role = 0
    } else {
       fullname=req.profile.teacher.FullName
        courses = req.profile.educator.courses
        role = 1
    }
    res.render('student/shome', {firstname: firstname, mail: req.profile.email, courses, id, role})
}

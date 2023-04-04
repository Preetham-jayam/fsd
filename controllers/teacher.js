const Course=require('../models/course');
const Teacher=require('../models/teacher');
const User=require('../models/user');


exports.getAddCourse = (req,res)=>{
    Teacher.findById(req.session.user.teacher)
    .then(result=>{
        res.render('teacher/add-course',{user:req.session.user,teacher:result});
    })
   
};
// exports.postAddCourse=(req,res,next)=>{
//     const title=req.body.title;
//     const name=req.body.nameCourse;
//     const description=req.body.Description;
//     const cost=req.body.Price;
//     const salecost=req.body.salePrice;
//     const category=req.body.category;
//     const Image=req.file;
//     const imageUrl=Image.path;
   
//     const course=new Course({
//         title:title,
//         name:name,
//         description:description,
//         price:cost,
//         Imageurl:imageUrl,
//         teacher:req.body.Id    
//     });
//     course
//        .save()
//        .then(result=>{
//         console.log('Course created');
//         User.findByIdAndUpdate(req.body.Id)
//         .populate('teacher')
//         .exec()
//         .then((user)=>{
//             Teacher.findByIdAndUpdate(req.body.Id)
//             .then(teacher=>{
//                 teacher.courses.push(result._id);
//                 teacher.save();
//             })
//            user.save();
//            return res.redirect('/teacher/home');
//         })
//        })
//        .catch(err=>{
//         console.log(err);
//        })
//     };

exports.postAddCourse = (req, res, next) => {
    const title = req.body.title;
    const courseName = req.body.nameCourse;
    const description = req.body.Description;
    const cost = req.body.Price;
    const salecost = req.body.salePrice;
    const category = req.body.category;
    const image = req.file;
    const imageUrl = image.path;
    const teacher = req.body.Id;

    const course = new Course({
        title: title,
        name: courseName,
        description: description,
        price: cost,
        Imageurl: imageUrl,
        teacher: teacher    
    });

    course.save()
    .then(result => {
      console.log('Course created');
      return Teacher.findById(req.body.Id).exec();
    })
    .then(teacher => {
      teacher.courses.push(course._id);
      return teacher.save();
    })
    .then(() => {
      return User.findById(req.body.Id).populate('teacher').exec();
    })
    .then(user => {
    //   user.save();
      return res.redirect('/teacher/home');
    })
    .catch(err => {
      console.log(err);
    });
};

     

exports.getHomepage= (req,res,next)=>{
   Teacher.findById(req.session.user.teacher)
   .populate('courses')
    .then(result=>{
        res.render('teacher/teacher-home',{user: req.session.user,teacher:result,courses:result.courses});
    })
    .catch(err => console.log(err));
};

exports.getSingleCourse=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
    .populate('teacher')
     .then(course=>{
        res.render('teacher/coursedetail',{data:course,teacher:course.teacher});
     })
     .catch(err => console.log(err));
};

exports.upload=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
     .then(course=>{
        res.render('teacher/courseupload',{data:course});
     })
     .catch(err => console.log(err));
   
};

exports.getCourseEdit=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
     .then(course=>{
        res.render('teacher/course-edit',{course:course});
     })
     .catch(err => console.log(err)); 
};

exports.postEditCourse=(req,res,next)=>{
    const id=req.params.id;
    const newtitle=req.body.title;
    const newname=req.body.nameCourse;
    const description=req.body.Description;
    const price=req.body.Price;
    const Image=req.file;
    const imageUrl=Image.path;

    Course.findById(id)
    .then(course=>{
        course.title=newtitle;
        course.name=newname;
        course.cost=price;
        course.description=description;
        course.Imageurl=imageUrl;
        return course.save();
    })
    .then(course=>{
        console.log('Course Updated');
        res.redirect(`/teacher/courseDetails/${course._id}`);
    })
    .catch(err => console.log(err));
};

exports.getQuizPage=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
     .then(course=>{
        res.render('teacher/teacher-quiz',{course:course});
     })
     .catch(err => console.log(err)); 

};
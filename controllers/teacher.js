const Course=require('../models/course');

exports.getAddCourse = (req,res)=>{
    res.render('teacher/add-course');
};
exports.postAddCourse=(req,res,next)=>{
    const title=req.body.title;
    const name=req.body.nameCourse;
    const description=req.body.Description;
    const cost=req.body.Price;
    const salecost=req.body.salePrice;
    const category=req.body.category;
    const Image=req.file;
    const imageUrl=Image.path;
   
    const course=new Course({
        title:title,
        name:name,
        description:description,
        price:cost,
        Imageurl:imageUrl
        
        
    });

    course
       .save()
       .then(result=>{
        console.log('Course created');
        res.redirect('/teacher/home');
       })
       .catch(err=>{
        console.log(err);
       })
}

exports.getHomepage= (req,res,next)=>{
    Course.find()
        .then(courses=>{
            res.render('teacher/teacher-home',{
                model:courses
            });
        })
        .catch(err => console.log(err));
};

exports.getSingleCourse=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
     .then(course=>{
        res.render('teacher/coursedetail',{data:course});
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
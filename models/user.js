const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Educator",
    },
    role: {
        type: Number,
        default: 0
    },
    flag: {
        type: Number,
        default: 0
    }

},
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;

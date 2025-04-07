import mongoose from "mongoose";
import User from '../users/user_models.js';

const subjectSchema = new mongoose.Schema<ISubject>({
    name :{
        type: String,
        required : true
    },
    teacher: {
        type: String,
        required : true
    },
    alumni: {
        type : [{ type: mongoose.Types.ObjectId, ref: User }],
        required : true
    }
});

export interface ISubject{
    name : string;
    teacher : string;
    alumni : [mongoose.ObjectId];

}

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
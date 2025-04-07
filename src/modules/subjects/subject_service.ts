import { IsAny } from 'mongodb';
import Subject, { ISubject } from './subject_model.js';
import User, {IUser} from '../users/user_models.js';
//CRUD
export class SubjectService {
    async saveSubject(data: Partial<ISubject>): Promise<ISubject>{
      const subject = new Subject(data);
      return await subject.save();
    }

    async getSubject(name:string):Promise<ISubject | null>{
        return await Subject.findOne({name:name});
    }

    async updateSubject(subjectName:string, data:Partial<ISubject>): Promise<ISubject | null>{
        const newSubject = data as Partial<ISubject>
        return await Subject.findOneAndUpdate({name:subjectName}, newSubject, {new:true})
    }

    async deleteSubject(name:string): Promise<ISubject | null>{
        return await Subject.findOneAndDelete({name:name});
    }

    async assignUserToSubject(userName: string, subjectName:string): Promise<ISubject | boolean>{
        const user = await User.findOne({name:userName})
        if(user === null){
            return false
        }
        const subject = await Subject.findOneAndUpdate({name:subjectName}, {$push: {alumni: user._id}}, {new:true});
        if(subject === null)
            return true;
        return subject
    }

    async getUsersOfSubject(subjectName:string): Promise<[IUser]|null>{
        const subject = await Subject.findOne({name:subjectName}).populate('alumni')
        if(subject === null)
            return null;
        return subject.alumni as unknown as [IUser]
    }
}
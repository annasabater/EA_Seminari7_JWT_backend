import { Request, Response } from 'express';
import { ISubject } from './subject_model.js';
import { SubjectService } from './subject_service.js';
import User, {IUser} from '../users/user_models.js'
const subjectService = new SubjectService();

export async function createSubject(req:Request, res:Response): Promise<Response>{
    try{
        const{name, teacher, alumni} = req.body as Partial<ISubject>;
        const newSubject:Partial<ISubject> = {name,teacher,alumni};
        console.log(req.body);
        console.log("Creating new subject: " + newSubject);
        const subject = await subjectService.saveSubject(newSubject);
        return res.status(200).json({
            message:"Subject saved",
            subject
        });
    }
    catch(error){
        console.log("Error saving subject " + error);
        return res.status(500).json({ error: 'Failed to save the subject' });
    }
}
export async function searchSubject(req:Request, res:Response): Promise<Response>{
    try{
        const name = req.params.name;
        console.log("Searching for subject: " + name);
        const subject = await subjectService.getSubject(name)
        if(subject){
            return res.status(200).json({
                message:"Subject found",
                subject
            });
        }
        else{
            return res.status(404).json({message:"Subject not found"});
        }
    }
    catch(error){
        console.log("Error finding subject" + error);
        return res.status(500).json({ error: 'Failed in getting the subject' });
    }
}
export async function updateSubjectByName(req:Request, res:Response): Promise<Response>{
    try{
        const subjectName = req.params.name;
        const{name, teacher} = req.body as Partial<ISubject>;
        const subject:Partial<ISubject> = {name,teacher};
        console.log(name,teacher, req.body);
        console.log("Updating the subject: " + subjectName + "with data: " + teacher);
        const newSubject = await subjectService.updateSubject(subjectName, subject)
        if(newSubject){
            return res.status(200).json({
                message:"Subject found and updated",
                newSubject
            });
        }
        else{
            return res.status(404).json({message:"Subject not found"});
        }
    }
    catch(error){
        console.log("Error updating subject " + error);
        return res.status(500).json({ error: 'Failed in updating the subject' });
    }
}
export async function deleteSubject(req:Request, res:Response): Promise<Response>{
    try{
        const name = req.params.name;
        console.log("Deleting the subject: " + name);
        const deletedSubject = await subjectService.deleteSubject(name)
        if(deletedSubject){
            return res.status(200).json({
                message:"Subject found and deleted",
                deletedSubject
            });
        }
        else{
            return res.status(404).json({message:"Subject not found"});
        }
    }
    catch(error){
        console.log("Error deleting subject " + error);
        return res.status(500).json({ error: 'Failed in deleting the subject' });
    }
}
export async function assignSubjectToUser(req:Request, res:Response): Promise<Response>{
    try{
        const {userName, subjectName} = req.params;
        console.log("Assigning the subject: " + subjectName + "to the user: " + userName);
        const subject = await subjectService.assignUserToSubject(userName,subjectName)
        if(subject === true){
            return res.status(404).json({message:"Subject not found"});
        }
        else if(subject === false){
            return res.status(405).json({message:"User not found"});
        }
        else{
            return res.status(200).json({
                message:"Subject and user found, correctly assigned",
                subject
            });
        }
    }
    catch(error){
        console.log("Error assigning the subject " + error);
        return res.status(500).json({ error: 'Failed in assigning the subject' });
    }
}

export async function getUsersFromSubject(req: Request, res: Response): Promise<Response> {
    try {
        const name = req.params.name;
        console.log("Obtenint els usuaris de l'assignatura: " + name);
        const users: IUser[] | null = await subjectService.getUsersOfSubject(name)
        if (users && users.length !== 0) {
            return res.status(200).json({
                message: "Usuaris trobats",
                users
            });
        }
        else if (users && users.length === 0) {
            return res.status(201).json({ message: "No hi ha cap usuari" });
        }
        else {
            return res.status(404).json({ message: "Assignatura no trobada" });
        }
    }
    catch (error) {
        console.log("Error en obtenir els usuaris de l'assignatura " + error);
        return res.status(500).json({ error: 'No s\'han pogut obtenir els usuaris' });
    }
}

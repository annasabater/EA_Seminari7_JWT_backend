import express from 'express';
import { 
  createSubject, 
  searchSubject, 
  updateSubjectByName, 
  deleteSubject, 
  assignSubjectToUser, 
  getUsersFromSubject 
} from './subject_controller.js';

const router = express.Router();

/**
 * @openapi
 * /api/subject/:
 *   post:
 *     summary: Crea un nou subject
 *     tags:
 *       - Subjects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject creat amb èxit
 *       500:
 *         description: Error del servidor
 */
router.post('/', createSubject);

/**
 * @openapi
 * /api/subject/assign/{userName}/{subjectName}:
 *   put:
 *     summary: Assigna un usuari a un subject
 *     tags:
 *       - Subjects
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         description: El nom de l'usuari que es vol assignar
 *         schema:
 *           type: string
 *       - in: path
 *         name: subjectName
 *         required: true
 *         description: El nom del subject al qual assignar l'usuari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuari assignat correctament
 *       404:
 *         description: Subject no trobat
 *       405:
 *         description: Usuari no trobat
 *       500:
 *         description: Error del servidor
 */
router.put('/assign/:userName/:subjectName', assignSubjectToUser);

/**
 * @openapi
 * /api/subject/users/{name}:
 *   get:
 *     summary: Obté els usuaris associats a un subject
 *     tags:
 *       - Subjects
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: El nom del subject per obtenir els usuaris
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuaris trobats correctament
 *       201:
 *         description: No s'han trobat usuaris
 *       404:
 *         description: Subject no trobat
 *       500:
 *         description: Error del servidor
 */
router.get('/users/:name', getUsersFromSubject);

/**
 * @openapi
 * /api/subject/{name}:
 *   get:
 *     summary: Obté un subject
 *     tags:
 *       - Subjects
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: El nom del subject a cercar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject trobat amb èxit
 *       404:
 *         description: Subject no trobat
 *       500:
 *         description: Error del servidor
 */
router.get('/:name', searchSubject);

/**
 * @openapi
 * /api/subject/{name}:
 *   put:
 *     summary: Actualitza un subject
 *     tags:
 *       - Subjects
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: El nom del subject que es vol actualitzar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject actualitzat correctament
 *       404:
 *         description: Subject no trobat
 *       500:
 *         description: Error del servidor
 */
router.put('/:name', updateSubjectByName);

/**
 * @openapi
 * /api/subject/{name}:
 *   delete:
 *     summary: Elimina un subject pel nom
 *     tags:
 *       - Subjects
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: El nom del subject a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject eliminat correctament
 *       404:
 *         description: Subject no trobat
 *       500:
 *         description: Error del servidor
 */
router.delete('/:name', deleteSubject);

export default router;

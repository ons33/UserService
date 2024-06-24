import Competence from "../models/Competence.js";
import Experience from "../models/Experience.js";
import { URLSearchParams } from "url";
import http from "http";
import { signAccessToken } from "../middleware/auth.js";
import querystring from 'querystring';
import { Router } from "express";
const router = Router();

import User from "../models/User.js";
import {
  initializeKeycloak,
  initiateResetPassword,
} from "../keycloack/keycloak.js";
import axios from "axios";
import twilio from "twilio";
import dotenv from "dotenv";
import { body, check, validationResult } from "express-validator";
import Education from "../models/Education.js";
dotenv.config();
const account_sid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_TOKEN;
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import ImageUsers from "../models/ImageUsers.js";
import fs from 'fs';

import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: 'dpk9mpjsd',
  api_key: '348193888992711',
  api_secret: 'qefN7t3DU47Kdpnhi9i8G56XHM0',
});

//


const twilioClient = twilio(account_sid, authToken);

const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: "+13396751348",
      to: phoneNumber,
    });

    console.log("SMS sent successfully:", response.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};




const validatePhoneNumberUnique = check("phoneNumber").custom(
  async (phoneNumber, { req }) => {
    const client = await initializeKeycloak();

    // Vérifiez si le numéro de téléphone est déjà utilisé
    const existingUser = await client.users.find({ phoneNumber });
    if (existingUser.length > 0) {
      throw new Error(
        "Le numéro de téléphone est déjà utilisé par un autre utilisateur"
      );
    }

    return true;
  }
);



const getAllUsers = async (req, res) => {
  try {
    const client = await initializeKeycloak();

    const response = await axios.get(
      `${client.baseUrl}/admin/realms/${client.realmName}/users`,
      {
        headers: {
          Authorization: `Bearer ${await client.getAccessToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const users = response.data;

    res.status(200).json({ users });
  } catch (error) {
    console.error(`Error fetching all users: ${error.message}`);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};




const checkUserRole = (req, res, next) => {
  const { roles } = req.kauth.grant.access_token.content;

  // Check if the user has the required role
  if (roles.includes("admin")) {
    return next();
  } else {
    res.status(403).send("Access Denied: Insufficient privileges.");
  }
};

async function getCompetencesAndExperiencesByUserId(req, res) {
  const userId = req.params.userId;
  console.log(userId);
  let competences = null;
  let experiences = null;
  try {
    // Find competences and experiences directly based on the user ID
    competences = await Competence.find({ user: userId });
     experiences = await Experience.find({ user: userId });
console.log("competences",competences);
    // Check if competences and experiences exist before returning
    if (!competences.length && !experiences.length) {
      return res.status(200).json({
        competences: competences.length > 0 ? competences : null,
        experiences: experiences.length > 0 ? experiences : null,
      });
    }

    return res.status(200).json({
      competences: competences.length > 0 ? competences : null,
      experiences: experiences.length > 0 ? experiences : null,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: `Error getting competences and experiences: ${error.message}`,
      });
  }
}

async function getCompetencesEducationAndExperiencesByUserId(req, res) {
  const userId = req.params.userId;
  console.log(userId);
  let competences = null;
  let experiences = null;
  let educations = null;
  try {
    // Find competences, experiences, and educations based on the user ID
    competences = await Competence.find({ user: userId });
    experiences = await Experience.find({ user: userId });
    educations = await Education.find({ user: userId });

    // Check if competences, experiences, and educations exist before returning
    if (!competences.length && !experiences.length && !educations.length) {
      return res.status(200).json({
        competences: competences.length > 0 ? competences : null,
        experiences: experiences.length > 0 ? experiences : null,
        educations: educations.length > 0 ? educations : null, // Fixed educations here
      });
    }

    return res.status(200).json({
      competences: competences.length > 0 ? competences : null,
      experiences: experiences.length > 0 ? experiences : null,
      educations: educations.length > 0 ? educations : null, // Fixed educations here
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: `Error getting competences, experiences, and educations: ${error.message}`,
      });
  }
}

const getUserIdByEmail = async (req, res) => {
  const { email } = req.params; // Extract the email from URL params

  try {
    // Find the user document based on the email
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(200).json({ userId: user._id });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding user by email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users
const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






const updateUser = async (req, res) => {
};
const updateUserInKeycloak = async (userId, fieldsToUpdate) => {
};


const verifUnicEmail = async (req, res) => {
  const client = await initializeKeycloak();
  console.log("99999999999999999999999")
  const { email } = req.body;

  try {
      // Faites une requête à votre API Keycloak pour vérifier l'unicité de l'e-mail
      const existingUsersbyEmail = await axios.get(
          `${client.baseUrl}/admin/realms/${client.realmName}/users`,
          {
              headers: {
                  Authorization: `Bearer ${await client.getAccessToken()}`,
                  "Content-Type": "application/json",
              },
              params: {
                  q: `email:${email}`,
              },
          }
      );

      // Traitez la réponse pour vérifier l'unicité de l'e-mail
      const usersByEmail = existingUsersbyEmail.data;
      const filteredUsersByEmail = usersByEmail.filter(user => user.email === email);

      // Si des utilisateurs ont été trouvés avec le même e-mail, renvoyez une erreur
      if (filteredUsersByEmail.length > 0) {
          return res.status(400).json({
              error: "Cet e-mail est déjà utilisé par un autre utilisateur.",
              param: "email"
          });
      } else {
          return res.status(200).json({
              message: "L'e-mail est unique."
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
/// verif unciteee de mobil
const verifUnicMobile = async (req, res) => {
  const client = await initializeKeycloak();
  const { mobile } = req.body;

  try {
      // Faites une requête à votre API Keycloak pour récupérer tous les utilisateurs avec l'attribut 'mobile' défini
      const existingUsersResponse = await axios.get(
          `${client.baseUrl}/admin/realms/${client.realmName}/users`,
          {
              headers: {
                  Authorization: `Bearer ${await client.getAccessToken()}`,
                  "Content-Type": "application/json",
              },
          }
      );

      const users = existingUsersResponse.data;

      // Récupérez tous les numéros de téléphone des utilisateurs
      const userPhoneNumbers = users.map(user => user.attributes.mobile).flat();
      console.log("*******************")
      console.log(userPhoneNumbers)

      // Vérifiez si le numéro de téléphone fourni est déjà utilisé par un autre utilisateur
      if (userPhoneNumbers.includes(mobile)) {
          return res.status(400).json({
              error: "Ce numéro de téléphone est déjà utilisé par un autre utilisateur.",
              param: "mobile"
          });
      } else {
          return res.status(200).json({
              message: "Le numéro de téléphone est unique."
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};


// verif username
const verifUnicUsername = async (req, res) => {
  const client = await initializeKeycloak();
  const { username } = req.body;

  try {
      // Faites une requête à votre API Keycloak pour récupérer tous les utilisateurs avec l'attribut 'username' défini
      const existingUsersResponse = await axios.get(
          `${client.baseUrl}/admin/realms/${client.realmName}/users`,
          {
              headers: {
                  Authorization: `Bearer ${await client.getAccessToken()}`,
                  "Content-Type": "application/json",
              },
          }
      );

      const users = existingUsersResponse.data;

      // Récupérez tous les noms d'utilisateur des utilisateurs
      const usernames = users.map(user => user.username);

      // Vérifiez si le nom d'utilisateur fourni est déjà utilisé par un autre utilisateur
      if (usernames.includes(username)) {
          return res.status(400).json({
              error: "Ce nom d'utilisateur est déjà utilisé par un autre utilisateur.",
              param: "username"
          });
      } else {
          return res.status(200).json({
              message: "Le nom d'utilisateur est unique."
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};


// houni khdemt bel url de facon naamel generation d'un url apres la creation de l'image dans upppploads



const assignDefaultRole = async (req, res) => {
  const { userId } = req.params;

  const client = await initializeKeycloak();

  try {
      const rolesResponse = await axios.get(
          `${client.baseUrl}/admin/realms/${client.realmName}/roles`,
          {
              headers: {
                  Authorization: `Bearer ${await client.getAccessToken()}`,
                  "Content-Type": "application/json",
              },
          }
      );

      const studentRoleId = rolesResponse.data.find(role => role.name === 'etudiant')?.id;

      if (!studentRoleId) {
          return res.status(404).json({ error: 'Role "étudiant" not found' });
      }

      // Attribuer le rôle "étudiant" à l'utilisateur
      await axios.post(
          `${client.baseUrl}/admin/realms/${client.realmName}/users/${userId}/role-mappings/realm`,
          [{ id: studentRoleId, name: 'etudiant', scopeParamRequired: false }],
          {
              headers: {
                  Authorization: `Bearer ${await client.getAccessToken()}`,
                  "Content-Type": "application/json",
              },
          }
      );

      res.status(200).json({ message: 'Role "étudiant" assigned successfully' });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
}






const uplaodImage=async (req, res) => {
  console.log(
      "uploading ................",req
  )

     
      try {
      
      let imageUrl = '';
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
      }
  
      return res.status(200).json({imageUrl: imageUrl});

      } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Une erreur interne du serveur s\'est produite.' });
      }

  
};
const updateImage = async (req, res) => {
  const { idUser } = req.params; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
  const userId  = "698c8a41c7e5a7211c858053"
  try {


      const existingImageUser = await ImageUsers.findOne({ userId: idUser });

console.log("UserId+++++++++++++++++")
console.log(idUser)
console.log("USerId++++++++++++++++++++++")

      console.log("**************************************")
console.log(existingImageUser)
      console.log("**************************************")


      if (!existingImageUser) {
          return res.status(404).json({ error: 'L\'utilisateur n\'existe pas dans la collection ImageUsers.' });
      }

      // Uploader la nouvelle image
      upload(req, res, async function (err) {
          if (err instanceof multer.MulterError) {
              return res.status(400).json({ error: 'Une erreur s\'est produite lors du téléchargement de l\'image.' });
          } else if (err) {
              return res.status(500).json({ error: 'Une erreur interne du serveur s\'est produite.' });
          }

          const imageName = req.file.filename;
          const imageUrl = `http://localhost:${process.env.PORT}/uploads/${imageName}`;
          existingImageUser.imageName = imageName;
          await existingImageUser.save();
          // Initialiser Keycloak
          const client = await initializeKeycloak();

          try {
              // Récupérer les attributs existants de l'utilisateur dans Keycloak
              const userResponse = await axios.get(
                  `${client.baseUrl}/admin/realms/${client.realmName}/users/${idUser}`,
                  {
                      headers: {
                          Authorization: `Bearer ${await client.getAccessToken()}`
                      }
                  }
              );

              const user = userResponse.data;

              // Créer un objet contenant uniquement l'attribut image pour la mise à jour
              const updatedAttributes = {
                  ...user.attributes, // Conserver les attributs existants
                  image: imageUrl // Mettre à jour seulement l'attribut de l'image
              };

              // Mettre à jour l'attribut image de l'utilisateur dans Keycloak
              await axios.put(
                  `${client.baseUrl}/admin/realms/${client.realmName}/users/${idUser}`,
                  {
                      ...user,
                      attributes: updatedAttributes
                  },
                  {
                      headers: {
                          Authorization: `Bearer ${await client.getAccessToken()}`,
                          'Content-Type': 'application/json'
                      }
                  }
              );

              return res.status(200).json({ imageUrl: imageUrl });
          } catch (error) {
              console.error('Erreur lors de la mise à jour de l\'image de l\'utilisateur dans Keycloak:', error);
              return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'image de l\'utilisateur dans Keycloak.' });
          }
      });
  } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image de l\'utilisateur:', error);
      return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'image de l\'utilisateur.' });
  }
};







export {
  
  getAll,
  
  getAllUsers,
 
  checkUserRole,updateImage,

  getCompetencesAndExperiencesByUserId,
  getCompetencesEducationAndExperiencesByUserId,
 
  getUserIdByEmail,verifUnicUsername,verifUnicMobile,verifUnicEmail,updateUserInKeycloak,updateUser,assignDefaultRole,uplaodImage
};

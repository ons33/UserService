import Competence from "../models/Competence.js";
import Experience from "../models/Experience.js";

import { Router } from "express";
const router = Router();

import User from "../models/User.js";
import {
  initializeKeycloak,
} from "../keycloack/keycloak.js";
import axios from "axios";
import twilio from "twilio";
import dotenv from "dotenv";
import Education from "../models/Education.js";
dotenv.config();
const account_sid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_TOKEN;


import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: 'dpk9mpjsd',
  api_key: '348193888992711',
  api_secret: 'qefN7t3DU47Kdpnhi9i8G56XHM0',
});

const twilioClient = twilio(account_sid, authToken);


//get Competences And Experiences By UserId
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
//get Competences Education And Experiences By UserId
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
/// verif uncite de email
const verifUnicEmail = async (req, res) => {
  const client = await initializeKeycloak();
  
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
/// verif uncite de mobil
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
//par defaut role etudiant
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
//upload image with cloudinairy
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
const checkUserRole = (req, res, next) => {
  const { roles } = req.kauth.grant.access_token.content;

  // Check if the user has the required role
  if (roles.includes("admin")) {
    return next();
  } else {
    res.status(403).send("Access Denied: Insufficient privileges.");
  }
};
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






export {
  
  getAll,
  
 
 
  checkUserRole,

  getCompetencesAndExperiencesByUserId,
  getCompetencesEducationAndExperiencesByUserId,
 
  getUserIdByEmail,verifUnicUsername,verifUnicMobile,verifUnicEmail,assignDefaultRole,uplaodImage
};

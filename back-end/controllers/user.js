const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const User = require('../models/user');
require('dotenv').config();

exports.signup = (req, res) => {
  try {
    const correctEmail = new RegExp(/[a-z|1-9]{2,}[@][a-z]{2,}[\.][a-z]{2,3}/);
    const correctPassword = new RegExp(/.{12,30}/);
    if (correctEmail.test(req.body.user_email) && correctPassword.test(req.body.user_password)) {
      const emailCryptoJs = cryptojs.HmacSHA256(req.body.user_email, 'U69vk2t3{jkjmEU]52?j?a.@932)5cP2T>26Rh)8R2#!4Ei6K4dM=!9ABx$]qEcdTTg9$24hVd6WH/-4}L=D?TsnVNt!tK?$:4Wn').toString();
      bcrypt.hash(req.body.user_password, 10)
        .then(hash => {
          const user = new User ({
          user_email: emailCryptoJs,
          user_password: hash,
          user_firstname: req.body.user_firstname,
          user_lastname: req.body.user_lastname,
          user_admin: req.body.user_admin
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Un nouvel utilisateur a été enregistré !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    } else {
      res.status(401).json( 'L\'email ou le mot de passe ne correspondent pas à des données attendues.' )
    }
  } catch {
      res.status(401).json( 'Une erreur est survenu et empêche la création d\'un nouvel uilisateur.')
  }
};

exports.login = (req, res) => {
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.user_email, 'U69vk2t3{jkjmEU]52?j?a.@932)5cP2T>26Rh)8R2#!4Ei6K4dM=!9ABx$]qEcdTTg9$24hVd6WH/-4}L=D?TsnVNt!tK?$:4Wn').toString();
    User.findOne({ user_email: emailCryptoJs })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error });
        }
        bcrypt.compare(req.body.user_password, user.user_password)
          .then(valid => {
            if (!valid) {
              return res.status(403).json({ error });
            }
            res.status(204).json({
              userId: User.user_id,
              token: jwt.sign(
                { userId: User.user_id },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
        })
      .catch(error => res.status(511).json({ error }));
  }
;

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json('disconnected !')
};

exports.accessUserProfile = (req,res) => {
  User.findOne({ user_id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(401).json({ error }));
};

/*exports.updateUser = (req, res) => {
  const newUser = { ...req.body };
    User.updateOne({ user_id: req.params.id }, { ...newUser, user_id: req.params.id })
      .then(() => res.status(200).json({ message: 'Profil correctement modifié !'}))
      .catch(error => res.status(400).json({ error }));
};*/

exports.deleteAccount = (req, res) => {
  User.findOne({ user_id: req.params.id })
  try {
    User.deleteOne({ user_id: req.params.id })
      .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
      .then(res.clearCookie('jwt'))
      .then(res.status(200).json('Déconnecté !'))
      .catch(error => res.status(400).json({ error }));
  } catch {
    res.status(500).json('Une erreur est survenue et empêche la suppression du compte.');
  }
};

/*delete : supprimer compte et ses posts et ses comments + clear cookie + retour page de login*/
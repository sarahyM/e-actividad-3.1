const router = require("express").Router();
const express = require("express");
const loginController = require("../controllers/login");


router.get("/", (req, res) => {
  console.log(`GET1`);
  res.render("login");
});


router.post("/", (req, res) => {
  loginController.login(req, res);
});

router.get("/logout", (req, res) => {
  loginController.logout(req, res);
});

module.exports = router;

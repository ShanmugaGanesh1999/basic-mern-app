/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - emailId
 *         - gender
 *         - height
 *         - weight
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: 'John Doe'
 *         emailId:
 *           type: string
 *           description: The email id the user
 *           example: 'john.doe@email.com'
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth of the user
 *           example: '1987-03-28'
 *         gender:
 *           type: string
 *           description: The gender of the user
 *           example: 'male'
 *           enum:
 *             - male
 *             - female
 *             - others
 *         height:
 *           type: integer
 *           format: int64
 *           description: The height of the user in cm
 *           example: 180
 *         weight:
 *           type: integer
 *           format: int64
 *           description: The weight of the user in kg
 *           example: 35
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /user:
 *   get:
 *     summary: Lists all the user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The list of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /user/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *   put:
 *    summary: Update the user by the id
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

const express = require("express");
const router = express.Router();

const { validate, filterOut } = require("../utilities/utils");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../models/user-model");

router.post("/", function (req, res) {
  let requestBody = req.body;
  validate({ ...requestBody, action: "create" })
    .then((record) => {
      createUser(record)
        .then((data) => {
          res.status(200).json({
            message: "User was created Successfully",
            data: data,
            status: 200,
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "User wasn't created",
            status: 403,
          });
        });
    })
    .catch((customError) => {
      res.status(403).json({
        message: customError,
        status: 403,
        error: "User validation failed",
      });
    });
});

router.get("/", function (req, res) {
  getUser()
    .then((records) => {
      res.status(200).json({
        message: "Users fetched Successfully",
        data: records,
        status: 200,
      });
    })
    .catch((error) => {
      res.status(403).json({
        message: error.message,
        error: "Error while fetching all users",
        status: 403,
      });
    });
});

router.get("/:id", function (req, res) {
  let id = req.params?.id;
  if (id) {
    getUser({ type: "id", value: id })
      .then((records) => {
        res.status(200).json({
          message: "Users fetched Successfully",
          data: records,
          status: 200,
        });
      })
      .catch((error) => {
        res.status(403).json({
          message: error.message,
          status: 403,
          error: "Error while fetching all users",
        });
      });
  } else {
    res.status(403).json({
      message: "id param is missing",
      status: 403,
    });
  }
});

router.put("/:id", function (req, res) {
  let id = req.params?.id;
  let requestBody = req.body;
  if (id && requestBody) {
    validate({ ...requestBody, id, action: "edit" })
      .then(async (record) => {
        let result = await updateUser(id, filterOut(record));
        res.status(200).json({
          message: "Users updated Successfully",
          data: result,
          status: 200,
        });
      })
      .catch((customError) => {
        res.status(403).json({
          message: customError,
          error: "User validation failed",
          status: 403,
        });
      });
  } else {
    res.status(403).json({
      message: "id param or request body is missing",
      status: 403,
    });
  }
});

router.delete("/:id", function (req, res) {
  let id = req.params?.id;
  if (id) {
    deleteUser({ id })
      .then((records) => {
        res.status(200).json({
          message: "User deleted Successfully",
          data: records,
          status: 200,
        });
      })
      .catch((error) => {
        res.status(403).json({
          message: error.message,
          error: "Error while deleting user",
          status: 403,
        });
      });
  } else {
    res.status(403).json({
      message: "id param is missing",
      status: 403,
    });
  }
});

module.exports = router;

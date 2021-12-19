const User = require("../database/models/user");
const utils = require("../../utils/utils");
const { authSchema, updateauthSchema } = require("../../utils/joivalidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const userExist = await User.findOne(
      { email: req.body.email },
      { _id: 0, email: 1 }
    );
    if (userExist) {
      res.status(409).json({
        message: "user already exist",
      });
    } else {
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
      });
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        mobile: req.body.mobile,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
      });
      const result = await authSchema.validate(req.body);
      if (!result.error) {
        user.save();
        res.status(201).json({
          message: "user created successfully",
        });
      } else {
        res.status(401).json({
          error: result.error.details[0].message,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1hr",
        }
      );
      res.status(200).json({
        message: `welcome ${user.email}`,
        token,
      });
    } else {
      res.status(401).json({
        message: "authentication failed",
      });
    }
  } else {
    res.status(401).json({
      message: "User is not present please register to login",
    });
  }
};

exports.userList = async (req, res) => {
  try {
    const allusers = await User.find({});
    if (allusers && allusers.length) {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const results = utils.pagination(allusers, page, limit);

      res.status(201).json({
        message: "list of all users",
        results,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = req.body;
    const result = await updateauthSchema.validate(req.body);
    if (!result.error) {
      const result = await User.findByIdAndUpdate(_id, updates, { new: true });
      res.status(201).json({
        message: "User updated successfully",
        updatedUser: result,
      });
    } else {
      res.status(401).json({
        error: result.error.details[0].message,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.searchData = async (req, res) => {
  try {
    const key = req.params.key;
    const findData = await User.find({
      $or: [
        { email: { $regex: key } },
        { firstname: { $regex: key } },
        { lastname: { $regex: key } },
        { mobile: { $regex: key } },
      ],
    });
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    if (findData && findData.length) {
      const results = utils.pagination(findData, page, limit);
      res.status(201).json({
        message: "search result",
        results,
      });
    } else {
      res.status(401).json({
        message: "match not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

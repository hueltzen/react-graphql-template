const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const checkAuth = require("../../utils/checkAuth");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getUsers(_, __, context) {
      const user = checkAuth(context);

      try {
        const users = await User.find();

        if (users) {
          return users;
        }

        throw new Error("No users found.");
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    async login(_, { loginInput: { username, password } }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        errors.general = "Wrong username and password.";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "Wrong username and password.";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong username and password.";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken.", {
          error: {
            username: "This username is taken.",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
      });

      const result = await newUser.save();
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};

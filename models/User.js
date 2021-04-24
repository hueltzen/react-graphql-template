const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);

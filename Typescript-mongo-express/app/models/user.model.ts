import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";


//YEETED FROM MY OLD PROJECT
interface User extends Document {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  profile_picture: string;
  language: string;
  bio: string;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
  preferences: {
    app_theme: string;
    default_view: string;
  };
  verifyConfirmPassword: (password: stringW, confirmPassword: string) => boolean;
  verifyProp: (field: string, value: string) => boolean;
  generateHashPassword: ({
    password,
    saltRounds,
  }: {
    password: string;
    saltRounds?: number;
  }) => string;
  verifyPassword: (password: string) => boolean;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      validate: {
        validator: function (v: any) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
      },
    },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: false },
    profile_picture: { type: String },
    language: { type: String, default: "en" },
    bio: { type: String, required: false },
    last_login: { type: Date },
    preferences: {
      app_theme: { type: String, default: "light" },
      default_view: { type: String, default: "list" },
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  },
);

userSchema.methods.verifyConfirmPassword = function (
  password: string,
  confirmPassword: string,
) {
  return password === confirmPassword;
};
userSchema.methods.verifyProp = function (field: string, value: string) {
  return this[field] === value;
};
userSchema.methods.generateHashPassword = function ({
  password,
  saltRounds = 10,
}: {
  password: string;
  saltRounds?: number;
}) {
  return bcrypt.hashSync(password, saltRounds);
};
userSchema.methods.verifyPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};
userSchema.pre<User>("save", function (next) {
  if (this.isModified("password")) {
    this.password = this.generateHashPassword({ password: this.password });
  }
  next();
});

const User = mongoose.model<User>("User", userSchema);
User.createIndexes();

export default User;

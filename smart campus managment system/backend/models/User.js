const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define department structure
const DEPARTMENTS = {
  "School of Engineering": [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Computer Engineering",
    "Chemical Engineering",
  ],
  "School of Business": [
    "Business Administration",
    "Finance",
    "Marketing",
    "Accounting",
    "Management",
  ],
  "School of Science": [
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
  ],
  "School of Arts and Humanities": [
    "History",
    "Literature",
    "Languages",
    "Philosophy",
    "Cultural Studies",
  ],
  "School of Social Sciences": [
    "Economics",
    "Psychology",
    "Sociology",
    "Political Science",
    "Anthropology",
  ],
  "School of Law": ["Law", "Criminal Justice"],
  "School of Medicine & Health Sciences": [
    "Medicine",
    "Nursing",
    "Public Health",
    "Pharmacy",
  ],
};

const mainDepartments = Object.keys(DEPARTMENTS);
const subDepartments = Object.values(DEPARTMENTS).flat();

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "lecturer", "student"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    mainDepartment: {
      type: String,
      enum: [...mainDepartments, "Administration"],
      default: function () {
        return this.role === "admin" ? "Administration" : "School of Science";
      },
      validate: {
        validator: function (v) {
          if (this.role === "admin") {
            return v === "Administration";
          }
          return mainDepartments.includes(v);
        },
        message: (props) =>
          `${props.value} is not a valid main department for this role`,
      },
    },
    subDepartment: {
      type: String,
      enum: [...subDepartments, "Administration"],
      default: function () {
        return this.role === "admin" ? "Administration" : "Computer Science";
      },
      validate: {
        validator: function (v) {
          // For admin role, only allow "Administration"
          if (this.role === "admin") {
            return v === "Administration";
          }

          // For non-admin roles during document creation
          if (this.isNew) {
            const validSubDepts = DEPARTMENTS[this.mainDepartment] || [];
            return validSubDepts.includes(v);
          }

          // For updates, we'll do the validation in the update endpoint
          return true;
        },
        message: function (props) {
          if (this.role === "admin") {
            return "Admin users must have 'Administration' as their sub-department";
          }
          if (this.isNew) {
            const validSubDepts = DEPARTMENTS[this.mainDepartment] || [];
            return `${props.value} is not a valid sub-department for ${
              this.mainDepartment
            }. Valid options are: ${validSubDepts.join(", ")}`;
          }
          return `${props.value} is not a valid sub-department`;
        },
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Add toJSON option to include virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Export departments for use in other parts of the application
UserSchema.statics.DEPARTMENTS = DEPARTMENTS;

// Add virtual for id that returns _id as string
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Add virtual for full department name
UserSchema.virtual("department").get(function () {
  if (this.role === "admin") {
    return "Administration";
  }
  return `${this.mainDepartment} - ${this.subDepartment}`;
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Set default departments for admin role
UserSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.mainDepartment = "Administration";
    this.subDepartment = "Administration";
  }
  next();
});

// Add middleware to handle department updates when role changes
UserSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    if (this.role === "admin") {
      this.mainDepartment = "Administration";
      this.subDepartment = "Administration";
    } else if (this.mainDepartment === "Administration") {
      // If changing from admin to another role, set default departments
      this.mainDepartment = "School of Science";
      this.subDepartment = "Computer Science";
    }
  }
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add comparePassword as an alias for matchPassword for backward compatibility
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add static method to validate department combination
UserSchema.statics.validateDepartments = function (
  mainDepartment,
  subDepartment,
  role
) {
  if (role === "admin") {
    return (
      mainDepartment === "Administration" && subDepartment === "Administration"
    );
  }

  if (!mainDepartments.includes(mainDepartment)) {
    return false;
  }

  const validSubDepts = DEPARTMENTS[mainDepartment] || [];
  return validSubDepts.includes(subDepartment);
};

module.exports = mongoose.model("User", UserSchema);

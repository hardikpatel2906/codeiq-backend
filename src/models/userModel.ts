import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
    fullName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    streak: Number,
    lastLogin: Date,
    comparePassword(candidatePassword: string): Promise<boolean>;
    updateStreak(): Promise<boolean>;
};

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: null
    },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.updateStreak = async function () {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastLogin = this.lastLogin ? new Date(this.lastLogin).setHours(0, 0, 0, 0) : null;

    if (!lastLogin || lastLogin < today - 86400000) {
        this.streak = 1; // Reset if missed a day
    } else if (lastLogin === today - 86400000) {
        this.streak += 1; // Increase if logged in consecutively
    }

    this.lastLogin = today;
    await this.save();
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
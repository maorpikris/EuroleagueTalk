import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    username: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
    googleId?: string;
    refreshToken?: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    avatarUrl: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    refreshToken: { type: String },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);

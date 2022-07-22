import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true },
    email: {type: String, require: true, unique: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    password: {type: String, require: true }
});

userSchema.pre('save', async function(next){
    const user = this;

    if(user.password && user.isNew) {
        const saltRounds = 10;

        user.password = await bcrypt.hash(
            user.password, saltRounds
            )
    }

    next();
})

const User = mongoose.model('User', userSchema);

export default User;
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
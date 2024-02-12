import { Schema, model, Types} from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    likes: [{
        type: Types.ObjectId,
        ref: 'Product'
    }]
})

const User = model('User', UserSchema, 'User');

export default User;
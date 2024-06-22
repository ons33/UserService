import mongoose from "mongoose";

const imageUsersSchema = new mongoose.Schema({
    userId: {
        type: String, // Modifier le type de userId pour accepter une chaîne
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ImageUsers = mongoose.model("ImageUsers", imageUsersSchema);

export default ImageUsers;
import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream Api key or secret is missing")
}

// allows us to communicate with the stream
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // upsert update if it exists or create if it doesn't exist
        return userData;
    } catch (error) {
        console.error("Error upserting Stream User", error.message);
        
    }
}

export const generateStreamToken = (userID) => {
    try {
        // ensure userID is a string
        const userIdStr = userID.toString();
        return streamClient.createToken(userIdStr); // create a token for the user
    } catch (error) {
        console.error("Error generating Stream Token", error.message);
        
    }
};
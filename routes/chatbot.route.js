import express from 'express'
import { predictDisease } from '../controllers/predictDisease.controller.js';
import converse from '../controllers/groq.controller.js';
import { verifyJWT } from '../middleware/auth.middlware.js';



const chatbotRouter = express.Router()

// chatbotRouter.post('/', async(req, res) => {
//     const { text } = req.body;
//     try{
//         const result = await predictDisease(text);
//         res.status(200).json(result);
//     }
//     catch(err){
//         res.status(500).json({ error: 'Error predicting disease' });
//     }
// });



function responseCheck(response){
    if(response.includes("Here is a summary of your symptoms and information")){
        return true;
    }
    return false;
}
// verifyJWT,
chatbotRouter.post('/converse', async(req, res) => {
    const { newMessage, messages } = req.body;
    // console.log("yaha hu: ", newMessage, messages);
    try{

        const response = await converse(newMessage, messages);
        // console.log(response)

        if(responseCheck(response[response.length-1].content)){
            console.log("predicting disease.....................");
            console.log(response[response.length-1].content);
            const result = await predictDisease(response[response.length-1].content);
            let temp = "";
            for(let i = 0; i < result.length; i++){
                if(result[i] === ':'){
                    break;
                }
                temp += result[i];
            }
            response[response.length-1].content += "So according to the symptoms you have provided, you might have " + temp;
            res.status(200).json(response);
            return;
        }
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Error conversing' });
    }
});

export default chatbotRouter
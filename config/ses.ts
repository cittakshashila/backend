import dotenv from "dotenv"
dotenv.config();
import * as AWS from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: process.env.REGION || '',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    },
});

export const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS },
});


export default {transporter};

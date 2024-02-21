import { Request, Response } from "express";
import { pool } from "../../config/db.js";
import { transporter } from "../../config/ses.js";
import { payment , emergency } from "../queries/sesQueries.js";
import QRCode from "qrcode";
import nodeHtmlToImage from 'node-html-to-image'
import dotenv from "dotenv"
dotenv.config();

const Paid = async (req: Request, res: Response) => {
    const {type,email} = req.body;
    const client = await pool.connect();
    const result = await client.query(payment, [email]);
    const events = result.rows;
    client.release();
    const curdate = new Date(Date.now());
    const qr = await QRCode.toDataURL(email);
    const ticket = await nodeHtmlToImage({
        html:`<html>
           <head>
              <style>
                 body {
                 width: 930px;     
                 height: 356.77px;
                     background: black;
                 }
              </style>
           </head>
           <body style="font-family: monospace; font-weight: 500;">
              <div style="display: flex;max-width: 930px;max-height: 356.77px;">
                 <div style="width:675px;height:356.77px;border-right:2px dashed #a0a0a0;border-radius: 15px;background: url('https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tick.png');">
                    <p style="margin:50px 0px 0px 25px;font-size:30px">
                       ${events[0].name}
                    </p>
                    <p style="font-size: 15px;margin: 6px 0px 0px 30px;">Boarding<br/>Date: ${curdate}</p>
                    <p style="font-size: 15px;margin: 8px 0px 0px 30px;">from ${events[0].clg_name} to CIT</p>
                    <p style="font-size: 30px;margin: 60px 0px 0px 30px;">${events[0].id}</p>
                    <p style="font-size: 30px;margin: 40px 0px 0px 30px;">${type}</p>
                 </div>
                 <div style="display: flex;background: white; flex-direction: column;border-radius: 15px;align-items: center;width: 255px;max-height: 356.77px;padding-top: 50px;justify-content: space-evenly;">
                    <img alt="qr" width="207.29px" height="207.29px" src="${qr}">
                    <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo" width="165px" height="38px">
                 </div>
              </div>
           </body>
        </html>`,
        content: { qr: qr },
    });
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: email,
        subject: "Your Payment For Takshashila Was successfull",
        html: `<html>
           <body style="width: 900px; padding: 0; margin: 0; box-sizing: border-box">
              <div style="background: gray; padding: 4%">
                 <table id="content" colspan="4" style="background: white; width: 100%">
                    <tr style="height: 15vh">
                       <td>&nbsp;</td>
                       <td colspan="2" align="center">
                          <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo"/>
                       </td>
                       <td>&nbsp;</td>
                    </tr>
                    <tr style="font-size: 1rem">
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p>body</p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">6969696969</p>
                             <p style="margin: 2px">4204204204</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>email</b></p>
                             <p style="margin: 2px">support@cittakshashila.in</p>
                             <p style="margin: 2px">coordinators@cittakshashila.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>visit us</b></p>
                             <p style="margin: 2px">www.cittakshashila.in</p>
                             <p style="margin: 2px">www.bitspace.org.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="margin: 4px"><b>socials</b></p>
                          <div style="display: flex;justify-content: left;margin: 4px;text-align: justify;">
                             <a href="https://www.facebook.com/cittakshaskila" >
                             <img alt="F" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/fb.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.github.com/bitspaceorg" >
                             <img alt="G" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/github.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.instagram.com/cittakshaskila" >
                             <img alt="I" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                             <a href="https://twitter.com/cittakshashila" >
                             <img alt="T" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/x.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                          </div>
                       </td>
                    </tr>
                    <tr>
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="text-align: center">
                             © 2024 Takshashila. All rights reserved.
                          </p>
                       </td>
                    </tr>
                 </table>
              </div>
           </body>
        </html>
        `,
        attachments: [
            {
                filename: "ticket.png",
                content: ticket.toString("base64"),
                encoding: "base64",
                contentType: "image/png",
            },
        ],
    }, (err , info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error sending email");
        } else {
            console.log(info);
            res.status(200).send("Email sent successfully");
        }
    });
}

const Registered = async (req: Request, res: Response) => {
    const {name, email} = req.body;
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: email,
        subject: "Your Registration confirmation for Takshashila 2024",
        html:`
        <html>
           <body style="width: 900px; padding: 0; margin: 0; box-sizing: border-box">
              <div style="background: gray; padding: 4%">
                 <table id="content" colspan="4" style="background: white; width: 100%">
                    <tr style="height: 15vh">
                       <td>&nbsp;</td>
                       <td colspan="2" align="center">
                          <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo"/>
                       </td>
                       <td>&nbsp;</td>
                    </tr>
                    <tr style="font-size: 1rem">
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p>Hi ${name}, 
                            <br><br>
                            Congratulations! We are thrilled to inform you that your registration for Takshashila has been successfully received. We are delighted to have you as a participant in our upcoming college cultural extravaganza. To ensure a smooth and enjoyable experience for everyone, please take note of the following rules, regulations, and instructions: 
                            <br><br>
                            <b>Rules and Regulations:</b> 
                            <li><b>Punctuality:</b> Please arrive at least 30 minutes before the scheduled start time of your registered events.</li> 
                            <li><b>Dress Code:</b> Ensure that you adhere to the specified dress code for each event. </li>
                            <li><b>Identification:</b> Carry a valid college ID card or any government-issued ID for verification purposes.</li>
                            <br>
                            <b>Instructions for Participants:</b>
                            <li>Familiarize yourself with the event schedule and venue layout. 
                            <li>If you have any specific requirements or concerns, please inform the event coordinators in advance. 
                            <li>Follow all safety protocols and guidelines provided by the event organizers on venue.

                            For any queries or need any further assistance, feel free to reach out to our event coordinators. Once again, congratulations on your successful registration! We look forward to your enthusiastic participation and a memorable experience at Takshashila. 

                            Best Regards, 
                            Takshashila team
                          </p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">6369702802</p>
                             <p style="margin: 2px">7010701974</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>email</b></p>
                             <p style="margin: 2px">takshashila@citchennai.net</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>visit us</b></p>
                             <p style="margin: 2px">www.cittakshashila.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="margin: 4px"><b>socials</b></p>
                          <div style="display: flex;justify-content: left;margin: 4px;text-align: justify;">
                             <a href="https://www.facebook.com/cittakshaskila" >
                             <img alt="F" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/fb.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.github.com/bitspaceorg" >
                             <img alt="G" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/github.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.instagram.com/cittakshaskila" >
                             <img alt="I" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                             <a href="https://twitter.com/cittakshashila" >
                             <img alt="T" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/x.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                          </div>
                       </td>
                    </tr>
                    <tr>
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="text-align: center">
                             © 2024 Takshashila. All rights reserved.
                          </p>
                       </td>
                    </tr>
                 </table>
              </div>
           </body>
        </html>
        `,
    }, (err , info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error sending email");
        } else {
            console.log(info);
            res.status(200).send("Email sent successfully");
        }
    });
}

const Emergency = async (req: Request, res: Response) => {
    const {event_id,body} = req.body;
    const client = await pool.connect();
    const result = await client.query(emergency, [event_id]);
    const events = result.rows;
    client.release();
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: process.env.VERIFIED_EMAIL,
        bcc: events[0].emails,
        subject: `Announcement Regarding ${event_id}`,
        html: `<html>
           <body style="width: 900px; padding: 0; margin: 0; box-sizing: border-box">
              <div style="background: gray; padding: 4%">
                 <table id="content" colspan="4" style="background: white; width: 100%">
                    <tr style="height: 15vh">
                       <td>&nbsp;</td>
                       <td colspan="2" align="center">
                          <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo"/>
                       </td>
                       <td>&nbsp;</td>
                    </tr>
                    <tr style="font-size: 1rem">
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p>${body}</p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">6969696969</p>
                             <p style="margin: 2px">4204204204</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>email</b></p>
                             <p style="margin: 2px">support@cittakshashila.in</p>
                             <p style="margin: 2px">coordinators@cittakshashila.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>visit us</b></p>
                             <p style="margin: 2px">www.cittakshashila.in</p>
                             <p style="margin: 2px">www.bitspace.org.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="margin: 4px"><b>socials</b></p>
                          <div style="display: flex;justify-content: left;margin: 4px;text-align: justify;">
                             <a href="https://www.facebook.com/cittakshaskila" >
                             <img alt="F" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/fb.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.github.com/bitspaceorg" >
                             <img alt="G" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/github.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.instagram.com/cittakshaskila" >
                             <img alt="I" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                             <a href="https://twitter.com/cittakshashila" >
                             <img alt="T" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/x.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                          </div>
                       </td>
                    </tr>
                    <tr>
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="text-align: center">
                             © 2024 Takshashila. All rights reserved.
                          </p>
                       </td>
                    </tr>
                 </table>
              </div>
           </body>
        </html>
        `,
    }, (err , info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error sending email");
        } else {
            console.log(info);
            res.status(200).send("Email sent successfully");
        }
    });
}

const Sendotp = async (req: Request, res: Response) => {
    const {otp,email} = req.body;
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: process.env.VERIFIED_EMAIL,
        bcc: email,
        subject: `OTP`,
        html: `<html>
           <body style="width: 900px; padding: 0; margin: 0; box-sizing: border-box">
              <div style="background: gray; padding: 4%">
                 <table id="content" colspan="4" style="background: white; width: 100%">
                    <tr style="height: 15vh">
                       <td>&nbsp;</td>
                       <td colspan="2" align="center">
                          <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo"/>
                       </td>
                       <td>&nbsp;</td>
                    </tr>
                    <tr style="font-size: 1rem">
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="text-align:justify">Your OTP for Account Verification <br><br><b style="font-size:90px">${otp}</b></p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">6969696969</p>
                             <p style="margin: 2px">4204204204</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>email</b></p>
                             <p style="margin: 2px">support@cittakshashila.in</p>
                             <p style="margin: 2px">coordinators@cittakshashila.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>visit us</b></p>
                             <p style="margin: 2px">www.cittakshashila.in</p>
                             <p style="margin: 2px">www.bitspace.org.in</p>
                          </div>
                       </td>
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="margin: 4px"><b>socials</b></p>
                          <div style="display: flex;justify-content: left;margin: 4px;text-align: justify;">
                             <a href="https://www.facebook.com/cittakshaskila" >
                             <img alt="F" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/fb.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.github.com/bitspaceorg" >
                             <img alt="G" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/github.png" style="width: 15px; height: 15px; padding: 2px" />
                             </a>
                             <a href="https://www.instagram.com/cittakshaskila" >
                             <img alt="I" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                             <a href="https://twitter.com/cittakshashila" >
                             <img alt="T" src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/x.png" style="width: 15px; height: 15px; padding: 2px"/>
                             </a>
                          </div>
                       </td>
                    </tr>
                    <tr>
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                          <p style="text-align: center">
                             © 2024 Takshashila. All rights reserved.
                          </p>
                       </td>
                    </tr>
                 </table>
              </div>
           </body>
        </html>
        `,
    }, (err , info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error sending email");
        } else {
            console.log(info);
            res.status(200).send("Email sent successfully");
        }
    });
}

export {Registered, Paid, Emergency,Sendotp };

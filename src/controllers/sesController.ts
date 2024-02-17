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
                 <div style="width:675px;height:356.77px;border-right:2px dashed #a0a0a0;border-radius: 15px;background: url('https://cdn.discordapp.com/attachments/1107694068181512262/1206475406027268126/tick.png?ex=65dc24c8&is=65c9afc8&hm=c12ab73b77031862ad6d1ce28bca53129eb4cec2acd368c0d11bbd879bb5c570&');">
                    <p style="margin:50px 0px 0px 25px;font-size:30px">
                       ${name}
                    </p>
                    <p style="font-size: 15px;margin: 6px 0px 0px 30px;">Boarding<br/>Date: ${curdate}</p>
                    <p style="font-size: 15px;margin: 8px 0px 0px 30px;">from ${clg_name} to CIT</p>
                    <p style="font-size: 30px;margin: 60px 0px 0px 30px;">${user_id}</p>
                    <p style="font-size: 30px;margin: 40px 0px 0px 30px;">${type}</p>
                 </div>
                 <div style="display: flex;background: white; flex-direction: column;border-radius: 15px;align-items: center;width: 255px;max-height: 356.77px;padding-top: 50px;justify-content: space-evenly;">
                    <img alt="qr" width="207.29px" height="207.29px" src="${qr}">
                    <img src="https://cdn.discordapp.com/attachments/1107694068181512262/1204796893964804146/Group_16.png?ex=65d6098b&is=65c3948b&hm=e1f194b427dcd5e102ff397ba90df6eb94d72f9e86bc66e655d3f43544ed1122&" alt="logo" width="165px" height="38px">
                 </div>
              </div>
           </body>
        </html>`,
        content: { qr: qr },
    });
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: email,
        subject: "Your Payment Was successfull",
        text: "Test",
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
                  <img src="https://cdn.discordapp.com/attachments/1107694068181512262/1204796893964804146/Group_16.pngex=65d6098b&is=65c3948b&hm=e1f194b427dcd5e102ff397ba90df6eb94d72f9e86bc66e655d3f43544ed1122&" alt="logo"/>
               </td>
               <td>&nbsp;</td>
            </tr>
            <tr style="font-size: 1rem">
               <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em">
                  <p>
                     Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                     reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
                     ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
                     Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet
                     voluptate voluptate dolor minim nulla est proident. Nostrud
                     officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex
                  </p>
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
                     <a href="https://www.facebook.com/cittakshaskila" alt="F">
                     <img src="fb.png" style="width: 15px; height: 15px; padding: 2px" />
                     </a>
                     <a href="https://www.github.com/bitspaceorg" alt="G">
                     <img src="github.png" style="width: 15px; height: 15px; padding: 2px" />
                     </a>
                     <a href="https://www.instagram.com/cittakshaskila" alt="I">
                     <img src="insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                     </a>
                  </div>
               </td>
            </tr>
            <tr style="">
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
    const {event,body} = req.body;
    const client = await pool.connect();
    const result = await client.query(emergency, [event]);
    const events = result.rows;
    client.release();
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: process.env.VERIFIED_EMAIL,
        bcc: events,
        subject: `Announcement Regarding ${event}`,
        html: `<html>
   <body style="width: 900px; padding: 0; margin: 0; box-sizing: border-box">
      <div style="background: gray; padding: 4%">
         <table id="content" colspan="4" style="background: white; width: 100%">
            <tr style="height: 15vh">
               <td>&nbsp;</td>
               <td colspan="2" align="center">
                  <img src="https://cdn.discordapp.com/attachments/1107694068181512262/1204796893964804146/Group_16.pngex=65d6098b&is=65c3948b&hm=e1f194b427dcd5e102ff397ba90df6eb94d72f9e86bc66e655d3f43544ed1122&" alt="logo"/>
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
                     <a href="https://www.facebook.com/cittakshaskila" alt="F">
                     <img src="fb.png" style="width: 15px; height: 15px; padding: 2px" />
                     </a>
                     <a href="https://www.github.com/bitspaceorg" alt="G">
                     <img src="github.png" style="width: 15px; height: 15px; padding: 2px" />
                     </a>
                     <a href="https://www.instagram.com/cittakshaskila" alt="I">
                     <img src="insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                     </a>
                     <a href="https://www.instagram.com/cittakshaskila" alt="I">
                     <img src="insta.png" style="width: 15px; height: 15px; padding: 2px"/>
                     </a>
                  </div>
               </td>
            </tr>
            <tr style="">
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

export {Registered, Paid, Emergency };

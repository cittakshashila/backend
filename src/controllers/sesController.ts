import { Request, Response } from "express";
import { pool } from "../../config/db.js";
import { transporter } from "../../config/ses.js";
import { payment , emergency } from "../queries/sesQueries.js";
import QRCode from "qrcode";
import dotenv from "dotenv"
dotenv.config();

const Paid = async (req: Request, res: Response) => {
    if(!req.body.admin.is_admin)
      return res
        .status(401)
        .json({ statusCode: 401, body: { message: "Unauthorized Request" } });
    const { type, email } = req.body;
    const client = await pool.connect();
    const result = await client.query(payment, [email]);
    const events = result.rows;
    client.release();
    const curdate = new Date(Date.now());
    const qr = await QRCode.toDataURL(email);
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: email,
        subject: "Your Payment For Takshashila Was successfull",
        html: `<html>
           <body style="width: 1200px; padding: 0; margin: 0; box-sizing: border-box">
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
                      <p>
                        Greetings,
                        <br><br>
                        Welcome aboard the Takshashila express! 🚂 Today's the day we embark on a journey of discovery, laughter, and maybe a few surprises along the way. As you step into our virtual wonderland of knowledge, here's a little guide to make the most of your experience.

                        <li> Please find your boarding pass attached with this mail</li>
                        <li> This pass grants you entry to all of your registered events</li>
                        <li> Check the website for the rules and regulation for each event</li>

                        Get ready to immerse yourself in a cultural extravaganza at Takshashila! This event promises to be a vibrant blend of entertainment and enlightenment – Let’s enjoy!
                        <br><br>
                        Welcome,
                        <br><br>
                        Team TK
                          </p>
                       <div style="font-family: monospace; font-weight: 500;width:930px;height:356.77px;">
                          <div style="display: flex;max-width: 930px;max-height: 356.77px;">
                             <div style="width:675px;height:356.77px;border-right:2px dashed #a0a0a0;border-radius: 15px;background: url('https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tick.png');">
                                <p style="margin:50px 0px 0px 25px;font-size:30px">
                                   ${events[0].name}
                                </p>
                                <p style="font-size: 15px;margin: 6px 0px 0px 30px;">Boarding<br/>Date: ${curdate}</p>
                                <p style="font-size: 15px;margin: 8px 0px 0px 30px;">from ${events[0].clg_name} to CIT</p>
                                <p style="font-size: 30px;margin: 50px 0px 0px 30px;">${events[0].id.slice(0,8)}</p>
                                <p style="font-size: 30px;margin: 30px 0px 0px 30px;">${type}</p>
                             </div>
                             <div style="background: #ececec;border-radius: 15px;align-items: center;width: 255px;max-height: 356.77px;padding-top: 50px;">
                                <p style="padding:0px 0px 0px 23.85px">
                                <img alt="qr" width="207.29px" height="207.29px" src="cid:qr">
                                </p>
                                <p style="padding:0px 0px 0px 45px">
                                <img src="https://raw.githubusercontent.com/cittakshashila/backend/ses/docs/asserts/tklogo.png" alt="logo" width="165px" height="38px">
                                </p>
                             </div>
                          </div>
                       <div>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">9150472413</p>
                             <p style="margin: 2px">8015929273</p>
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
                             <a href="https://www.github.com/cittakshashila" >
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
                filename: "qr.png",
                path: qr,
                cid: "qr",
            },
        ],
    }, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ statusCode: 500, body: { message: "Error sending email" } });
        } else {
          return res
            .status(200)
            .json({ statusCode: 200, body: { message: "Email sent successfully" } });
        }
    });
}

const Registered = async (req: Request, res: Response) => {
    const { name } = req.body;
    const { email } = req.body.user;
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
                            Congratulations!
                            We are thrilled to inform you that your registration for Takshashila has been successfully received. We
                            are delighted to have you as a participant in our upcoming college cultural extravaganza. To ensure a
                            smooth and enjoyable experience for everyone, please take note of the following instructions:
                            <br><br>
                            <li>Payment for the event will be done only on-spot.</li>
                            <li>Please arrive at least 30 minutes before the scheduled start time of your registered events.</li>
                            <li>Kindly ensure that you adhere to all the eligibility criteria mentioned and the rules and
                            regulations of the registered event.</li>
                            <li>Participants are expected to conduct themselves professionally and ensure that you adhere to the
                            specified dress code for each event (if applicable).</li>
                            <li>Participants must compulsorily carry a valid college ID card for verification purposes.</li>
                            <li>Familiarize yourself with the event schedule and venue layout.</li>
                            <br>
                            If you have any specific requirements or concerns, please inform the event coordinators in advance.
                            Follow all safety protocols and guidelines provided by the event organizers at the venue. For any
                            queries or need any further assistance, feel free to reach out to our event coordinators.
                            We look forward to your enthusiastic participation and a memorable experience at Takshashila.
                            <br><br>
                            Best Regards,
                            <br>
                            Takshashila team
                          </p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">9150472413</p>
                             <p style="margin: 2px">8015929273</p>
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
                             <a href="https://www.github.com/cittakshashila" >
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
    }, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ statusCode: 500, body: { message: "Error sending email" } });
        } else {
          return res
            .status(200)
            .json({ statusCode: 200, body: { message: "Email sent successfully" } });
        }
    });
}

const Emergency = async (req: Request, res: Response) => {
    const { event_id, body,subject } = req.body;
    console.log(req.body.admin)
    if((req.body.admin.is_event_admin && (req.body.admin.events_id.includes(event_id)))
        || (req.body.admin.is_super_admin)){
      const client = await pool.connect();
      const result = await client.query(emergency, [event_id]);
      const events = result.rows;
      client.release();
      let users_email : Array<string> = []
      events.forEach(ele =>{ users_email.push(ele.user_email) })
      transporter.sendMail({
          from: process.env.VERIFIED_EMAIL,
          to: process.env.VERIFIED_EMAIL,
          bcc: users_email,
          subject: subject,
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
                               <p style="margin: 2px">9150472413</p>
                               <p style="margin: 2px">8015929273</p>
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
                               <a href="https://www.github.com/cittakshashila" >
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
      }, (err) => {
          if (err) {
              return res
                .status(500)
                .json({ statusCode: 500, body: { message: "Error Sending email" } });
          } else {
              return res
                .status(200)
                .json({ statusCode: 200, body: { message: "Email sent successfully" } });
          }
      });
    }else{
      return res
        .status(401)
        .json({ statusCode: 401, body: { message: "Unauthorized Request" } });
    }
}

const Sendotp = async (req: Request, res: Response) => {
    const { otp } = req.body;
    const { email } = req.body.user
    transporter.sendMail({
        from: process.env.VERIFIED_EMAIL,
        to: email,
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
                       <td colspan="4" style="font-family: monospace; vertical-align: center; padding: 2em;">
                            <p> Greetings,
                                <br><br>
                                Congratulations! 🎊 You're officially on the guest list for Takshashila – where knowledge meets laughter, and fun gets a degree in awesomeness! 🎓
                                To make sure it's really you and not just a very talented monkey with a typewriter who registered (hey, it happens), please verify with this One-Time Passcode (OTP)
                                <br><br>
                                <p style="text-align:center">
                                <b style="font-size:90px;">${otp}</b>
                                </p>
                                <br><br>
                                Once you're in, prepare to be dazzled by amazing minds, epic conversations, and maybe even a spontaneous dance-off (hey, it's been known to happen). 🕺
                                See you at Takshashila!
                                <br><br>
                                Cheers,
                                <br><br>
                                Team TK
                            </p>
                       </td>
                    </tr>
                    <tr style="vertical-align: top">
                       <td style="font-family: monospace; vertical-align: center; padding: 2em">
                          <div style="text-align: justify">
                             <p style="margin: 4px"><b>contact</b></p>
                             <p style="margin: 2px">9150472413</p>
                             <p style="margin: 2px">8015929273</p>
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
                             <a href="https://www.github.com/cittakshashila" >
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
    }, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ statusCode: 500, body: { message: "Error Sending Email" } });
        } else {
          return res
            .status(200)
            .json({ statusCode: 200, body: { message: "Email sent successfully" } });
        }
    });
}

export {Registered, Paid, Emergency,Sendotp };

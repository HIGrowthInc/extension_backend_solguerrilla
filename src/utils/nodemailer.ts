const nodemailer = require("nodemailer");
export const sendEmail = async (email:string,subject:string,text:string)=>{
   
    try {        
        const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                user: "veniaminit9@gmail.com",
                pass: "xkemqmtklxqirgkz",
            },
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
}

const nodeoutlook = require("nodejs-nodemailer-outlook");
export const EmailContent = async (email:string,subject:string,text:string)=>{
   
    nodeoutlook.sendEmail({
        auth: {
            user: "accounts@solguerrilla.com",
            pass: "C2WzXO8q@21#5g!*"
        },
        from: 'accounts@solguerrilla.com',
        to: email,
        subject: subject,
        html: text,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    
    
    );
}


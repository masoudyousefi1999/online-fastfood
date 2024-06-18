import * as nodemailer from "nodemailer";
export default class SendGmail {
  public transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "masoudyousefi1999@gmail.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  public async sendMail(username: string, email: string, code: number) {
    const info = await this.transporter.sendMail({
      from: "MasoudYousefi",
      to: email,
      subject: "verification code",
      text: ` عزیز با تشکر از انتخاب شما ${username}`,
      html: `
      <h1>${username} کاربر عزیز  </h1>
      <h2><b> ${code} </b> : کد تایید شما  </h2>
      <h4>🤤 با تشکر از انتخاب شما امیدواریم از طعم های جدید لذت ببرید </h4>`,
    });
    return info;
  }
}

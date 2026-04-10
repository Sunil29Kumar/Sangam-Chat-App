import dotenv from "dotenv";
dotenv.config();

import { sendMail } from "./index.js";

import { sendOTPTemplate } from "./templates/sendOTP.js";

export const sendMailEvent = async ({
    type,
    user,
    meta = {},
}) => {

    const map = {
        SEND_OTP: {
            from: `Sangam <noreply@sangam.bastastorage.me>`,
            subject: "Your One-Time Password (OTP) - Sangam",
            template: sendOTPTemplate
        },
        // WELCOME: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: "Welcome to Sangam! Let's Get Started",
        //     template: welcomeTemplate,
        // },
        // PASSWORD_RESET: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: "Password Reset Request - Sangam",
        //     template: passwordResetTemplate,
        // },
        // PASSWORD_CHANGED: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: "Your Password Has Been Changed - Sangam",
        //     template: passwordChangedTemplate,
        // },
        // FRIEND_INVITE: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: `${meta.inviterName} has invited you to join Sangam!`,
        //     template: friendInviteTemplate,
        // },
        // GROUP_INVITE: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: `${meta.inviterName} has invited you to join the group "${meta.groupName}" on Sangam!`,
        //     template: groupInviteTemplate,
        // },
        // NEW_DEVICE_LOGIN: {
        //     from: `Sangam <sangam.bastastorage.me>`,
        //     subject: "New Login Detected - Sangam",
        //     template: newDeviceLoginTemplate,
        // }
    };

    const event = map[type];
    if (!event) return;

    await sendMail({
        from: event.from,
        to: user?.email || user,
        subject: event.subject,
        html: event.template({ ...meta }),
    });
};

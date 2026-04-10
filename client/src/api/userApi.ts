import axios from "./axios.js"


export const getUserAuth = async () => await axios.get(`/user`)


// export const updateUserNameEmailAuth = async (name, email) =>
//     await axios.patch(`/user/update-profile`, { name, email })

// export const changePasswordAuth = async (oldPassword, newPassword) =>
//     await axios.patch(`/user/change-password`, { oldPassword, newPassword })

// export const updateUserAvatarAuth = async (avatarUrl) =>
//     await axios.patch(`/user/update-avatar`, { avatarUrl })
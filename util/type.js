const picUrl = 'http://www.soupjian.work:3100/defaultImg/picUrl.jpg'
const bgImg = 'http://www.soupjian.work:3100/defaultImg/bgImg.jpg'

const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
const emailReg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

module.exports = {
    picUrl,
    bgImg,
    phoneReg,
    emailReg
};
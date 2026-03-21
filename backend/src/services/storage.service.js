const {ImageKit} = require('@imagekit/nodejs')

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadFile = async (buffer) => {
    try {
        const result = await client.files.upload({
            file: buffer.toString('base64'),
            folder: 'social-post-app/images',
            fileName: `image-${Date.now()}.jpg`
        })
        return result
    } catch (err) {
        console.error('Image upload error: ', err)
        return null
    }
}

const deleteFile = async (fileId) => {
    try{
        const result = await client.files.delete(fileId)
        return {sucess: true, result};
    }catch(err){
        console.error("Image deletion failed: ", err)
        return null;
    }
}

module.exports = { uploadFile, deleteFile }
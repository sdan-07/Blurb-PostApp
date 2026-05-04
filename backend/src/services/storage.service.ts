import { ImageKit } from '@imagekit/nodejs'

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string
})

interface UploadResult {
    url: string;
    fileId: string;
    [key: string]: unknown;
}

interface DeleteResult {
    success: boolean;
    result: unknown;
}

export const uploadFile = async (buffer: Buffer): Promise<UploadResult | null> => {
    try {
        const result = await client.files.upload({
            file: buffer.toString('base64'),
            folder: 'social-post-app/images',
            fileName: `image-${Date.now()}.jpg`
        })
        return result as UploadResult
    } catch (err) {
        console.error('Image upload error: ', err)
        return null
    }
}

export const deleteFile = async (fileId: string): Promise<DeleteResult | null> => {
    try {
        const result = await client.files.delete(fileId)
        return { success: true, result }
    } catch (err) {
        console.error("Image deletion failed: ", err)
        return null
    }
}

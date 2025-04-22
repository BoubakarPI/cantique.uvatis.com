import { UploadRepository } from '#domain/contracts/repositories/upload_repository'
import drive from '@adonisjs/drive/services/main'
import { GetFileListItemDto } from '#data/types/fetch_item_interface'
import env from '#start/env'
import { extractUploadItems } from '#data/utils/extract_files'

export class UploadFileToR2Impl implements UploadRepository {
  async uploadFile(files: any[]): Promise<string[]> {
    let urls: string[] = []
    for (const file of files) {
      const fileName = file.clientName
      try {
        await file.moveToDisk(fileName)
        await drive.use().getUrl(fileName)
        urls.push(`https://cantique-cdn.uvatis.com/${fileName}`)
      } catch (e) {
        console.error('Erreur lors de l’enregistrement du fichier :', e)
      }
    }
    return urls
  }

  async getFileList(): Promise<GetFileListItemDto[]> {
    try {
      const accountId = env.get('ACCOUNT_ID')
      const bucketName = env.get('R2_BUCKET')
      const token = env.get('CLOUDFLARE_TOKEN')

      const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects`

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur Cloudflare: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      const bucketUrl = 'https://cantique-cdn.uvatis.com'
      return extractUploadItems(data, bucketUrl)
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers :', error)
      throw new Error(`Erreur Cloudflare: ${error.status} - ${error.statusText}`)
    }
  }
}

import { GetFileListItemDto } from '#data/types/fetch_item_interface'

export function extractUploadItems(responseData: any, bucketUrl: string): GetFileListItemDto[] {
  if (!responseData.success || !responseData.result) {
    console.error('Réponse invalide de Cloudflare R2')
    return []
  }

  return responseData.result.map((item: any) => ({
    name: item.key,
    url: `${bucketUrl}/${item.key}`, // Construit l'URL publique
    date: item.last_modified,
  }))
}

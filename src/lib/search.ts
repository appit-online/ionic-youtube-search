import {HTTP} from '@ionic-native/http/ngx';


export async function searchVideo(searchString: string) {
  const httpClient = new HTTP();
  const YOUTUBE_URL = 'https://www.youtube.com';

  const searchRes: any = await httpClient.get(encodeURI(`${YOUTUBE_URL}/results?search_query=${searchString}&sp=EgIQAQ%253D%253D`), {}, {});
  const searchValue = await searchRes.data;
  const pattern = new RegExp('initial-data"><!-- {.*--></div><script >');
  const matches = searchValue.match(pattern);
  let content = matches[0];
  content = content.replace('initial-data"><!-- ', '');
  content = content.replace('--></div><script >', '');

  const contentJson: any = JSON.parse(content);
  const contentObject = contentJson.contents.sectionListRenderer.contents.filter((listing: any) => listing.itemSectionRenderer !== undefined);

  const videos = [];
  for (let result of contentObject[0].itemSectionRenderer.contents) {
    try{
      if(result.compactVideoRenderer !== undefined){
        result = result.compactVideoRenderer;

        const videoId = result.videoId;
        const url = YOUTUBE_URL + '/watch?v=' + videoId;
        const duration = result.lengthText;
        const thumbnailURLs = result.thumbnail.thumbnails;
        const publishedAt = result.publishedTimeText.runs[0].text;
        const title = result.title.runs[0].text;
        const views = result.viewCountText;

        videos.push({
          id: {
            videoId
          },
          snippet: {
            url,
            publishedAt,
            thumbnails: {default: thumbnailURLs[0], high: thumbnailURLs[thumbnailURLs.length - 1]},
            duration,
            title,
            views,
          }
        });
      }
    }catch(error){
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }
  return videos;
}

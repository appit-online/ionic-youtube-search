import {HTTP} from '@ionic-native/http/ngx';
import { ParserService } from './parser.service';
import jp from 'jsonpath';

const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (yt-search; https://www.npmjs.com/package/yt-search)';

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchString: string, token?: string) {
  const httpClient = new HTTP();
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  const options = { type: 'video', limit: 0 };

  const searchRes: any = await httpClient.get(`${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchString.trim())}&hl=en`, {}, { 'user-agent': USER_AGENT});
  let html = await searchRes.data;

  // ytInitialData extrahieren und parsen
  let data: any = null;
  try {
    const jsonStr = html.split('var ytInitialData = ')[1].split(';</script>')[0];
    data = JSON.parse(jsonStr);
  } catch (e) {
    return [];
  }

  // Items mit JSONPath auslesen
  const details = jp.query(data, '$..itemSectionRenderer..contents[*]');
  // manchmal sind Items in primaryContents
  jp.query(data, '$..primaryContents..contents[*]').forEach(i => details.push(i));

  if (!details.length) return [];

  const parserService = new ParserService();

  for (const dataItem of details) {
    if (options.limit > 0 && results.length >= options.limit) break;
    const parsed = parserService.parseVideo(dataItem);
    if (!parsed) continue;

    results.push(parsed);
  }

  return results;
}


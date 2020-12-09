import {HTTP} from '@ionic-native/http/ngx';
import { ParserService } from './parser.service';

export async function searchVideo(searchString: string) {
  const httpClient = new HTTP();
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  let details = [];
  let fetched = false;
  const options = { type: "video", limit: 0 };

  const searchRes: any = await httpClient.get(`${YOUTUBE_URL}/results?q=${encodeURI(searchString.trim())}&hl=en`, {}, {});
  let html = await searchRes.data;

  // try to parse html
  try {
    const data = html.split("ytInitialData")[1].split("');</script>")[0];
    html = data.replace(/\\x([0-9A-F]{2})/ig, (...items: any[]) => {
      return String.fromCharCode(parseInt(items[1], 16));
    });
  } catch(e) { /* do nothing */ }

  try {
    details = JSON.parse(html.split('{"itemSectionRenderer":{"contents":')[html.split('{"itemSectionRenderer":{"contents":').length - 1].split(',"continuations":[{')[0]);
    fetched = true;
  } catch(e) { /* do nothing */ }

  if (!fetched) {
    try {
      details = JSON.parse(html.split('{"itemSectionRenderer":')[html.split('{"itemSectionRenderer":').length - 1].split('},{"continuationItemRenderer":{')[0]).contents;
      fetched = true;
    } catch(e) { /* do nothing */ }
  }

  if (!fetched) return [];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < details.length; i++) {
    if (typeof options.limit === "number" && options.limit > 0 && results.length >= options.limit) break;
    const data = details[i];
    let res;
    if (options.type === "all") {
      if (!!data.videoRenderer) options.type = "video";
      else if (!!data.channelRenderer) options.type = "channel";
      else if (!!data.playlistRenderer) options.type = "playlist";
      else continue;
    }

    if (options.type === "video") {
      const parserService = new ParserService();
      const parsed = parserService.parseVideo(data);
      if (!parsed) continue;
      res = parsed;
    }

    results.push(res);
  }

  return results;
}


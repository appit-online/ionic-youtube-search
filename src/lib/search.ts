import {HTTP} from '@ionic-native/http/ngx';
import { ParserService } from './parser.service';

const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (yt-search; https://www.npmjs.com/package/yt-search)';

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchString: string, token?: string) {
  const httpClient = new HTTP();
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  const options = { type: 'video', limit: 0 };


  const searchRes: any = await httpClient.get(`${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchString.trim())}&hl=en`, {}, { 'user-agent': USER_AGENT});
  const html = await searchRes.data;

  let data: any = null;
  let details: any[] = [];
  let fetched = false;

  // ytInitialData parsen
  try {
    const jsonStr = html.split('var ytInitialData = ')[1].split(';</script>')[0];
    // Hex-Escapes wie \xHH in normale Zeichen umwandeln
    const unescaped = jsonStr(/\\x([0-9A-F]{2})/ig, (_: any, hex: any) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    // Zusätzliche Backslashes entfernen
    const cleaned = unescaped.replaceAll("\\\\\"", "");

    data = JSON.parse(cleaned);
  } catch (e) {
    return [];
  }

  // 1. Reguläres Parsing
  try {
    const sectionList = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;
    for (const section of sectionList.contents) {
      if (section.itemSectionRenderer?.contents) {
        details.push(...section.itemSectionRenderer.contents);
      }
    }
    if (details.length) fetched = true;
  } catch (e) { /* ignore */}

  // 2. Backup/Alternative Parsing – Methode 1
  if (!fetched) {
    try {
      const raw = html.split('{"itemSectionRenderer":{"contents":');
      const jsonStr = '{"itemSectionRenderer":{"contents":' + raw[raw.length - 1].split(',"continuations":[{')[0];
      const parsed = JSON.parse(jsonStr);
      details = parsed.itemSectionRenderer.contents;
      fetched = true;
    } catch (e) { /* ignore */ }
  }

  // 3. Backup/Alternative Parsing – Methode 2
  if (!fetched) {
    try {
      const raw = html.split('{"itemSectionRenderer":');
      const jsonStr = '{"itemSectionRenderer":' + raw[raw.length - 1].split('},{"continuationItemRenderer":{')[0] + '}';
      const parsed = JSON.parse(jsonStr);
      details = parsed.itemSectionRenderer.contents;
      fetched = true;
    } catch (e) { /* ignore */ }
  }

  if (!fetched || !details.length) return [];

  const parserService = new ParserService();

  for (const dataItem of details) {
    if (options.limit > 0 && results.length >= options.limit) break;
    const parsed = parserService.parseVideo(dataItem);
    if (!parsed) continue;

    results.push(parsed);
  }

  return results;
}


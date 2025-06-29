import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ParserService } from './parser.service';

const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const YOUTUBE_URL = 'https://www.youtube.com';

const rfc3986EncodeURIComponent = (str: string) =>
  encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchString: string, token?: string) {
  const httpClient = new HTTP();
  const results: any[] = [];
  const options = { type: 'video', limit: 0 };

  try {
    const response: any = await httpClient.get(
      `${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchString.trim())}&hl=en`,
      {},
      { 'user-agent': USER_AGENT }
    );

    let html = response.data;

    // Extrahiere ytInitialData
    try {
      const rawJson = html.split("ytInitialData = '")[1].split("';</script>")[0];
      const unescaped = rawJson.replace(/\\x([0-9A-F]{2})/gi, (_: any, hex: any) =>
        String.fromCharCode(parseInt(hex, 16))
      );
      const cleaned = unescaped.replace(/\\"/g, '"');
      html = cleaned;
    } catch (parseError) {
      // tslint:disable-next-line:no-console
      console.warn('ytInitialData nicht gefunden oder fehlerhaft');
      return [];
    }

    let data: any;
    try {
      data = JSON.parse(html);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.warn('JSON Parse Fehler:', e);
      return [];
    }

    let details: any[] = [];

    // Haupt-Pfad
    try {
      const section = data.contents.sectionListRenderer.contents[0];
      if (section.itemSectionRenderer?.contents?.length) {
        details = section.itemSectionRenderer.contents;
      }
    } catch (e) { /* fallbacks folgen */ }

    // Fallbacks bei fehlenden Details
    if (!details.length) {
      try {
        const backupStr = html.split('{"itemSectionRenderer":{"contents":').pop()?.split(',"continuations":[{')[0];
        if (backupStr) {
          details = JSON.parse('{"contents":' + backupStr + '}').contents;
        }
      } catch (e) {
        /* ignore */
      }
    }

    if (!details.length) {
      try {
        const backupStr = html.split('{"itemSectionRenderer":').pop()?.split('},{"continuationItemRenderer":{')[0];
        if (backupStr) {
          details = JSON.parse('{"itemSectionRenderer":' + backupStr + '}').itemSectionRenderer.contents;
        }
      } catch (e) {/* ignore */}
    }

    if (!details.length) return [];

    const parserService = new ParserService();

    for (const item of details) {
      if (options.limit > 0 && results.length >= options.limit) break;

      const parsed = parserService.parseVideo(item);
      if (parsed) results.push(parsed);
    }

    return results;

  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error('Fehler beim Abrufen oder Parsen:', e);
    return [];
  }
}

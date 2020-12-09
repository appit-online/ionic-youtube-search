export class ParserService {

  parseVideo(data: any) {
    if (!data || !data.compactVideoRenderer) return;

    const badge = data.compactVideoRenderer.ownerBadges && data.compactVideoRenderer.ownerBadges[0];

    let res = {
      id: {
        videoId: data.compactVideoRenderer.videoId
      },
      url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
      title: data.compactVideoRenderer.title.runs[0].text,
      description: data.compactVideoRenderer.descriptionSnippet && data.compactVideoRenderer.descriptionSnippet.runs[0] ? data.compactVideoRenderer.descriptionSnippet.runs[0].text : "",
      duration_raw: data.compactVideoRenderer.lengthText ? data.compactVideoRenderer.lengthText.simpleText : null,
      snippet: {
        url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
        duration: data.compactVideoRenderer.lengthText ? data.compactVideoRenderer.lengthText.simpleText : null,
        publishedAt: data.compactVideoRenderer.publishedTimeText ? data.compactVideoRenderer.publishedTimeText.simpleText : null,
        thumbnails: {
          id: data.compactVideoRenderer.videoId,
          url: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].url,
          default: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1],
          high: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1],
          height: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].height,
          width: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].width
        },
        title: data.compactVideoRenderer.title.runs[0].text,
        views: data.compactVideoRenderer.viewCountText && data.compactVideoRenderer.viewCountText.simpleText ? data.compactVideoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
      },
      thumbnail: {
        id: data.compactVideoRenderer.videoId,
        url: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].url,
        height: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].height,
        width: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].width
      },
      uploadedAt: data.compactVideoRenderer.publishedTimeText ? data.compactVideoRenderer.publishedTimeText.simpleText : null,
      views: data.compactVideoRenderer.viewCountText && data.compactVideoRenderer.viewCountText.simpleText ? data.compactVideoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
    };

    return res;
  }

}
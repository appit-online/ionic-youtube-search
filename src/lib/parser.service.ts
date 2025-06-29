export class ParserService {
  parseVideo(data: any) {
    if (!data) return undefined;

    try {
      if (data.compactVideoRenderer) {
        const vr = data.compactVideoRenderer;

        let title = vr.title?.runs?.[0]?.text ?? '';
        title = this.cleanUpName(title);

        try {
          title = decodeURIComponent(title);
        } catch {/* ignore */}

        const thumbnail = this.extractThumbnail(vr);
        const views = this.extractViews(vr.viewCountText?.simpleText);

        return {
          id: { videoId: vr.videoId },
          url: `https://www.youtube.com/watch?v=${vr.videoId}`,
          title,
          description: vr.descriptionSnippet?.runs?.[0]?.text ?? '',
          duration_raw: vr.lengthText?.simpleText ?? null,
          snippet: {
            url: `https://www.youtube.com/watch?v=${vr.videoId}`,
            duration: vr.lengthText?.simpleText ?? null,
            publishedAt: vr.publishedTimeText?.simpleText ?? null,
            thumbnails: thumbnail,
            title,
            views
          },
          views
        };
      }

      if (data.videoWithContextRenderer) {
        const vr = data.videoWithContextRenderer;

        let title = vr.headline?.runs?.[0]?.text
          ?? vr.headline?.accessibility?.accessibilityData?.label
          ?? '';
        title = this.cleanUpName(title);

        try {
          title = decodeURIComponent(title);
        } catch {/* ignore */}

        const thumbnail = this.extractThumbnail(vr);
        const views = this.extractViews(vr.shortViewCountText?.accessibility?.accessibilityData?.label);

        return {
          id: { videoId: vr.videoId },
          url: `https://www.youtube.com/watch?v=${vr.videoId}`,
          title,
          description: '',
          duration_raw: vr.lengthText?.accessibility?.accessibilityData?.text ?? null,
          snippet: {
            url: `https://www.youtube.com/watch?v=${vr.videoId}`,
            duration: vr.lengthText?.accessibility?.accessibilityData?.text ?? null,
            publishedAt: vr.publishedTimeText?.runs?.[0]?.text ?? null,
            thumbnails: thumbnail,
            title,
            views
          },
          views
        };
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  cleanUpName(name: string): string {
    return name
      .replace(/\\u[\dA-Fa-f]{4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)))
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&apos;/gi, "'")
      .replace(/[^a-zA-Z0-9äöüÄÖÜß \-_.!,?()'"&%:;]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractThumbnail(vr: any) {
    const thumbnails = vr.thumbnail?.thumbnails ?? [];

    if (!thumbnails.length) return null;

    // Finde das Thumbnail mit der höchsten Auflösung (nach Fläche, Höhe oder Breite)
    const best = thumbnails.reduce((max: any, thumb: any) => {
      const currentArea = (thumb.width ?? 0) * (thumb.height ?? 0);
      const maxArea = (max.width ?? 0) * (max.height ?? 0);
      return currentArea > maxArea ? thumb : max;
    });

    return {
      id: vr.videoId,
      url: best.url,
      default: best,
      high: best,
      height: best.height,
      width: best.width
    };
  }

  private extractViews(text: string | undefined): number {
    if (!text) return 0;
    const raw = text.replace(/[^0-9]/g, '');
    return Number(raw) || 0;
  }
}

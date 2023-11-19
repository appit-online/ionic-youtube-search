# [ionic-youtube-search: Node.js](https://github.com/appit-online/ionic-youtube-search)

Search videos on YouTube without API key in ionic apps

**Table of contents:**


* [Quickstart](#quickstart)

  * [Installing the library](#installing-the-library)
  * [Using the library](#using-the-library)
* [License](#license)

## Quickstart

### Installing the library

```bash
ionic cordova plugin add cordova-plugin-advanced-http
npm install ionic-youtube-search --save
```


### Using the library

```javascript
import * as yt from 'ionic-youtube-search';

/**
 * Given a search query, searching on youtube
 * @param {string} search value (videoId).
 */
const videos = await yt.search('Hello World');
const videos = await yt.search('y5kIrbG2gRc');
console.log('Videos:');
console.log(videos);

[
    {
        "id":
        {
            "videoId": "y5kIrbG2gRc"
        },
        "url": "https://www.youtube.com/watch?v=y5kIrbG2gRc",
        "title": "How to Download Free Music On Your iPhone (OFFLINE) 2020",
        "description": "",
        "duration_raw": "2:01",
        "snippet":
        {
            "url": "https://www.youtube.com/watch?v=y5kIrbG2gRc",
            "duration": "2:01",
            "publishedAt": "3 years ago",
            "thumbnails":
            {
                "id": "y5kIrbG2gRc",
                "url": "https://i.ytimg.com/vi/y5kIrbG2gRc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDuzgRSHVaWMTmiU4TAzv0Opz2CmQ",
                "default":
                {
                    "url": "https://i.ytimg.com/vi/y5kIrbG2gRc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDuzgRSHVaWMTmiU4TAzv0Opz2CmQ",
                    "width": 720,
                    "height": 404
                },
                "high":
                {
                    "url": "https://i.ytimg.com/vi/y5kIrbG2gRc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDuzgRSHVaWMTmiU4TAzv0Opz2CmQ",
                    "width": 720,
                    "height": 404
                },
                "height": 404,
                "width": 720
            },
            "title": "How to Download Free Music On Your iPhone (OFFLINE) 2020"
        },
        "views": "199"
    },
    ...
]

```

```javascript
const yt = require('ionic-youtube-search');

/**
 * Given a search query, searching on youtube
 * @param {string} search value.
 */
const video = await yt.info('My Search Query');
console.log('Videos:');
console.log(videos);
```

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.

## License

Apache Version 2.0

See [LICENSE](https://github.com/appit-online/ionic-youtube-search/blob/master/LICENSE)

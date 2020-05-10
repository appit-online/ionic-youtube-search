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
      "id":{
         "videoId":"y5kIrbG2gRc"
      },
      "snippet":{
         "url":"https://www.youtube.com/watch?v=y5kIrbG2gRc",
         "publishedAt":"3 months ago",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/y5kIrbG2gRc/default.jpg",
               "width":120,
               "height":90
            },
            "high":{
               "url":"https://i.ytimg.com/vi/y5kIrbG2gRc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC9c-4JI285aXTlg99bne9V224hVw",
               "width":686,
               "height":386
            }
         },
         "duration":{
            "runs":[
               {
                  "text":"2:01"
               }
            ],
            "accessibility":{
               "accessibilityData":{
                  "label":"2 minutes, 1 second"
               }
            }
         },
         "title":"How to Download Free Music On Your iPhone (OFFLINE) 2020",
         "views":{
            "runs":[
               {
                  "text":"51 views"
               }
            ]
         }
      }
   }
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

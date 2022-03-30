let recent_streams;
let current_stream;
let current_thumb;
const PREVIEW_HOURS = 48;

function getDateFromTitle(title) {
  let date_parts = title.split(" ");
  // Remove "th", "nd", "rd"
  date_parts[0] = date_parts[0].substring(0, date_parts[0].length - 2);
  return Date.parse(date_parts.join(" "));
}

function init() {
  gapi.client.setApiKey("AIzaSyAu1VmB0TMgoOIwf4hcVXPBfb4oYPGBmNM");
  gapi.client.load("youtube", "v3", function () {
    // YouTube API is ready
    let request = gapi.client.youtube.playlistItems.list({
      part: "snippet",
      playlistId: "PLrbxTXJcHqjsqqm4SnvWUEc02GLOVS4p4",
      maxResults: 5,
    });
    request.execute(function (response) {
      recent_streams = response.items;
      // Find current stream.  This is either a scheduled livestream, not more than
      // two days in the future, or the most recent livestream
      const now_ms = Date.parse(Date());
      let time_delta = PREVIEW_HOURS;
      let i = 0;
      while (time_delta >= PREVIEW_HOURS && i < recent_streams.length) {
        current_stream = recent_streams[i].snippet.resourceId.videoId;
        current_title = recent_streams[i].snippet.title.substring(16); // Remove "Sunday Stream - "
        current_date = getDateFromTitle(current_title);
        // Get time difference in hours between now and midnight on the day of the stream
        time_delta = (current_date - now_ms) / 3600000;
        i++;
      }
      if ("maxres" in recent_streams[i - 1].snippet.thumbnails) {
        current_thumb = recent_streams[i - 1].snippet.thumbnails.maxres.url;
      } else {
        current_thumb = recent_streams[i - 1].snippet.thumbnails.high.url;
      }
      // Populate DOM elements
      document.getElementById("video_link").href =
        "https://www.youtube.com/watch?v=" + current_stream;
      document.getElementById("video_thumb").src = current_thumb;
      document.getElementById("service_date").innerText = "Sunday worship - " + current_title;
    });
  });
}

gapi.load("client", init);

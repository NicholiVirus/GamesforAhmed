// Torah Runner as a Google Apps Script web app.
// Deploy > New deployment > Web app, then open the web app URL.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Torah Runner')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

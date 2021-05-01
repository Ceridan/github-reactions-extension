# GitHub Reactions

GitHub Reactions is a Google Chrome extension that allows you to extract reactions from issues to better understand which issues are the most popular.

Currently, it shows thumbs up (+1) and thumbs down (-1) votes directly in the list of issues. You may sort issues by one of these reactions and choose which issue is the most important for your users.

Here is an example from <https://github.com/deordie/deordie-digest/issues>:

![image](https://user-images.githubusercontent.com/408149/116781318-c3ac7480-aa8a-11eb-9683-56a976e9eedd.png)

> Important notice. This extension is using [GitHub API](https://docs.github.com/en/rest/reference/reactions) to get reactions for each issue. GitHub API has [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting). This means how much requests we can send to GitHub API by hour. Currently extension supports only unauthorized requests.

## How to build an extension

1. You need to install [npm](https://www.npmjs.com/) depenencies:

    ```bash
    npm install
    ```

2. To build an extension you need to run following command:

    ```bash
    npm run build
    ```

    The `dist` folder will be created as a result of build step.

## How to load extension to your browser

Currently supported only Google Chrome browser.

Instructions for Google Chrome:

1. Open browser and navigate to `chrome://extensions`.
2. Enable `Developer Mode` by clicking the toggle switch next to `Developer mode`.
3. Click the `Load unpacked` button and select the `dist` folder.

If you want to disable the extension, just toggle it out in the `chrome://extensions`.

![image](https://user-images.githubusercontent.com/408149/116781380-2d2c8300-aa8b-11eb-86e6-52da33e2030e.png)

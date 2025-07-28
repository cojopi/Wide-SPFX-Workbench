/**
 * Wide SPFX Workbench - Background Script
 *
 * This service worker monitors tab changes and automatically injects
 * the content script when SharePoint Framework workbench pages are detected.
 *
 * @version 1.0
 * @author Wide SPFX Workbench Extension
 */

/**
 * Regular expression to match SharePoint Framework workbench URLs
 * Matches both HTTP and HTTPS protocols with the workbench.aspx path
 * @type {RegExp}
 */
const sharepointRegex = /_layouts\/15\/workbench\.aspx/;

/**
 * Event listener for tab activation (when user switches to a different tab)
 * Checks if the newly activated tab is a SPFX workbench and injects the content script
 */
chrome.tabs.onActivated.addListener((tab) => {
    getTab().then((url) => {
        if (sharepointRegex.test(url)) {
            // Inject the foreground script to modify the workbench layout
            chrome.scripting.executeScript({
                target: { tabId: tab.tabId, allFrames: true },
                files: ["./content-script.js"],
            });
        }
    });
});

/**
 * Event listener for tab updates (when tab content changes, including page loads)
 * Waits for complete page load before checking and injecting the script
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Only proceed when the page has finished loading
    if (changeInfo.status == "complete") {
        getTab().then((url) => {
            if (sharepointRegex.test(url)) {
                // Inject the foreground script to modify the workbench layout
                chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    files: ["./foreground.js"],
                });
            }
        });
    }
});

/**
 * Retrieves the URL of the currently active tab in the current window
 *
 * @async
 * @function getTab
 * @returns {Promise<string>} The URL of the active tab, or empty string if no tab is found
 *
 * @example
 * // Get current tab URL
 * const url = await getTab();
 * if (url.includes('workbench')) {
 *   // Handle workbench page
 * }
 */
async function getTab() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);

    // Return the URL if tabs exist, otherwise return empty string
    if (tabs && tabs.length > 0) return tabs[0].url;
    else return "";
}

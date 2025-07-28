/**
 * Wide SPFX Workbench - Content Script
 *
 * This script is injected into SharePoint Framework workbench pages to:
 * - Remove width restrictions on the canvas zone
 * - Hide unnecessary UI elements that consume space
 * - Remove padding that limits the usable area
 *
 * The script modifies the DOM to maximize the available workspace for developers
 * working with SharePoint Framework web parts.
 *
 * @version 1.0
 * @author Wide SPFX Workbench Extension
 */

/**
 * STEP 1: Inject custom CSS to override SharePoint's default max-width restrictions
 *
 * SharePoint normally limits the canvas zone to 924px, but we extend it to 2560px
 * to accommodate modern wide-screen displays and provide more workspace.
 */
const canvasMaxWidthStyleElement = document.createElement("style");
canvasMaxWidthStyleElement.innerHTML = ".CanvasComponent.LCS .CanvasZone { max-width: 2560px; }";
document.body.appendChild(canvasMaxWidthStyleElement);

/**
 * STEP 2: Remove CSS classes from workbench page content
 *
 * The workbenchPageContent element has CSS classes that enforce layout restrictions.
 * We remove all classes to eliminate these constraints while preserving the element structure.
 */
const workbenchPageContentElement = document.getElementById("workbenchPageContent");
if (workbenchPageContentElement != null) {
    // Iterate through and remove all CSS classes
    workbenchPageContentElement.classList.forEach((className) => {
        workbenchPageContentElement.classList.remove(className);
    });
}

/**
 * STEP 3: Ensure the page chrome container is visible
 *
 * Sometimes the spPageChromeAppDiv might be hidden, so we explicitly show it
 * to maintain proper page structure.
 */
const sharepointPageChromeContainer = document.getElementById("spPageChromeAppDiv");
if (sharepointPageChromeContainer) {
    sharepointPageChromeContainer.style.display = "block";
}

/**
 * STEP 4: Hide the SharePoint app bar
 *
 * The sp-appBar takes up vertical space and is not needed in the workbench context.
 * Hiding it provides more vertical real estate for web part development.
 */
const sharepointAppBarElement = document.getElementById("sp-appBar");
if (sharepointAppBarElement) {
    sharepointAppBarElement.style.display = "none";
}

/**
 * STEP 5: Remove padding from nested content containers
 *
 * Navigate through the nested div structure to find the padded container
 * and remove its padding to maximize the usable workspace area.
 * Uses optional chaining (?.) for safe property access to prevent errors.
 */
if (workbenchPageContentElement) {
    const nestedPaddedContentContainer = workbenchPageContentElement.children[0]?.children[0]?.children[0];
    if (nestedPaddedContentContainer) {
        nestedPaddedContentContainer.style.padding = "0px";
    }
}

// Log successful execution for debugging purposes
console.log("Wide SPFX Workbench: Layout modifications applied successfully");

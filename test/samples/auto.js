if (typeof(gond_read_more) !== "undefined") {   // only run if we're not in page edit mode
    // Finish defining gond_read_more (started in view.php).

    gond_read_more.duration = 0.5;      // seconds taken to expand and collapse

    gond_read_more.rowClasses;          // array of CSS classes that indicate rows

    gond_read_more.initialise = function() {
        this.rowClasses = this.getRowClasses(this.rowHTML);

        window.onresize=this.onResize;

        var bottomDivs = document.getElementsByClassName("gond-read-more-bottom");
        while (bottomDivs.length > 0) {
            this.initialiseDiv(bottomDivs[0]);
            // Update bottomDivs because initialiseDiv removes elements from DOM:
            bottomDivs = document.getElementsByClassName("gond-read-more-bottom");
        }
    }

    gond_read_more.getRowClasses = function(rowHTML) {
        // Return array of CSS classes that indicate rows.
        // Based on http://stackoverflow.com/questions/33027291/extract-all-css-classes-from-html-text
        var re = /class="(.*?)"/g;
        var m;
        var rowClasses = [];
        while ((m = re.exec(rowHTML)) !== null) {
            rowClasses = rowClasses.concat(rowClasses, m[1].split(" ") );
        }
        rowClasses.push("ccm-layout-column-wrapper");  // c5's built-in free-form layout
        return rowClasses;
    }

    gond_read_more.initialiseDiv = function(bottomDiv) {
        // bottomDiv is removed whether a matching topDiv was found or not.

        var match = this.findMatchingDiv(bottomDiv);    // find corresponding topDiv
        if (match == false) {
            bottomDiv.parentElement.removeChild(bottomDiv);
            return;
        }

        // Extract useful vars from match; see comments in findMatchingDiv()
        var parent = match.ancestor;
        var children = parent.children;
        var topDivIndex = match.siblingIndex;
        var bottomDivIndex = match.divIndex;
        var styleDivTop = match.styleDivTop;
        var styleDivBtm = match.styleDivBtm;

        // Extract form fields from bottomDiv:
        var collapsedHeight = bottomDiv.getAttribute("data-collapsed-height");
        var readMoreText = bottomDiv.getAttribute("data-read-more-text");
        var readLessText = bottomDiv.getAttribute("data-read-less-text");

        // Remove top and bottom DIVs so they can't interfere with margins:
        parent.removeChild(children[topDivIndex]);
        parent.removeChild(children[--bottomDivIndex]);

        // Create gond-read-more-div to hold all collapsible elements:
        var readMoreDiv = document.createElement("div");
        readMoreDiv.className = "gond-read-more-div";
        if (styleDivTop != null)
            readMoreDiv.style.marginTop = window.getComputedStyle(styleDivTop,null).getPropertyValue("margin-top");
        if (styleDivBtm != null)
            readMoreDiv.style.marginBottom =
                                window.getComputedStyle(styleDivBtm,null).getPropertyValue("margin-bottom");
        readMoreDiv.style.maxHeight = collapsedHeight+"px";

        // Create gond-read-more-content DIV to hold collapsible blocks:
        var contentDiv = document.createElement("div");
        contentDiv.className = "gond-read-more-content";
        readMoreDiv.appendChild(contentDiv);

        // Move content blocks into gond-read-more-content DIV:
        for (var i = topDivIndex; i < bottomDivIndex; i++) {
            contentDiv.appendChild(children[topDivIndex]);
        }

        // Insert read-more elements into gond-read-more-div:
        var fade = document.createElement("p");
        fade.className = "gond-read-more-fade";
        readMoreDiv.appendChild(fade);

        var readMorePara = document.createElement("p");
        readMorePara.className = "gond-read-more-para";
        readMoreDiv.appendChild(readMorePara);

        var readMoreLink = document.createElement("a");
        readMoreLink.className = "gond-read-more-link btn btn-default";
        var readMoreTextNode = document.createTextNode(readMoreText);
        readMoreLink.appendChild(readMoreTextNode);
        readMoreLink.onclick = function() {
            gond_read_more.showMore(this, true);
        };
        readMorePara.appendChild(readMoreLink);

        // Read-less elements:
        var readLessPara = document.createElement("p");
        readLessPara.className = "gond-read-less-para";
        readLessPara.style.clear = "both";
        readMoreDiv.appendChild(readLessPara);

        var readLessLink = document.createElement("a");
        readLessLink.className = "gond-read-more-link btn btn-default";
        var readLessTextNode = document.createTextNode(readLessText);
        readLessLink.appendChild(readLessTextNode);
        readLessLink.onclick = function() {
            gond_read_more.showMore(this, false);
        };
        readLessPara.appendChild(readLessLink);

        // Put read-more elements into page DOM:
        parent.insertBefore(readMoreDiv, children[topDivIndex]);



        // Find element that sets background colour.
        // First, dig down to innermost child at start of gond-read-more-content:
        var bgElement = contentDiv;
        while (bgElement.firstElementChild != null) {
            bgElement = bgElement.firstElementChild;
        }
        // Ascend parents looking for background-color:
        var bgColour = window.getComputedStyle(bgElement, null).getPropertyValue("background-color");
        while (bgColour=="transparent" && bgElement.parentElement!=null) {
            bgElement = bgElement.parentElement;
            bgColour = window.getComputedStyle(bgElement, null).getPropertyValue("background-color");
        }

        // Ensure bgElement has an id and remember it, so we can clip the fade to match its width:
        if (bgElement.id == "") bgElement.id = bottomDiv.id + "-bg";
        fade.setAttribute("data-bgElement", bgElement.id);

        // Set fade colour:
        fade.style.background = "linear-gradient(to bottom, transparent," + bgColour + ")";

        // Check and save collapsedHeight:
        var fadeHeight = fade.offsetHeight;
        if (collapsedHeight < fadeHeight) {     // DIV shouldn't be smaller than fade
            collapsedHeight = fadeHeight;
            readMoreDiv.style.maxHeight = collapsedHeight+"px";
        }
        readMoreDiv.setAttribute("data-collapsed-height", collapsedHeight);

        readMoreDiv.addEventListener("transitionend", this.onTransitionEnd);
    }

    gond_read_more.findMatchingDiv = function(div) {
        // Find a topDiv corresponding to the specified bottomDiv, by searching successively higher levels of DOM.
        // div: a bottomDiv
        // On success, returns an object specifying:
        //      sibling:      .gond-read-more-top element corresponding to div
        //      ancestor:     element common to div and sibling
        //      divIndex:     index of element containing div within ancestor
        //      siblingIndex: index of element containing sibling within ancestor
        //      styleDivTop:  DIV.ccm-custom-style-container element containing
        //                    gond-read-more-top against which custom styles have been applied, if any
        //      styleDivBtm:  DIV.ccm-custom-style-container element containing
        //                    gond-read-more-bottom against which custom styles have been applied, if any

        var generation = 0;     // how many DOM levels we've ascended
        var styleDivBtm;
        if (div.parentElement.classList.contains("ccm-custom-style-container")) {
            generation = -1;    // ignore the style container, since it may not have an equivalent in topDiv
            styleDivBtm = div.parentElement;
        }
        var ancestor = div;
        do {
            var ancestor = ancestor.parentElement;
            generation++;
            var children = ancestor.children;
            if (children.length > 1) {
                // there’s no point searching for sibling if ancestor has 1 child, because it can only contain div
                var matchingDiv = this.findMatchingDivWithin(ancestor, div, generation);
                if (matchingDiv !== false) {
                    matchingDiv.ancestor = ancestor;
                    matchingDiv.styleDivBtm = styleDivBtm;
                }
                return matchingDiv;
            }
        } while (ancestor.tagName == 'DIV');

        // We've gone too high up the DOM to have any hope of finding a sibling, so error:
        return false;
    }

    gond_read_more.findMatchingDivWithin = function(ancestor, div, generation) {
        // ancestor: element to look in
        // div: a bottomDiv
        // generation: how many DOM levels between ancestor and div
        // On success, returns an object specifying:
        //      sibling:      .gond-read-more-top element corresponding to div
        //      divIndex:     index of element containing div within ancestor
        //      siblingIndex: index of element containing sibling within ancestor
        //      styleDivTop:  DIV.ccm-custom-style-container element containing
        //                    gond-read-more-top against which custom styles have been applied, if any

        // If we're looking across columns, fail:
        if (this.rowClasses.indexOf(ancestor.className) >= 0) {
            console.log(this.errPrefix + div.id + this.errCrossColumn);
            return false;
        }

        // Find index of div in ancestor's children:
        var children = ancestor.children;
        var divIndex;
        for (var i = 0; i<children.length; i++) {
            if (children[i].contains(div)) {
                divIndex = i;
                break;
            }
        }
        if (divIndex === undefined) {   // shouldn't happen, but to be safe...
            console.log(this.errPrefix + div.id + this.errNotInAncestor);
            return false;
        }

        // Find index of .gond-read-more-top above divIndex:
        var siblingIndex, siblingGeneration, styleDiv;
        for (var i = divIndex-1; i >= 0; i--) {
            topSibling = this.generationOfClass(children[i],"gond-read-more-top");
            if (topSibling !== false) {
                siblingGeneration = topSibling.generation;
                siblingIndex = i;
                styleDiv=topSibling.styleDiv;
                break;
            }
        }

        if (siblingIndex === undefined) {   // shouldn't happen, but to be safe...
            console.log(this.errPrefix + div.id + this.errNoMatch);
            return false;
        }

        if (siblingGeneration !== generation) {
            console.log(this.errPrefix + div.id + this.errLevelMismatch);
            return false;
        }

        return {divIndex:divIndex, sibling:children[siblingIndex],
                    siblingIndex:siblingIndex, styleDivTop:styleDiv};
    }

    gond_read_more.generationOfClass = function(child, className) {
        // On success, returns an object specifying:
        //     generation:  generation level of child element having className
        //     styleDiv:    DIV.ccm-custom-style-container element against which custom styles have been applied, if any

        if (child.className === className) {
            return {generation:1};
        }

        if (child.getElementsByClassName(className).length == 0)
            return false;

        // We now know child contains an element having className, and each child is an
        // only child. Determine generation:
        var siblingGeneration = 1;
        var descendant = child;
        do {
            descendant = descendant.children[0];
            siblingGeneration++;
            if (siblingGeneration > 20)     // shouldn't happen, but for safety...
                return false;
        } while (descendant.className != className);

        // Check whether the block has custom styles; if so, deal with it:
        var styleDiv;
        if (descendant.parentElement.classList.contains("ccm-custom-style-container")) {
            styleDiv = descendant.parentElement;
            siblingGeneration--;    // ignore the ccm-custom-style-container level
        }

        return {generation:siblingGeneration, styleDiv:styleDiv};
    }

    gond_read_more.showMore = function(button, more) {
        // A 'read more' or 'read less' <a> has been clicked.
        // button: <a> element
        // more:   true to show more; false to show less

        var div = button.parentNode.parentNode;     // gond-read-more-div
        var readMorePara = div.getElementsByClassName("gond-read-more-para")[0];
        var readLessPara = div.getElementsByClassName("gond-read-less-para")[0];
        if (more) {                    // read more
            readLessPara.style.display = "block";
            div.style.transition = "max-height " + this.duration + "s ease-in-out";
            var buttonHeight = readMorePara.offsetHeight;
            div.style.maxHeight = div.scrollHeight + buttonHeight + "px";
            readMorePara.style.display = "none";
            var fade = div.getElementsByClassName("gond-read-more-fade")[0];
            fade.style.display = "none";
        } else {                    // read less
            readLessPara.style.visibility = "hidden";
            div.style.transition = "max-height 0s";
            div.style.maxHeight = div.offsetHeight + "px";
            var dummy = div.offsetTop;  // force previous 'transition' to complete
            readMorePara.style.display = "block";
            div.style.transition = "max-height " + this.duration + "s ease-in-out";
            var collapsedHeight = div.getAttribute("data-collapsed-height");
            div.style.maxHeight = collapsedHeight + "px";
        }
    }

    gond_read_more.onTransitionEnd = function() {
        var readMorePara = this.getElementsByClassName("gond-read-more-para")[0];
        if (readMorePara.style.display == "none") {     // now expanded
            var fade = this.getElementsByClassName("gond-read-more-fade")[0];
            fade.style.display = "none";
            this.style.maxHeight = "none";        // ensure we can read all (in case calculated height was off)
        } else {                                  // now collapsed
            var readLessPara = this.getElementsByClassName("gond-read-less-para")[0];
            readLessPara.style.display = "none";
            readLessPara.style.visibility = "visible";

            // We can only redisplay fade AFTER transition in case its width causes interim horiz scrollbar :(
            var fade = this.getElementsByClassName("gond-read-more-fade")[0];
            fade.style.width = "0px";        // ensure fade doesn't keep its parent div wider than necessary
            fade.style.display = "block";
            fade.style.width = fade.parentElement.scrollWidth + "px";
            gond_read_more.setFadeClip(fade);
        }
    }

    gond_read_more.onResize = function() {
        // Page width may have changed; update all read-more elements if needed.
        var divs = document.getElementsByClassName("gond-read-more-div");
        var i;
        for (i = 0; i < divs.length; i++)
            gond_read_more.onResizeDiv(divs[i]);
    }

    gond_read_more.onResizeDiv = function(div) {
        // Set width of fade so it goes across whole scroll width, not just initially-visible width:
        var fade = div.getElementsByClassName("gond-read-more-fade")[0];
        fade.style.width = "0px";   // ensure fade doesn't keep its parent div wider than necessary
        fade.style.width = div.scrollWidth+"px";

        // Determine whether div is high enough to require 'read more':
        var readMorePara = div.getElementsByClassName("gond-read-more-para")[0];
        var readLessPara = div.getElementsByClassName("gond-read-less-para")[0];
        var isStatic = readMorePara.offsetHeight == 0 && readLessPara.offsetHeight == 0;
        var scrollHeight = div.scrollHeight;
        var isExpanded = readLessPara.style.display != "none";
        if (isExpanded) {   // min scroll height should not include the currently-visible read-less button
            var buttonHeight = readLessPara.offsetHeight;
            scrollHeight -= buttonHeight;
        }
        var collapsedHeight = div.getAttribute("data-collapsed-height");
        var shouldBeStatic = scrollHeight <= collapsedHeight;
        if (shouldBeStatic != isStatic) {   // need to change from static to expandable, or vv.
            if (shouldBeStatic) {
                readMorePara.style.display = "none";
                fade.style.display = "none";
                readLessPara.style.display = "none";
            } else {    // should no longer be static
                div.style.maxHeight = collapsedHeight + "px";
                readMorePara.style.display = "block";
                fade.style.display = "block";
            }
        }

        this.setFadeClip(fade);
    }

    gond_read_more.setFadeClip = function(fade) {
        // Clip fade to width of background colour.

        if (fade.style.display == "none") return;   // not visible so irrelevant and offsetParent==null so can't be done

        var fadeLeft = this.getLeft(fade);
        var bgElement = document.getElementById(fade.getAttribute("data-bgElement"));
        var bgLeft = this.getLeft(bgElement) - fadeLeft;
        var bgRight = bgLeft + bgElement.scrollWidth;
        fade.style.clip = "rect(0px,"+bgRight+"px,99999px,"+bgLeft+"px)";
    }

    gond_read_more.getLeft = function(element) {
        // Returns element's left position WRT page.
        var parent = element;
//todo: 382
        var left = 0;
        while (parent.offsetParent != null) {
            left += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        return left;
    }

    gond_read_more.initialise();

   // When page has fully loaded, work out which read-more elements should be shown:
    window.addEventListener("load", gond_read_more.onResize);
}

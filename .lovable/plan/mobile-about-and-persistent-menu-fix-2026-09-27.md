# Mobile About and persistent menu fix

## Changes
- Make the About page sections use single-column mobile layouts, with safe text widths and spacing so labels, headings, timeline entries, and the portrait never overlap.
- Keep the shared mobile header fixed at the top while scrolling on every public page, with the opened navigation layered above page content.
- Preserve the current desktop layout, approved styling, content, colors, fonts, and motion.
- Check the About page and shared menu at phone and desktop sizes, including horizontal overflow and scrolling behavior.

## Technical details
- Adjust only responsive layout classes in the About page and the shared site header.
- Add the necessary stacking level and top positioning to the existing header rather than creating a second menu.

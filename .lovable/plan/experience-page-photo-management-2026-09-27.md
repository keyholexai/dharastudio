# Experience page photo management

## Changes
- Add each Experience page section as a clear upload destination in the existing admin photo manager.
- Show the uploaded photo in its matching Experience section, while keeping the current empty frame when no photo exists.
- Add a separate Experience photo list in admin so photos can be captioned, reordered, or removed with the existing controls.
- Preserve the approved page layouts, text, fonts, colours, and motion.

## Technical details
- Reuse the existing `site_images` records with an `experience` placement and each section slug as its category.
- Extend the current shared photo query and destination grouping; no new table or storage area is needed.
- Verify upload destinations and every Experience frame at mobile and desktop sizes.

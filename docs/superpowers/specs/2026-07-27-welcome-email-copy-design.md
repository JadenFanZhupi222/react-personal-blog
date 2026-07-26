# Welcome Email Copy Interaction

## Goal

Keep the Welcome contact scene minimal while making both contact actions obvious and reliable.

## Design

- Remove the `GitHub / Email` descriptive subtitle from the contact scene.
- Keep GitHub as an external link backed by the CMS contact record.
- Render email as a button instead of a `mailto:` link.
- On click, copy the CMS email address to the clipboard.
- After a successful copy, replace the email label with a checkmark and the localized text `Copied` / `已复制`.
- Animate the checkmark into view with the existing GSAP dependency, then restore the normal email label after approximately 1.8 seconds.
- If clipboard access fails, leave the normal email label visible and do not show a false success state.

## Accessibility

- The email control remains a native button.
- The copied state is exposed through visible localized text and an `aria-live="polite"` status.
- The checkmark is decorative and hidden from assistive technology.

## Testing

- Verify the subtitle is absent.
- Verify GitHub still points to the CMS URL.
- Verify clicking email writes the correct address to the clipboard.
- Verify the localized copied state appears after success.
- Verify clipboard failure does not display a success state.

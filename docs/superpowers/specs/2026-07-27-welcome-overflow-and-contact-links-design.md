# Welcome overflow and contact links design

## Goal

Remove the Welcome page's horizontal scrollbar and turn the contact actions into working GitHub and email links.

## Project track

`ProjectsScene` renders one track whose width is `panelCount * 100%`. Each panel occupies one viewport within that track. The current animation translates the entire track by `-100 * (panelCount - 1)%`, which treats each panel as if it occupied the full track width and moves the track too far.

The translation will be calculated relative to the track:

```text
-100 * (panelCount - 1) / panelCount
```

For three panels, the final value is `-66.666…%`, placing the third panel in the viewport without pushing the track several screens past its content. The Welcome main container will also use horizontal clipping so decorative and transformed descendants cannot create a document-level horizontal scrollbar.

## Contact links

The Welcome server page will fetch the existing CMS contact data with `getContactData()` and pass it through `Welcome` to `ContactScene`.

`ContactScene` will render:

- GitHub as an external link using `contact.github.link`;
- Email as a `mailto:` link using the first configured email address.

The WeChat action and label will be removed from the Welcome scene. Contact data remains centralized in Payload rather than duplicated in the component. If contact data is unavailable, the scene still renders its title and description but omits unavailable actions.

## Accessibility and behavior

- Links retain the existing visual treatment and GSAP entrance animation.
- GitHub opens in a new tab with `noopener noreferrer`.
- Email uses the user's configured mail application.
- Both links retain visible keyboard focus states.
- Reduced-motion behavior remains unchanged.

## Verification

- A pure track-offset test covers one, two, and three panels.
- A ContactScene render test verifies the GitHub `href`, email `mailto:` link, and absence of WeChat.
- A Welcome source/render test verifies horizontal clipping.
- Run the complete test suite, typecheck, lint, and production build.
- Inspect the local Welcome page at desktop width and confirm document `scrollWidth` equals `clientWidth`.

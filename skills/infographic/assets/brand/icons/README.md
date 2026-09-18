# Platform icons

Monochrome, single-path, `fill="currentColor"`, 16×16 viewBox — one consistent
family so the closing-card row reads as a set.

Source: [Bootstrap Icons](https://icons.getbootstrap.com/) (MIT).

Because they carry no internal `id`s and no baked colors, **inline** them in the
composition and set the color once in CSS:

```css
.socials svg { width: 94px; height: 94px; fill: #fcfaf8; }
```

To add a platform, drop its Bootstrap Icons SVG here named after the platform,
then list it in `cta.platforms` in `frame.md`. Don't mix in full-color brand
marks — the row stops reading as one set, and the dark-variant glyphs from
full-color packs lose their offset paths on a dark field.

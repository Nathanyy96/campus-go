---
name: "Campus Go · 澄灣大學"
description: "Illustrated university life through a personal phone"
colors:
  forest-ink: "#233e34"
  muted-ink: "#4b6659"
  forest-action: "#285c49"
  forest-hover: "#194431"
  campus-paper: "#fbfcf7"
  campus-ground: "#e8eee5"
  divider: "#cbd7c9"
  sage-surface: "#edf2e8"
  focus-clay: "#a0533e"
  app-sage: "#dfeadd"
  app-ochre: "#f2e3cb"
  app-peach: "#f2e2dc"
  app-blue: "#e2e7ee"
  app-lilac: "#e9e1ef"
  bond-rose: "#b66a6b"
typography:
  headline:
    fontFamily: "Noto Serif TC, serif"
    fontSize: "28px"
    lineHeight: 1.4
    letterSpacing: "-.025em"
  desktop-feature:
    fontFamily: "Noto Serif TC, serif"
    fontSize: "24px"
    lineHeight: 1.45
    letterSpacing: "-.025em"
  desktop-feature-compact:
    fontFamily: "Noto Serif TC, serif"
    fontSize: "22px"
    lineHeight: 1.45
    letterSpacing: "-.025em"
  title:
    fontFamily: "Noto Serif TC, serif"
    fontSize: "19px"
    letterSpacing: "-.025em"
  body:
    fontFamily: "Noto Sans TC, sans-serif"
    fontSize: "14px"
    lineHeight: 1.85
  label:
    fontFamily: "Noto Sans TC, sans-serif"
    fontSize: "12px"
  narrative:
    fontFamily: "Noto Sans TC, sans-serif"
    fontSize: "16px"
    lineHeight: 1.9
rounded:
  field: "8px"
  control: "10px"
  surface: "12px"
  app-icon: "16px"
  illustration: "18px"
  phone: "24px"
spacing:
  compact: "6px"
  small: "10px"
  control-inline: "14px"
  section: "24px"
  screen: "26px"
  launcher-block: "30px"
components:
  button-primary:
    backgroundColor: "{colors.forest-action}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
    textColor: "#fff"
  button-paper:
    backgroundColor: "{colors.campus-paper}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  input:
    backgroundColor: "#fff"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.field}"
    padding: "10px"
  navigation:
    backgroundColor: "{colors.campus-paper}"
    textColor: "{colors.forest-ink}"
  stage-chip:
    backgroundColor: "#eef0e8"
    textColor: "#4d6256"
    rounded: "5px"
    padding: "4px 7px"
  notification:
    backgroundColor: "{colors.sage-surface}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.surface}"
    padding: "17px"
  app-icon:
    backgroundColor: "#e3eddd"
    textColor: "{colors.forest-action}"
    rounded: "{rounded.app-icon}"
    size: "58px"
  contact-art:
    width: "100px"
    height: "134px"
    rounded: "{rounded.control}"
  encounter-art:
    width: "72px"
    height: "96px"
  priority-person:
    width: "116px"
    padding: "0 0 10px"
  interest-choice:
    padding: "0 0 12px"
  current-goal:
    padding: "0 0 24px"
  intimacy-number:
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
  messenger-sidebar:
    width: "230px"
  wash-column-preview:
    width: "min(100%,270px)"
---

# Design System: Campus Go · v0.36

## Overview

**Creative North Star: "An illustrated university life with a usable personal phone"**

An illustrated university life with a usable personal phone. Restrained forest green ink and pale campus paper frame clean two-dimensional adult anime characters, distinct faces, clear linework and coherent cel shading. Chinese serif headings give the daily ritual warmth; sans-serif controls keep planning and conversation legible.

The character leads the desktop while the phone carries the daily actions. Soft app colors distinguish destinations without competing with the artwork. The system feels calm, personal and practical, with stronger cinematic depth reserved for focused story scenes.

**Key Characteristics:**

- Character-led desktop and phone-led mobile.
- Forest ink, pale paper and softly colored app icons.
- Chinese serif headings with readable sans-serif controls.
- Honest artwork and persistence labels.

## Colors

### Primary
Forest Action marks committed actions, active navigation and selected filters. Forest Hover deepens that feedback. Focus Clay makes keyboard location conspicuous.

### Secondary
App Sage identifies chat; App Ochre planning and work; App Peach people and room; App Blue study and settings; App Lilac clubs. Bond Rose belongs to affection indicators rather than general actions.

### Neutral
Campus Paper carries the phone, Campus Ground surrounds it, and Sage Surface groups welcome content and incoming messages. Forest Ink and Muted Ink establish text hierarchy; Divider separates rows quietly. Rose and night wallpaper variants change paper, ground and soft surfaces while retaining this hierarchy; their exact overrides are recorded in the sidecar.

**The Paper and Ink Rule.** Use forest ink for readable content and forest actions for commitment; reserve the soft multicolor palette for destination identity.

## Typography

Noto Serif TC with serif fallback is the heading voice; Noto Sans TC with sans-serif fallback carries controls, narrative and supporting copy. Base headings use the frontmatter headline and title roles. Page headings tighten to (25px), desktop character headings use (24px), reducing to (22px) between (901px) and (1350px), and the smallest phone greeting uses (25px). Body paragraphs stop at (65ch); scene dialogue permits (70ch). Navigation uses compact labels (11px), supporting metadata (10–12px), and scene dialogue uses the narrative role, dropping to (14px) on narrow phones. Preserve readable line spacing instead of squeezing additional prose into the first viewport.

## Layout

Above (900px), the desktop container is capped at (1760px), with grid columns `minmax(340px,.9fr) minmax(460px,1.1fr)`, a (24px) gutter and (24px) outer padding. The character panel stays sticky at (24px), with height `calc(100svh - 48px)`; the phone has the same minimum height. The full-body illustration occupies the flexible upper area, followed by a compact paper copy block. Anime art uses an SVG viewport derived from the right-hand panel of the (1536 × 1024) source at its authored split, with `preserveAspectRatio="xMidYMid meet"`; fit the complete panel without cover cropping or copy overlay. Copy padding is (18px 24px 20px), with text on the left and relationship meter/action on the right. Between (901px) and (1350px), padding becomes (16px 20px), heading and supporting text span both columns, and the meter/action share the final row. At (900px) and below, the character panel disappears and the single phone spans a container capped at (600px); its frame radius and shadow disappear. At (430px) and below, screen padding becomes (22px 18px). Desktop phone content uses (26px) padding; mobile uses (24px).

Six top navigation destinations stay available, followed by a greeting, resources and daily slots in their relevant surfaces. The launcher has four columns; home wardrobe thumbnails have five, wash designs two; completed four-column wash sheets use four choices at viewport widths of (1450px) and above. Lists use separators rather than a card for every row. Content can scroll; do not make the page an unscrollable phone screenshot.

The guided opening progresses through ceremony, contact introductions, one active club booth and multi-person interests. Introduction and recruitment rows use a (100px) art column, (134px) art height, (20px) gap and (24px) vertical padding; at (430px) and below the column is (80px) with a (14px) gap. Interest choices use three columns and (20px 14px) gaps, reducing to two columns on narrow phones. Priority people form a horizontal scrolling strip with (116px) choices and (130px) art; other encounters stay compact rows with (72 × 96px) art and a (16px) text gap. The current goal is a flat, ruled section with (24px) bottom padding and margin.

The original Mu-Xun workspace docks edge-to-edge inside the phone using an inline-size container. Its wide layout has a (230px) conversation sidebar; at container widths of (620px) and below it shows either the list or selected conversation with a back button. This container threshold is independent of the phone shell's (900px) viewport breakpoint. Dock margins cancel screen padding: (-26px) desktop, (-24px) phone and (-22px -18px) narrow phone. Messenger height is `calc(var(--app-viewport,100svh) - 170px)` with (460px) minimum, changing below (430px) to a (145px) subtraction and (300px) minimum.

## Elevation & Depth

A single diffuse shadow lifts the desktop phone. Story dialogs use a deeper shadow, dark translucent backdrop and blur to focus attention; ordinary rows remain flat. The character panel uses an illustrated field above a separate pale paper copy block; the copy has no gradient overlay on the artwork. Hover transitions take (.18s); brief floating gains use a (1.6s) ease-out animation. Reduced motion disables animation, transitions and smooth scrolling in the semester and scene surfaces.

## Shapes

Soft rectangular surfaces use the frontmatter radius scale. App icons have a distinctive rounded-square shape, while active navigation is underlined and square-edged. Wardrobe choices use a forest outline and pressed state, not a decorative badge. Input borders and row rules remain fine (1px). Focus uses a clay outline (3px) with (3px) offset. Primary buttons retain the general minimum height (42px), though compact planning and filter controls have smaller observed exceptions.

## Components

Primary forest buttons commit actions; paper buttons handle secondary actions; icon buttons are transparent. Inputs are full width with clear labels, pale surfaces and a clay caret. The selected navigation destination carries a forest underline (3px), stronger weight and aria-current. Notifications are full-width sage rows with a line icon, title and short preview. Stage chips summarize progression with quiet neutral or completed sage fills.

Scene dialogs show character art, affection/stage, narrative choices and an explicit exit. At narrow widths they fill the viewport. Home scenes composite a selected atlas outfit onto an illustrated room; wash outfits, short towels and robes display character-and-product design templates. Completed wash columns isolate one fourth of a sheet at aspect ratio (.375), with the sheet at (400%) width and (100%) height. The enlarged selected column is capped at (270px). The room atlas actor is centered, full height and uses aspect ratio (.39), with authored atlas cropping rather than a stretched body. Their selected state persists through bedtime and reload without granting affection. Preserve the distinction between these two display formats.

Guided play uses the incumbent paper controls and ruled lists: ceremony has a wrapping four-step list and (17px), line-height (2) dialogue; the mobile ceremony illustration is contained at a maximum height of (230px). Contact introductions offer both exchange and decline actions. Club tabs wrap, with forest-filled selected state, one booth visible at a time, weekly schedule copy and distinct contact/join actions. Interest choices expose `aria-pressed` and use a (3px) forest outline with (2px) offset. A visible selected-count status supports multiple choices and later adjustment.

The current goal pairs a (22px) heading and practical explanation with a primary next action and secondary play guide. Independent intimacy appears as (12px) muted tabular numerals beneath affection; invitation options state current values and make the person's present answer visible. Numeric eligibility never implies consent.

Mu-Xun retains search, recent/unread/all filters, drafts, photos, quick phrases, older history, delivery queue and retry. The selected thread uses a sage fill; ordinary rows remain flat, with (15px 17px) padding. Connection and pending-message copy must distinguish retained messages from actual AI replies. System notices do not count as unread personal messages.

Chen/Yang's four wash sets use completed full-body columns. Other unfinished sets retain explicit pending labels and completed full-body short towel/robe alternatives; a previously saved pending wash choice displays the completed robe with explanatory copy without resetting that choice. Existing home atlas art remains labelled an old draft that does not yet match the requested template. These accepted limitations do not establish unfinished art as a visual target.

Account-gate CSS is a deferred surface, not the active default: it uses a centered (440px) form, warm cream, green ink, Georgia/Noto Serif headings and (48px) controls. Its presence does not establish enabled cloud accounts. The current settings must describe local browser saving, export/import and separately retained legacy progress accurately.

**The Artwork Truth Rule.** Show the illustration in its actual format and name its completion level accurately.

## Do's and Don'ts

- Do preserve distinct adult character faces and coherent two-dimensional anime rendering.
- Do keep the current destination, daily slots and selected wardrobe state visible.
- Do label clothing templates as design previews and disclose local saving.
- Do retain keyboard focus, explicit scene exits and reduced motion support.
- Don't describe character plates or clothing design previews as unique full-screen scene CGs.
- Don't claim cloud saving, account availability or completed artwork without implementation evidence.
- Don't give clothing choices an implied affection reward or consent to other interactions.

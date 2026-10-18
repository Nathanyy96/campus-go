---
version: 1
slug: "walk-view-js"
primary_target: "walk-view.js"
related_targets: ["walk-world.js","app.js","index.html","style.css"]
---

# Walkable campus extension
Mode: Experience within established Campus Go green/paper UI. User explicitly wants a playable 2D scene, not only destination buttons.
## Direction contract
THESIS: Move through the campus, approach a door/person/object, and interact at that location.
OWN-WORLD: Preserve incumbent green ink/paper panels and photographic profiles. Canvas uses code-native game geometry and small neutral walking avatars, not replacements for portrait identity.
STORY: Start in plaza, walk via keys or tap-to-path, enter classroom, approach an actual occupant or furniture, study/rest and exit. World time advances by distance, existing schedules update. Overview remains fast navigation.
FIRST VIEWPORT: Scene is primary with camera following player, distinct buildings and doors, actual classmates, small positional minimap. Contextual E action and mobile direction controls immediately beneath scene. Mobile places play area before management sidebar.
FORM: Local code-led replacement of exploration interaction in existing page, no new global identity or raster comp. Signature: physically walking to a classroom door, E enter, walk up to a classmate; no teleport on keypress.
FINISH: Desktop/mobile actual gameplay and screenshots; collision/path/legacy tests; finish reviewer and documenter. No new raster assets.
Boundaries: All existing students/save/calendar/relationship/AI features retained. Interiors use shared functional layouts by place type, not hand-authored unique art for every room. NPCs follow schedule, indoor seating positions are visual staging. No new portrait images in this change.
